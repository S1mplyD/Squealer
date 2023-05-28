import {
  getSquealsByChannel,
  deleteSqueal,
  getAllSqueals,
  getSquealsByRecipients,
  postSqueal,
} from "../database/querys/squeals";
import express from "express";
import { startTimer } from "../util/timers";
import { TimedSqueal } from "../util/types";
export const router = express.Router();

router
  .route("/")
  /**
   * GET
   * Ritorna tutti gli squeal
   */
  .get(async (req, res) => {
    try {
      const squeals: any = await getAllSqueals();
      res.status(200).send(squeals);
    } catch (error) {
      console.log(error);
    }
  })
  /**
   * POST
   * Pubblica un nuovo squeal
   */
  .post(async (req, res) => {
    try {
      await postSqueal(req.body);
    } catch (error) {
      console.log(error);
    }
  })
  /**
   * DELETE
   * Elimina uno squeal
   */
  .delete(async (req, res) => {
    try {
      await deleteSqueal(req.query.id as string);
    } catch (error) {
      console.log(error);
    }
  });

router
  .route("/recipients")
  /**
   * GET
   * ritorna tutti gli squeal appartenenti ai recipients ricercati
   */
  .get(async (req, res) => {
    try {
      const squeals: any = await getSquealsByRecipients(req.body.recipients);
      res.status(200).send(squeals);
    } catch (error) {
      console.log(error);
    }
  });

router
  .route("/channels")
  /**
   * GET
   * ritorna tutti gli squeal appartenenti ai canali ricercati
   */
  .get(async (req, res) => {
    try {
      const squeals: any = await getSquealsByChannel(req.body.channels);
      res.status(200).send(squeals);
    } catch (error) {
      console.log(error);
    }
  });

router
  .route("/timed")
  /**
   * POST
   * aggiunge uno squeal temporizzato
   */
  .post(async (req, res) => {
    try {
      const time: number = req.query.time as unknown as number;
      const squeal: TimedSqueal = req.body.squeal;
      const id: string = req.query.id as string;
      startTimer(squeal);
    } catch (error) {
      console.log(error);
    }
  });
