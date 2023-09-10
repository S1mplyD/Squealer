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
        if (timedSqueals instanceof SquealerError) res.sendStatus(404);
        else res.status(200).send(timedSqueals);
      } else res.sendStatus(401);
    } catch (error: any) {
      console.log(error);
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
        res.sendStatus(401);
      else {
        const squeal: TimedSqueal = req.body;
        const newSqueal: TimedSqueal | SquealerError = await postTimedSqueal(
          squeal,
          (req.user as User).username
        );
        if (newSqueal instanceof SquealerError) res.sendStatus(500);
        else {
          const ret: SquealerError | Success = await startTimer(
            newSqueal,
            (req.user as User)._id
          );
          if (ret instanceof SquealerError) res.sendStatus(404);
          res.sendStatus(201);
        }
      }
    } catch (error: any) {
      console.log(error);
    }
  })
  /**
   * DELETE
   * elimina uno squeal temporizzato
   */
  .delete(async (req, res) => {
    try {
      if (!req.user) res.sendStatus(401);
      else if ((req.user as User).plan === "admin") {
        const ret: SquealerError | Success = await deleteTimedSqueal(
          req.query.id as string
        );
        if (ret instanceof SquealerError) res.sendStatus(500);
        else res.sendStatus(200);
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
            if (returnValue instanceof SquealerError) res.sendStatus(500);
            else res.sendStatus(200);
          } else res.sendStatus(401);
        }
      }
    } catch (error: any) {
      console.log(error);
    }
  });
