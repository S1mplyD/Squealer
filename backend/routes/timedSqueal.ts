import express from "express";
import { TimedSqueal, User } from "../util/types";
import {
  deleteTimedSqueal,
  getAllTextTimers,
  getTimedSqueal,
  postTimedSqueal,
} from "../database/querys/timedSqueal";
import { startTimer } from "../API/timers";
import { Success } from "../util/success";
import { SquealerError, catchError, unauthorized } from "../util/errors";

export const router = express.Router();

router
  .route("/")
  /**
   * GET
   * chiamata che ritorna tutti gli squeal temporizzati
   */
  .get(async (req, res) => {
    try {
      const timedSqueals: TimedSqueal[] | SquealerError | undefined =
        await getAllTextTimers();
      res.send(timedSqueals);
    } catch (error: any) {
      catchError(error);
    }
  })
  /**
   * POST
   * aggiunge uno squeal temporizzato
   */
  .post(async (req, res) => {
    try {
      if (!req.user) res.send(unauthorized);
      else {
        const squeal: TimedSqueal = req.body;
        const newSqueal: TimedSqueal = await postTimedSqueal(
          squeal,
          (req.user as User).username
        );
        const ret: SquealerError | Success = await startTimer(
          newSqueal,
          (req.user as User)._id
        );
        res.send(ret);
      }
    } catch (error: any) {
      catchError(error);
    }
  })
  /**
   * DELETE
   * elimina uno squeal temporizzato
   */
  .delete(async (req, res) => {
    try {
      if (!req.user) res.send(unauthorized);
      else if ((req.user as User).plan === "admin") {
        const ret: SquealerError | Success | undefined =
          await deleteTimedSqueal(req.query.id as string);
        res.send(ret);
      } else {
        //Se l'utente non è admin allora controllo che sia l'autore dello squeal e poi cancello
        const squeal: TimedSqueal | SquealerError = await getTimedSqueal(
          req.query.id as string
        );
        if (squeal instanceof SquealerError) return squeal;
        else {
          if (
            (squeal as TimedSqueal).author === (req.user as User).username ||
            (req.user as User).managedAccounts.includes(
              (squeal as TimedSqueal).author as string
            )
          ) {
            const returnValue: SquealerError | Success | undefined =
              await deleteTimedSqueal(req.query.id as string);
            res.send(returnValue);
          } else res.send(unauthorized);
        }
      }
    } catch (error: any) {
      catchError(error);
    }
  });
