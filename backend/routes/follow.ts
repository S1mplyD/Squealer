import express from "express";
import {
  followUser,
  getAllFollowers,
  getAllFollowing,
  unfollowUser,
} from "../API/follow";
import { Success } from "../util/types";
import { SquealerError, catchError } from "../util/errors";

export const router = express.Router();

/**
 * chiamata che ritorna tutti i followers di un utente
 */
router.route("/followers").get(async (req, res) => {
  try {
    const followers: number | SquealerError = await getAllFollowers(
      req.query.userId as string
    );
    return followers;
  } catch (error: any) {
    catchError(error);
  }
});

/**
 * chiamata che ritorna tutti i seguiti di un utente
 */
router.route("/following").get(async (req, res) => {
  try {
    const following: number | SquealerError = await getAllFollowing(
      req.query.userId as string
    );
    return following;
  } catch (error: any) {
    catchError(error);
  }
});

/**
 * chiamata per seguire un utente
 */
router.route("/follow").post(async (req, res) => {
  try {
    const update: SquealerError | Success = await followUser(
      req.body.userId,
      req.body.followId
    );
    return update;
  } catch (error: any) {
    catchError(error);
  }
});

/**
 * chiamata per smettere di seguire un utente
 */
router.route("/unfollow").post(async (req, res) => {
  try {
    const update: SquealerError | Success = await unfollowUser(
      req.body.userId,
      req.body.followId
    );
    return update;
  } catch (error: any) {
    catchError(error);
  }
});
