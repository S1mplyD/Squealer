import express from "express";
import {
  followUser,
  getAllFollowers,
  getAllFollowing,
  unfollowUser,
} from "../API/follow";
import { Success, User } from "../util/types";
import { SquealerError, catchError, unauthorized } from "../util/errors";

export const router = express.Router();

/**
 * chiamata che ritorna tutti i followers di un utente
 */
router.route("/followers").get(async (req, res) => {
  try {
    if (req.user) {
      const followers: number | SquealerError = await getAllFollowers(
        req.query.userId as string
      );
      res.send(followers);
    } else res.send(unauthorized);
  } catch (error: any) {
    catchError(error);
  }
});

/**
 * chiamata che ritorna tutti i seguiti di un utente
 */
router.route("/following").get(async (req, res) => {
  try {
    if (req.user) {
      const following: number | SquealerError = await getAllFollowing(
        req.query.userId as string
      );
      res.send(following);
    } else res.send(unauthorized);
  } catch (error: any) {
    catchError(error);
  }
});

/**
 * chiamata per seguire un utente
 */
router.route("/follow").post(async (req, res) => {
  try {
    if (
      req.user &&
      ((req.user as User).status !== "ban" ||
        (req.user as User).status !== "block")
    ) {
      const update: SquealerError | Success = await followUser(
        (req.user as User)._id,
        req.query.followId as string
      );
      res.send(update);
    } else res.send(unauthorized);
  } catch (error: any) {
    catchError(error);
  }
});

/**
 * chiamata per smettere di seguire un utente
 */
router.route("/unfollow").post(async (req, res) => {
  try {
    if (
      req.user &&
      ((req.user as User).status !== "ban" ||
        (req.user as User).status !== "block")
    ) {
      const update: SquealerError | Success = await unfollowUser(
        req.body.userId,
        req.body.followId
      );
      res.send(update);
    } else res.send(unauthorized);
  } catch (error: any) {
    catchError(error);
  }
});
