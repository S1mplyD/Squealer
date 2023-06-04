import express from "express";
import {
  getAllChannels,
  addSquealToChannel,
  createChannel,
} from "../database/querys/channels";

export const router = express.Router();

/**
 * GET
 * ritorna tutti i canali
 */
router.route("/").get(async (req, res) => {
  try {
    await getAllChannels().then((channels) => {
      res.send(channels);
    });
  } catch (error) {
    console.log(error);
  }
});
