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
import { TimedSqueal, Error } from "../util/types";
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
  });

router
  .route("/media")
  /**
   * GET
   * chiamata che ritorna tutti i media squeal
   */
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
  .route("/text")
  /**
   * GET
   * chiamata che ritorna tutti i text squeals
   */
  .get(async (req, res) => {
    try {
      const squeals: any = await getTextSqueals();
      res.send(squeals);
    } catch (error) {
      res.send(error);
    }
  })
  /**
   * POST
   * chiamata per creare un text squeal
   */
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
  /**
   * GET
   * chiamata che ritorna tutti i geo squeals
   */
  .get(async (req, res) => {
    try {
      const squeals: any = await getGeoSqueals();
      res.send(squeals);
    } catch (error) {
      res.send(error);
    }
  })
  /**
   * POST
   * chiamata per creare un geo squeal
   */
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
      const squeals: any = await getSquealsByRecipients(
        req.query.recipient as string
      );
      res.send(squeals);
    } catch (error) {
      console.log(error);
    }
  });

router
  .route("/channels")
  /**
   * GET
   * ritorna tutti gli squeal appartenenti ad un canale
   */
  .get(async (req, res) => {
    try {
      const squeals: any = await getSquealsByChannel(
        req.query.channel as string
      );
      res.send(squeals);
    } catch (error) {
      console.log(error);
    }
  });

router
  .route("/timed")
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
      const squeal: TimedSqueal = req.body.squeal;
      startTimer(squeal);
    } catch (error) {
      console.log(error);
    }
  })
  //TODO
  .delete(async (req, res) => {});
