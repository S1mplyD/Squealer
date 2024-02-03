import GoogleStrategy from "passport-google-oauth20";
import LocalStrategy from "passport-local";
import passport = require("passport");
import userModel from "../database/models/users.model";
import {
    createDefaultUser,
    updatePassword,
    updateResetToken,
    createUserUsingGoogle,
} from "../database/queries/users";
import express from "express";
import bcrypt from "bcryptjs";
import { sendMail } from "../util/mail";
import { config } from "dotenv";
import { generate } from "randomstring";
import { Success } from "../util/success";
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
                            new Date(),
                        );
                        if (newUser) return done(null, newUser);
                        else return done(null, false);
                    } else {
                        done(null, currentUser);
                    }
                });
        },
    ),
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
                        encryptedPassword,
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
        },
    ),
);

router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] }),
    (req, res) => {
        if (req.user) res.status(200).send(req.user);
    },
);

router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    function(req, res) {
        res.status(200).redirect("/");
    },
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
    }),
);

router.post("/login", passport.authenticate("local"), function(req, res) {
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
router.get("/logout", (req, res) => {
    try {
        req.logout((err) => {
            if (err) console.log(err);
        });
        res.status(200).redirect("/");
    } catch (error: any) {
        res.status(500).send(error);
    }
});
router
    .route("/forgotPassword/:mail")
    /**
     * Genero un token e lo invio per mail all'utente
     */
    .get(async (req, res) => {
        try {
            const mail: string = req.params.mail as string;
            const token: string = generate();

            await sendMail(token, mail);
            await updateResetToken(mail, token);
            res.status(200).send(token);
        } catch (e) {
            res.status(500).send(e);
        }
    })
    /**
     * controllo se il token inserito dall'utente è uguale a quello del server e aggiorno la password
     */
    .post(async (req, res) => {
        try {
            const token: any = req.body.token;
            const mail: any = req.params.mail;
            const user: any = await userModel.findOne({ mail: mail });
            const password: any = req.body.password;
            const encryptedPassword = await bcrypt.hash(password, 10);
            if (token === user.resetToken) {
                const ret: Success = await updatePassword(mail, encryptedPassword);
                res.sendStatus(200);
            }
        } catch (e) {
            res.status(500).send(e);
        }
    });
