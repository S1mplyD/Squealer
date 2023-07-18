import express from "express";
import { Error, TimedSqueal, User } from "../util/types";
import {
  deleteTimedSqueal,
  getAllTimers,
  postTimedSqueal,
} from "../database/querys/timedSqueal";
import { startTimer } from "../util/timers";
import { Success } from "../util/success";

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
      const squeal: TimedSqueal = req.body;
      const newSqueal: TimedSqueal = await postTimedSqueal(
        squeal,
        (req.user as User).username
      );
      const ret: Error | Success = await startTimer(
        newSqueal,
        (req.user as User).username
      );
      res.send(ret);
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
      const ret: Error | Success | undefined = await deleteTimedSqueal(
        req.query.id as string
      );
      res.send(ret);
    } catch (error: any) {
      res.send({ errorName: error.name, errorDescription: error.message });
    }
  });
