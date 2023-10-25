import GoogleStrategy from "passport-google-oauth20";
import LocalStrategy from "passport-local";
import passport = require("passport");
import userModel from "../database/models/users.model";
import {
  createDefaultUser,
  updatePassword,
  updateResetToken,
  createUserUsingGoogle,
} from "../database/querys/users";
import express from "express";
import bcrypt from "bcryptjs";
import { sendMail } from "../util/mail";
import { config } from "dotenv";
import { generate } from "randomstring";
import { Success, sent } from "../util/success";
import { SquealerError } from "../util/errors";
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
      userModel
        .findOne({ serviceId: profile.id })
        .then(async (currentUser: any) => {
          if (!currentUser) {
            //Utente non registrato, lo creo
            const newUser = await createUserUsingGoogle(
              profile.displayName,
              profile.displayName.replaceAll(" ", "_"),
              profile._json.email,
              profile.id,
              profile._json.picture,
              new Date()
            );
            if (newUser) return done(null, newUser);
            else return done(null, false);
          } else {
            done(null, currentUser);
          }
        });
    }
  )
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

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
  (req, res) => {
    if (req.user) res.status(200).send(req.user);
  }
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    res.status(200).redirect("/");
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

router.post("/login", passport.authenticate("local"), function (req, res) {
  if (req.user) {
    res.status(200).send(req.user);
  } else res.sendStatus(500);
});

router.post("/register", passport.authenticate("local-signup"), (req, res) => {
  if (req.user) res.send(req.user);
  else res.sendStatus(500);
});

passport.deserializeUser((id, done) => {
  userModel.findById(id).then((user: any) => {
    done(null, user);
  });
});

passport.serializeUser((user: any, cb) => {
  process.nextTick(() => {
    return cb(null, user._id);
  });
});

/**
 * Logout
 */
router.post("/logout", (req, res) => {
  try {
    req.logOut((err) => {
      if (err) {
        console.log(err);
      }
      res.redirect("/");
    });
  } catch (error: any) {
    console.log(error);
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
    const queryResult: SquealerError | Success | undefined =
      await updateResetToken(mail, token);
    if (queryResult === undefined) res.sendStatus(500);
    else if (returnValue instanceof SquealerError) res.sendStatus(500);
    else res.status(200);
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
      const ret: SquealerError | Success = await updatePassword(
        mail,
        encryptedPassword
      );
      console.log(ret);
      if (ret instanceof SquealerError) {
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    }
  });
