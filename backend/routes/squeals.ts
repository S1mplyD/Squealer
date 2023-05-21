import {
  getSquealsByChannel,
  deleteSqueal,
  getAllSqueals,
  getSquealsByRecipients,
  postSqueal,
  setSquealTimer,
} from "../database/querys/squeals";
import express from "express";
export const router = express.Router();

router
  .route("/")
  .get(async (req, res) => {
    try {
      const squeals: any = await getAllSqueals();
      res.status(200).send(squeals);
    } catch (error) {
      console.log(error);
    }
  })
  .post(async (req, res) => {
    try {
      await postSqueal(req.body);
    } catch (error) {
      console.log(error);
    }
  })
  .delete(async (req, res) => {
    try {
      await deleteSqueal(req.query.id);
    } catch (error) {
      console.log(error);
    }
  });

router.route("/recipients").get(async (req, res) => {
  try {
    const squeals: any = await getSquealsByRecipients(req.body.recipients);
    res.status(200).send(squeals);
  } catch (error) {
    console.log(error);
  }
});

router.route("/channels").get(async (req, res) => {
  try {
    const squeals: any = await getSquealsByChannel(req.body.channels);
    res.status(200).send(squeals);
  } catch (error) {
    console.log(error);
  }
});

router.route("/timer").post(async (req, res) => {
  try {
    const time: any = req.query.time;
    const interval: any = setInterval(async () => {
      await postSqueal(req.body).then(async (squeal) => {
        await setSquealTimer(time, interval, squeal!.id);
      });
    }, time);
  } catch (error) {
    console.log(error);
  }
});
