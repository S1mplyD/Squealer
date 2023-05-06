import GoogleStrategy from "passport-google-oauth20";
import LocalStrategy from "passport-local";
import passport = require("passport");
import { userModel } from "../database/models/users.model";
import {
  createDefaultUser,
  createUserUsingGoogle,
} from "../database/querys/users";
import express from "express";
import bcrypt from "bcryptjs";

const router = express.Router();

/**
 * Autenticazione tramite google
 */
passport.use(
  new GoogleStrategy.Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:8000/auth/google/callback",
    },
    (accessToken: any, refreshToken: any, profile: any, done: any) => {
      userModel.findOne({ serviceId: profile.id }).then((currentUser: any) => {
        if (!currentUser) {
          //Utente non registrato, lo creo
          createUserUsingGoogle(
            profile.displayName,
            profile.displayName,
            profile._json.email,
            profile.id,
            profile._json.picture
          ).then((newUser) => {
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
  passport.authenticate("google", { scope: ["email", "profile"] })
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
  new LocalStrategy.Strategy((username, password, done) => {
    userModel.findOne({ mail: username }, async (err: any, user: any) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      if (!(await bcrypt.compare(password, user.password))) {
        return done(null, false);
      }
      return done(null, user);
    });
  })
);

/**
 * Strategia per la registrazione locale
 */
passport.use(
  "local-signup",
  new LocalStrategy.Strategy(
    { passReqToCallback: true },
    (req, username, password, done) => {
      userModel.findOne({ username: username }, async (err: any, user: any) => {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(null, false);
        } else {
          const encryptedPassword = await bcrypt.hash(password, 10);
          createDefaultUser(
            req.body.name,
            username,
            req.body.mail,
            encryptedPassword
          ).then((user) => {
            return done(null, user!);
          });
        }
      });
    }
  )
);

router.post("/login", passport.authenticate("local"), function (req, res) {
  res.json();
});

router.post("/register", passport.authenticate("local-signup"), (req, res) => {
  res.json();
});

passport.deserializeUser((id, done) => {
  userModel.findById(id).then((user) => {
    done(null, user);
  });
});

passport.serializeUser((user, cb) => {
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
  } catch (error) {
    console.log(error);
  }
});
