import express from "express";
import {
  getNotifications,
  setNotificationRead,
} from "../database/queries/notification";
import { Notification, User } from "../util/types";
export const router = express.Router();

router
  .route("/")
  .get(async (req, res) => {
    if (
      req.user &&
      ((req.user as User).status != "ban" ||
        (req.user as User).status != "block")
    ) {
      const notification: Notification[] = await getNotifications(
        req.user as User,
      );
      res.status(200).send(notification);
    } else res.sendStatus(401);
  })
  .patch(async (req, res) => {
    if (
      req.user &&
      ((req.user as User).status != "ban" ||
        (req.user as User).status != "block")
    ) {
      await setNotificationRead(req.query.id as string);
    } else res.sendStatus(401);
  });
