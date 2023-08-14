import GoogleStrategy from "passport-google-oauth20";
import LocalStrategy from "passport-local";
import passport = require("passport");
import userModel from "../database/models/users.model";
import {
  getAllUsers,
  createDefaultUser,
  updatePassword,
  updateResetToken,
} from "../database/querys/users";
import express from "express";
import bcrypt from "bcryptjs";
import { sendMail } from "../util/mail";
import { config } from "dotenv";
import { generate } from "randomstring";
import { Success, logged_in, sent, signed_up } from "../util/success";
import { cannot_send, cannot_update, non_existent } from "../util/errors";
import { Error, User } from "../util/types";
config();

export const router = express.Router();

/**
 * Autenticazione tramite google
 */
passport.use(
  new GoogleStrategy.Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: "http://localhost:3000/api/auth/google/callback",
    },
    (accessToken: any, refreshToken: any, profile: any, done: any) => {
      userModel.findOne({ serviceId: profile.id }).then((currentUser: any) => {
        if (!currentUser) {
          //Utente non registrato, lo creo
          userModel
            .create({
              name: profile.displayName,
              username: profile.displayName,
              mail: profile._json.email,
              serviceId: profile.id,
              profilePicture: profile._json.picture,
            })
            .then((newUser) => {
              done(null, newUser);
            });
        } else {
          done(null, currentUser);
        }
      });
    }
  )
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/");
  }
);

/**
 * Autenticazione locale
 */
passport.use(
  new LocalStrategy.Strategy(async (username, password, done) => {
    try {
      const user = await userModel.findOne({ mail: username }).exec();

      if (!user) {
        return done(null, false);
      }
      const isPasswordValid = await bcrypt.compare(password, user.password!);
      if (!isPasswordValid) {
        return done(null, false);
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

/**
 * Strategia per la registrazione locale
 */
passport.use(
  "local-signup",
  new LocalStrategy.Strategy(
    { passReqToCallback: true },
    async (req, username, password, done) => {
      try {
        const user = await userModel.findOne({ username: username }).exec();

        if (user) {
          return done(null, false);
        } else {
          const encryptedPassword = await bcrypt.hash(password, 10);
          const newUser = await createDefaultUser(
            req.body.name,
            username,
            req.body.mail,
            encryptedPassword
          );
          if (newUser) {
            return done(null, newUser);
          } else {
            return done(null, false);
          }
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);

router.post("/login", passport.authenticate("local"), function (req, res) {
  if (req.user) {
    res.send(req.user);
  }
});

router.post("/register", passport.authenticate("local-signup"), (req, res) => {
  if (req.user) res.send(signed_up);
});

passport.deserializeUser((id, done) => {
  userModel.findById(id).then((user: any) => {
    done(null, user);
  });
});

passport.serializeUser((user: any, cb) => {
  process.nextTick(() => {
    return cb(null, user.id);
  });
});

/**
 * Logout
 */
router.get("/logout", (req, res, next) => {
  try {
    req.logOut((err) => {
      if (err) {
        return next(err);
      }
      res.status(200).redirect("/");
    });
  } catch (error: any) {
    res.send({ errorName: error.name, errorDescription: error.message });
  }
});
router
  .route("/forgotPassword")
  /**
   * Genero un token e lo invio per mail all'utente
   */
  .get(async (req, res) => {
    const mail: string = req.query.mail as string;
    const token: string = generate();

    const returnValue = await sendMail(token, mail);
    const queryResult: Error | Success | undefined = await updateResetToken(
      mail,
      token
    );
    if (queryResult === undefined) return cannot_update;
    else if (returnValue instanceof Error) return returnValue;
    else res.send(sent);
  })
  /**
   * controllo se il token inserito dall'utente è uguale a quello del server e aggiorno la password
   */
  .post(async (req, res) => {
    const token: any = req.body.token;
    const mail: any = req.query.mail;
    const user: any = await userModel.findOne({ mail: mail });
    const password: any = req.body.password;
    const encryptedPassword = await bcrypt.hash(password, 10);
    if (token === user.resetToken) {
      const ret: Error | Success | undefined = await updatePassword(
        mail,
        encryptedPassword
      );
      if (!ret) {
        res.send(cannot_update);
      } else {
        res.send(ret);
      }
    }
  });

/**
 * GET
 * funzione che ritorna tutti gli utenti
 */
router.route("/").get(async (req, res) => {
  try {
    const users: User[] | Error | undefined = await getAllUsers();
    if (users === undefined) res.send(non_existent);
    else res.send(users);
  } catch (error: any) {
    res.send({ errorName: error.name, errorDescription: error.message });
  }
});
