import express from "express";
import { Analytic, Squeal, User } from "../util/types";
import {
  getAllUserAnalytics,
  getAllUserSquealsResponses,
  getAnalytic,
} from "../database/queries/analytics";
import { SquealerError, unauthorized } from "../util/errors";
import { getUserByUsername } from "../database/queries/users";

export const router = express.Router();

router
  .route("/:username")
  /**
   * GET
   * chiamata che ritorna tutte le analitiche di tutti gli squeal di un utente
   */
  .get(async (req, res) => {
    try {
      if (req.user && (req.user as User).status !== "ban") {
        if ((req.user as User).plan === "admin") {
          const analytics: Analytic[] = await getAllUserAnalytics(
            req.params.username,
          );
          res.status(200).send(analytics);
        } else if (
          (req.user as User)._id === req.params.username ||
          (req.user as User).managedAccounts.includes(req.params.username)
        ) {
          const analytics: Analytic[] = await getAllUserAnalytics(
            req.params.username,
          );
          res.status(200).send(analytics);
        } else res.sendStatus(401);
      } else res.sendStatus(401);
    } catch (error: any) {
      if (error instanceof SquealerError) {
        res.status(404).send(error);
      } else res.status(500).send(error);
    }
  });

router
  .route("/analytic")
  /**
   * GET
   * chiamata che ritorna le analitiche di uno squeal
   */
  .get(async (req, res) => {
    try {
      if (req.user && (req.user as User).status !== "ban") {
        const analytic: Analytic = await getAnalytic(req.query.id as string);
        if ((req.user as User).plan === "admin") {
          res.status(200).send(analytic);
        } else if ((req.user as User)._id === analytic.author) {
          res.status(200).send(analytic);
        } else res.sendStatus(401);
      } else res.sendStatus(401);
    } catch (error) {
      if (error instanceof SquealerError) {
        res.status(404).send(error);
      } else res.status(500).send(error);
    }
  });

router.route("/responses/:username").get(async (req, res) => {
  try {
    const user = await getUserByUsername(req.params.username);
    if (
      req.user &&
      ((req.user as User).managedAccounts.includes(user.username) ||
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
  router.route("/popular/:username").get(async (req, res) => {
    const user = await getUserByUsername(req.params.username);
    if (
      req.user &&
      ((req.user as User).managedAccounts.includes(user.username) ||
        (req.user as User).username === user.username)
    ) {
    } else res.sendStatus(401);
  });
});
