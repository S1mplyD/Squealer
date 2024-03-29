import express from "express";
import {
    followUser,
    getAllFollowers,
    getAllFollowing,
    unfollowUser,
} from "../API/follow";
import { Success, User } from "../util/types";
import { SquealerError } from "../util/errors";

export const router = express.Router();

/**
 * chiamata che ritorna il numero di followers di un utente
 */
router.route("/followers/:username").get(async (req, res) => {
    try {
        if (req.user) {
            const followers: User[] | SquealerError = await getAllFollowers(
                req.params.username as string,
            );
            res.status(200).send(followers);
        } else res.sendStatus(401);
    } catch (error: any) {
        if (error instanceof SquealerError) res.sendStatus(404);
        else res.status(500).send(error);
    }
});

/**
 * chiamata che ritorna tutti i seguiti di un utente
 */
router.route("/following/:username").get(async (req, res) => {
    try {
        if (req.user) {
            const following: User[] | SquealerError = await getAllFollowing(
                req.params.username as string,
            );
            res.status(200).send(following);
        } else res.sendStatus(401);
    } catch (error: any) {
        if (error instanceof SquealerError) res.sendStatus(404);
        else res.status(500).send(error);
    }
});

/**
 * chiamata per seguire un utente
 */
router.route("/follow/:username").post(async (req, res) => {
    try {
        if (
            req.user &&
            ((req.user as User).status !== "ban" ||
                (req.user as User).status !== "block")
        ) {
            await followUser((req.user as User)._id, req.params.username as string);
            res.sendStatus(200);
        } else res.sendStatus(401);
    } catch (error: any) {
        res.status(500).send(error);
    }
});

/**
 * chiamata per smettere di seguire un utente
 */
router.route("/unfollow/:username").post(async (req, res) => {
    try {
        if (
            req.user &&
            ((req.user as User).status !== "ban" ||
                (req.user as User).status !== "block")
        ) {
            const update: SquealerError | Success = await unfollowUser(
                (req.user as User)._id,
                req.params.username as string,
            );
            if (update instanceof SquealerError) res.sendStatus(500);
            else res.sendStatus(200);
        } else res.sendStatus(401);
    } catch (error: any) {
        res.status(500).send(error);
    }
});
