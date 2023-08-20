import express from "express";
import { Analytic, User } from "../util/types";
import { getAllUserAnalytics, getAnalytic } from "../database/querys/analytics";
import { SquealerError, catchError, unauthorized } from "../util/errors";

export const router = express.Router();

router
  .route("/:id")
  /**
   * GET
   * chiamata che ritorna tutte le analitiche di tutti gli squeal di un utente
   */
  .get(async (req, res) => {
    try {
      if (req.user && (req.user as User).status !== "ban") {
        if ((req.user as User).plan === "admin") {
          const analytics: Analytic[] | SquealerError =
            await getAllUserAnalytics(req.params.id);
          res.send(analytics);
        } else if (
          (req.user as User)._id === req.params.id ||
          (req.user as User).managedAccounts.includes(req.params.id)
        ) {
          const analytics: Analytic[] | SquealerError =
            await getAllUserAnalytics(req.params.id);
          res.send(analytics);
        } else res.send(unauthorized);
      } else res.send(unauthorized);
    } catch (error: any) {
      catchError(error);
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
        const analytic: Analytic | SquealerError = await getAnalytic(
          req.query.id as string
        );
        if (analytic instanceof SquealerError) {
          res.send(analytic);
        } else {
          if ((req.user as User).plan === "admin") {
            res.send(analytic);
          } else if ((req.user as User)._id === analytic.author) {
            res.send(analytic);
          } else res.send(unauthorized);
        }
      } else res.send(unauthorized);
    } catch (error) {
      catchError(error);
    }
  });
