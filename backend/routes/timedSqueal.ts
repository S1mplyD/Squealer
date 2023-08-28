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
      if (!req.user || (req.user as User).status !== "ban") {
        const timedSqueals: TimedSqueal[] | SquealerError =
          await getAllTextTimers();
        if (timedSqueals instanceof SquealerError)
          res.status(404).send(timedSqueals);
        else res.status(200).send(timedSqueals);
      } else res.status(401).send(unauthorized);
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
      if (
        !req.user ||
        (req.user as User).status === "ban" ||
        (req.user as User).status === "block"
      )
        res.status(401).send(unauthorized);
      else {
        const squeal: TimedSqueal = req.body;
        const newSqueal: TimedSqueal | SquealerError = await postTimedSqueal(
          squeal,
          (req.user as User).username
        );
        if (newSqueal instanceof SquealerError) res.status(500).send(newSqueal);
        else {
          const ret: SquealerError | Success = await startTimer(
            newSqueal,
            (req.user as User)._id
          );
          if (ret instanceof SquealerError) res.status(404).send(ret);
          res.status(201).send(ret);
        }
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
      if (!req.user) res.status(401).send(unauthorized);
      else if ((req.user as User).plan === "admin") {
        const ret: SquealerError | Success = await deleteTimedSqueal(
          req.query.id as string
        );
        if (ret instanceof SquealerError) res.status(500).send(ret);
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
            const returnValue: SquealerError | Success =
              await deleteTimedSqueal(req.query.id as string);
            if (returnValue instanceof SquealerError)
              res.status(500).send(returnValue);
            else res.status(200).send(returnValue);
          } else res.status(401).send(unauthorized);
        }
      }
    } catch (error: any) {
      catchError(error);
    }
  });
