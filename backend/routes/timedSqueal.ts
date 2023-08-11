import express from "express";
import { Error, TimedSqueal, User } from "../util/types";
import {
  deleteTimedSqueal,
  getAllTimers,
  getTimedSqueal,
  postTimedSqueal,
} from "../database/querys/timedSqueal";
import { startTimer } from "../util/timers";
import { Success } from "../util/success";
import { unauthorized } from "../util/errors";
import mongoose from "mongoose";

export const router = express.Router();

router
  .route("/")
  /**
   * GET
   * chiamata che ritorna tutti gli squeal temporizzati
   */
  .get(async (req, res) => {
    try {
      const timedSqueals: TimedSqueal[] | Error | undefined =
        await getAllTimers();
      res.send(timedSqueals);
    } catch (error: any) {
      res.send({ errorName: error.name, errorDescription: error.message });
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
          (req.user as User).username,
        );
        const ret: Error | Success = await startTimer(
          newSqueal,
          (req.user as User)._id,
        );
        res.send(ret);
      }
    } catch (error: any) {
      res.send({ errorName: error.name, errorDescription: error.message });
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
        const ret: Error | Success | undefined = await deleteTimedSqueal(
          req.query.id as string,
        );
        res.send(ret);
      } else {
        //Se l'utente non è admin allora controllo che sia l'autore dello squeal e poi cancello
        const squeal: TimedSqueal | Error = await getTimedSqueal(
          req.query.id as unknown as mongoose.Types.ObjectId,
        );
        if (squeal instanceof Error) return squeal;
        else {
          if (
            (squeal as TimedSqueal).author === (req.user as User).username ||
            (req.user as User).managedAccounts.includes(
              (squeal as TimedSqueal).author as string,
            )
          ) {
            const returnValue: Error | Success | undefined =
              await deleteTimedSqueal(req.query.id as string);
            res.send(returnValue);
          } else res.send(unauthorized);
        }
      }
    } catch (error: any) {
      res.send({ errorName: error.name, errorDescription: error.message });
    }
  });
