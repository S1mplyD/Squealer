import express from "express";
import { Squeal, User } from "../util/types";
import {
    getAllUserSquealsResponses,
    getControversialPosts,
    getPopularPosts,
    getUnpopularPosts,
} from "../database/queries/analytics";
import { getUserByUsername } from "../database/queries/users";

export const router = express.Router();

router.route("/responses/:username").get(async (req, res) => {
    try {
        const user = await getUserByUsername(req.params.username);
        if (
            req.user &&
            ((req.user as User).managedAccounts.includes(user._id) ||
                (req.user as User).username === user.username)
        ) {
            const responses:
                | { originalSqueal: Squeal; responses: Squeal[] }[]
                | undefined = await getAllUserSquealsResponses(req.params.username);
            if (responses) res.status(200).send(responses);
            else res.sendStatus(404);
        } else res.sendStatus(401);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.route("/popular/:username").get(async (req, res) => {
    try {
        const user = await getUserByUsername(req.params.username);
        if (
            req.user &&
            ((req.user as User).managedAccounts.includes(user._id) ||
                (req.user as User).username === user.username)
        ) {
            const squeals: Squeal[] = await getPopularPosts(req.params.username);
            res.status(200).send(squeals);
        } else res.sendStatus(401);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.route("/unpopular/:username").get(async (req, res) => {
    try {
        const user = await getUserByUsername(req.params.username);
        if (
            req.user &&
            ((req.user as User).managedAccounts.includes(user._id) ||
                (req.user as User).username === user.username)
        ) {
            const squeals: Squeal[] = await getUnpopularPosts(req.params.username);
            res.status(200).send(squeals);
        } else res.sendStatus(401);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.route("/controversial/:username").get(async (req, res) => {
    try {
        const user = await getUserByUsername(req.params.username);
        if (
            req.user &&
            ((req.user as User).managedAccounts.includes(user._id) ||
                (req.user as User).username === user.username)
        ) {
            const squeals: Squeal[] = await getControversialPosts(
                req.params.username,
            );
            res.status(200).send(squeals);
        } else res.sendStatus(401);
    } catch (e) {
        res.status(500).send(e);
    }
});
