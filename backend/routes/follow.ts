import express from "express";
import {
  followUser,
  getAllFollowers,
  getAllFollowing,
  unfollowUser,
} from "../API/follow";
import { Error, Id, Success } from "../util/types";

export const router = express.Router();

/**
 * chiamata che ritorna tutti i followers di un utente
 */
router.route("/followers").get(async (req, res) => {
  try {
    const followers: number | Error = await getAllFollowers(
      req.query.userId as unknown as Id,
    );
    return followers;
  } catch (error: any) {
    res.send({ errorName: error.name, errorDescription: error.message });
  }
});

/**
 * chiamata che ritorna tutti i seguiti di un utente
 */
router.route("/following").get(async (req, res) => {
  try {
    const following: number | Error = await getAllFollowing(
      req.query.userId as unknown as Id,
    );
    return following;
  } catch (error: any) {
    res.send({ errorName: error.name, errorDescription: error.message });
  }
});

/**
 * chiamata per seguire un utente
 */
router.route("/follow").post(async (req, res) => {
  try {
    const update: Error | Success = await followUser(
      req.body.userId,
      req.body.followId,
    );
    return update;
  } catch (error: any) {
    res.send({ errorName: error.name, errorDescription: error.message });
  }
});

/**
 * chiamata per smettere di seguire un utente
 */
router.route("/unfollow").post(async (req, res) => {
  try {
    const update: Error | Success = await unfollowUser(
      req.body.userId,
      req.body.followId,
    );
    return update;
  } catch (error: any) {
    res.send({ errorName: error.name, errorDescription: error.message });
  }
});
