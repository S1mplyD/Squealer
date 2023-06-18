import {
  getSquealsByChannel,
  deleteSqueal,
  getAllSqueals,
  getSquealsByRecipients,
  postTextSqueal,
  getAllTimers,
  getMediaSqueals,
  getTextSqueals,
  getGeoSqueals,
  postGeoSqueal,
  postMediaSqueal,
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
   * DELETE
   * Elimina uno squeal
   */
  .delete(async (req, res) => {
    try {
      await deleteSqueal(req.query.id as string).then((ret) => {
        res.send(ret);
      });
    } catch (error) {
      console.log(error);
    }
  });

router
  .route("/media")
  .get(async (req, res) => {
    try {
      const squeals: any = await getMediaSqueals();
      res.send(squeals);
    } catch (error) {
      res.send(error);
    }
  })
  //TODO
  .post(async (req, res) => {
    try {
      const newSqueal: any = await postMediaSqueal(
        req.body,
        req.query.filename as string
      );
      res.send(newSqueal);
    } catch (error) {
      console.log(error);
    }
  });

router
  .route("/text")
  .get(async (req, res) => {
    try {
      const squeals: any = await getTextSqueals();
      res.send(squeals);
    } catch (error) {
      res.send(error);
    }
  })
  .post(async (req, res) => {
    try {
      const ret: any = await postTextSqueal(req.body);
      res.send(ret);
    } catch (error) {
      console.log(error);
    }
  });

router
  .route("/geo")
  .get(async (req, res) => {
    try {
      const squeals: any = await getGeoSqueals();
      res.send(squeals);
    } catch (error) {
      res.send(error);
    }
  })
  .post(async (req, res) => {
    try {
      const ret: any = await postGeoSqueal(req.body);
      res.send(ret);
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
  .get(async (req, res) => {
    try {
      const timedSqueals: any = await getAllTimers();
      res.send(timedSqueals);
    } catch (error: any) {
      console.log({ errorName: error.name, errorDescription: error.message });
      res.send({ errorName: error.name, errorDescription: error.message });
    }
  })
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
  })
  //TODO
  .delete();
