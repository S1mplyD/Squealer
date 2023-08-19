import express from "express";
import { Error, TimedSquealGeo, User } from "../util/types";
import {
  deleteTimedSquealGeo,
  getAllGeoTimers,
  getTimedSquealGeo,
  postTimedSquealGeo,
} from "../database/querys/timedSquealGeo";
import { startTimer } from "../util/timers";
import { Success } from "../util/success";
import { catchError, unauthorized } from "../util/errors";
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
      const timedSquealGeos: TimedSquealGeo[] | Error | undefined =
        await getAllGeoTimers();
      res.send(timedSquealGeos);
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
        const squeal: TimedSquealGeo = req.body;
        const newSqueal: TimedSquealGeo = await postTimedSquealGeo(
          squeal,
          (req.user as User).username
        );
        const ret: Error | Success = await startTimer(
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
        const ret: Error | Success | undefined = await deleteTimedSquealGeo(
          req.query.id as string
        );
        res.send(ret);
      } else {
        //Se l'utente non è admin allora controllo che sia l'autore dello squeal e poi cancello
        const squeal: TimedSquealGeo | Error = await getTimedSquealGeo(
          req.query.id as string
        );
        if (squeal instanceof Error) return squeal;
        else {
          if (
            (squeal as TimedSquealGeo).author === (req.user as User).username ||
            (req.user as User).managedAccounts.includes(
              (squeal as TimedSquealGeo).author as string
            )
          ) {
            const returnValue: Error | Success | undefined =
              await deleteTimedSquealGeo(req.query.id as string);
            res.send(returnValue);
          } else res.send(unauthorized);
        }
      }
    } catch (error: any) {
      catchError(error);
    }
  });
