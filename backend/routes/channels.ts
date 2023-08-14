import express from "express";
import {
  getAllChannels,
  addSquealToChannel,
  createChannel,
  deleteChannel,
} from "../database/querys/channels";
import { ErrorCodes, ErrorDescriptions, unauthorized } from "../util/errors";
import { Success, User, Error } from "../util/types";
import { plans } from "../util/constants";

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
    } catch (error: any) {
      res.send({ errorName: error.name, errorDescription: error.message });
    }
  })
  /**
   * POST
   * crea un nuovo canale
   * TESTATO
   */
  .post(async (req, res) => {
    try {
      if ((req.user as User).plan === "admin") {
        const returnValue: Error | Success = await createChannel(
          req.query.name as string
        );
        res.send(returnValue);
      } else {
        res.send(unauthorized);
      }
    } catch (error: any) {
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
      if ((req.user as User).plan === "admin") {
        const returnValue: Error | Success = await deleteChannel(
          req.query.name as string
        );
        res.send(returnValue);
      } else {
        res.send(unauthorized);
      }
    } catch (error: any) {
      res.send({ errorName: error.name, errorDescription: error.message });
    }
  });

router
  .route("/addSqueal")
  /**
   * POST
   * aggiungi uno squeal ad un canale
   * TESTATA
   */
  .post(async (req, res) => {
    try {
      if ((req.user as User).plan === "admin") {
        const returnValue: Error | Success = await addSquealToChannel(
          req.body.channelName!,
          req.body.squealId!
        );
        res.send(returnValue);
      } else res.send(unauthorized);
    } catch (error: any) {
      res.send({ errorName: error.name, errorDescription: error.message });
    }
  });
