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
 * chiamata che ritorna il numero di followers di un utente
 */
router.route("/followers").get(async (req, res) => {
  try {
    if (req.user) {
      const followers: User[] | SquealerError = await getAllFollowers(
        req.query.userId as string
      );
      if (followers instanceof SquealerError) res.status(404).send(followers);
      else res.status(200).send(followers);
    } else res.status(401).send(unauthorized);
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
      const following: User[] | SquealerError = await getAllFollowing(
        req.query.userId as string
      );
      if (following instanceof SquealerError) res.status(404).send(following);
      else res.status(200).send(following);
    } else res.status(401).send(unauthorized);
  } catch (error: any) {
    catchError(error);
  }
});

/**
 * chiamata per seguire un utente
 */
//TODO fixme
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
      if (update instanceof SquealerError) res.status(500).send(update);
      else res.status(200).send(update);
    } else res.status(401).send(unauthorized);
  } catch (error: any) {
    catchError(error);
  }
});

/**
 * chiamata per smettere di seguire un utente
 */
//TODO fixme
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
      if (update instanceof SquealerError) res.status(500).send(update);
      else res.status(200).send(update);
    } else res.status(401).send(unauthorized);
  } catch (error: any) {
    catchError(error);
  }
});
