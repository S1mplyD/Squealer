import express from "express";
import { TimedSquealGeo, User } from "../util/types";
import {
  deleteTimedSquealGeo,
  getAllGeoTimers,
  getTimedSquealGeo,
  postTimedSquealGeo,
} from "../database/querys/timedSquealGeo";
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
        const timedSquealGeos: TimedSquealGeo[] | SquealerError =
          await getAllGeoTimers();
        if (timedSquealGeos instanceof SquealerError)
          res.status(404).send(timedSquealGeos);
        else res.status(200).send(timedSquealGeos);
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
        const squeal: TimedSquealGeo = req.body;
        const newSqueal: TimedSquealGeo | SquealerError =
          await postTimedSquealGeo(squeal, (req.user as User).username);
        if (newSqueal instanceof SquealerError) res.status(500).send(newSqueal);
        else {
          const ret: SquealerError | Success = await startTimer(
            newSqueal,
            (req.user as User)._id
          );
          if (ret instanceof SquealerError) res.status(500).send(ret);
          else res.status(201).send(ret);
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
        const ret: SquealerError | Success = await deleteTimedSquealGeo(
          req.query.id as string
        );
        if (ret instanceof SquealerError) res.status(500).send(ret);
        else res.status(200).send(ret);
      } else {
        //Se l'utente non è admin allora controllo che sia l'autore dello squeal e poi cancello
        const squeal: TimedSquealGeo | SquealerError = await getTimedSquealGeo(
          req.query.id as string
        );
        if (squeal instanceof SquealerError) res.status(404).send(squeal);
        else {
          if (
            (squeal as TimedSquealGeo).author === (req.user as User).username ||
            (req.user as User).managedAccounts.includes(
              (squeal as TimedSquealGeo).author as string
            )
          ) {
            const returnValue: SquealerError | Success =
              await deleteTimedSquealGeo(req.query.id as string);
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
