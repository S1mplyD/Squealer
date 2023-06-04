import express from "express";
import {
  getAllChannels,
  addSquealToChannel,
  createChannel,
  deleteChannel,
} from "../database/querys/channels";
import { Error, ErrorCodes, ErrorDescriptions } from "../util/errors";

export const router = express.Router();

/**
 * GET
 * ritorna tutti i canali
 * TESTATA
 */
router
  .route("/")
  .get(async (req, res) => {
    try {
      await getAllChannels().then((channels) => {
        res.send(channels);
      });
    } catch (error) {
      console.log(error);
    }
  })
  /**
   * POST
   * crea un nuovo canale
   * TESTATO
   */
  .post(async (req, res) => {
    try {
      await createChannel(req.query.name as string).then((ret) => {
        res.send(ret);
      });
    } catch (error: any) {
      console.log({ errorName: error.name, errorDescription: error.message });
      res.send({ errorName: error.name, errorDescription: error.message });
    }
  })
  /**
   * DELETE
   * elimina un canale
   * TESTATA
   */
  .delete(async (req, res) => {
    try {
      await deleteChannel(req.query.name as string).then((ret) => {
        res.send(ret);
      });
    } catch (error: any) {
      console.log({ errorName: error.name, errorDescription: error.message });
      res.send({ errorName: error.name, errorDescription: error.message });
    }
  });
