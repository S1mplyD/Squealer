import express from "express";
import {
  getAllChannels,
  createChannel,
  deleteChannel,
  getAllSquealsFromChannel,
  getChannel,
  getAllUserChannel,
  getAllOfficialChannel,
  getAllKeywordChannel,
  getAllMentionChannel,
  addUserToUserChannel,
  removeUserFromChannel,
} from "../database/querys/channels";
import { SquealerError, catchError, unauthorized } from "../util/errors";
import {
  Channel,
  Squeal,
  SquealGeo,
  SquealMedia,
  Success,
  TimedSqueal,
  TimedSquealGeo,
  User,
} from "../util/types";
import { getAllUserAnalytics } from "../database/querys/analytics";

export const router = express.Router();

/**
 * GET
 * getAllChannels
 */
router
  .route("/")
  .get(async (req, res) => {
    try {
      if (req.user && (req.user as User).status !== "ban") {
        const channels: Channel[] | SquealerError = await getAllChannels();
        res.send(channels);
      }
    } catch (error: any) {
      catchError(error);
    }
  })
  /**
   * POST
   * createChannel
   */
  .post(async (req, res) => {
    try {
      if ((req.user as User).plan === "admin") {
        const returnValue: SquealerError | Success = await createChannel(
          req.query.name as string,
          req.query.type as string,
          req.user as User
        );
        res.send(returnValue);
      } else if (
        req.user &&
        ((req.user as User).status !== "ban" ||
          (req.user as User).status !== "block")
      ) {
        const newChannel: SquealerError | Success = await createChannel(
          req.query.name as string,
          req.query.type as string,
          req.user as User
        );
        res.send(newChannel);
      } else {
        res.send(unauthorized);
      }
    } catch (error: any) {
      catchError(error);
    }
  })
  /**
   * DELETE
   * deleteChannel
   */
  .delete(async (req, res) => {
    try {
      if (
        (req.user as User).status !== "block" ||
        (req.user as User).status !== "ban"
      ) {
        const returnValue: SquealerError | Success = await deleteChannel(
          req.query.name as string,
          req.user as User
        );
        res.send(returnValue);
      } else {
        res.send(unauthorized);
      }
    } catch (error: any) {
      catchError(error);
    }
  });

router
  .route("/:name")
  /**
   * GET
   * getChannel
   */
  .get(async (req, res) => {
    try {
      if ((req.user as User).status !== "ban") {
        const channel: Channel | SquealerError = await getChannel(
          req.params.name
        );
        res.send(channel);
      } else res.send(unauthorized);
    } catch (error) {
      catchError(error);
    }
  });

router
  .route("/userchannel")
  /**
   * GET
   * getAlluserChannel
   */
  .get(async (req, res) => {
    try {
      if ((req.user as User).status !== "ban") {
        const userchannel: Channel[] | SquealerError = await getAllUserChannel(
          req.user as User
        );
        res.send(userchannel);
      } else res.send(unauthorized);
    } catch (error) {
      catchError(error);
    }
  });
router
  .route("/userchannel/add")
  /**
   * POST
   * addUserToUserChannel
   */
  .post(async (req, res) => {
    try {
      if (
        (req.user as User).status !== "ban" ||
        (req.user as User).status !== "block"
      ) {
        const retValue: SquealerError | Success = await addUserToUserChannel(
          req.body.username,
          req.body.channelName
        );
        if (retValue instanceof SquealerError) {
          if (retValue.code === 20) res.sendStatus(404);
          else res.sendStatus(500);
        } else res.sendStatus(200);
      }
    } catch (error) {
      catchError(error);
    }
  });

router
  .route("/userchannel/remove")
  /**
   * POST
   * addUserToUserChannel
   */
  .post(async (req, res) => {
    try {
      if (
        (req.user as User).status !== "ban" ||
        (req.user as User).status !== "block"
      ) {
        const retValue: SquealerError | Success = await removeUserFromChannel(
          req.body.username,
          req.body.channelName
        );
        if (retValue instanceof SquealerError) {
          if (retValue.code === 20) res.sendStatus(404);
          else res.sendStatus(500);
        } else res.sendStatus(200);
      }
    } catch (error) {
      catchError(error);
    }
  });

router
  .route("/official")
  /**
   * GET
   * getAllOfficialChannel
   */
  .get(async (req, res) => {
    try {
      if ((req.user as User).status !== "ban") {
        const officialChannels: Channel[] | SquealerError =
          await getAllOfficialChannel();
        res.send(officialChannels);
      } else res.send(unauthorized);
    } catch (error) {
      catchError(error);
    }
  });

router
  .route("/keyword")
  /**
   * GET
   * getAllKeywordChannel
   */
  .get(async (req, res) => {
    try {
      if ((req.user as User).status !== "ban") {
        const keywordChannel: Channel[] | SquealerError =
          await getAllKeywordChannel();
        res.send(keywordChannel);
      } else res.send(unauthorized);
    } catch (error) {
      catchError(error);
    }
  });

router
  .route("/mention")
  /**
   * GET
   * getAllMentionChannel
   */
  .get(async (req, res) => {
    try {
      if ((req.user as User).status !== "ban") {
        const mentionChannel: Channel[] | SquealerError =
          await getAllMentionChannel();
        res.send(mentionChannel);
      } else res.send(unauthorized);
    } catch (error) {
      catchError(error);
    }
  });

router
  .route("/squeals")
  /**
   * GET
   * getAllSquealsFromChannel
   */
  .get(async (req, res) => {
    try {
      if ((req.user as User).status !== "ban") {
        const squeals:
          | (Squeal | SquealGeo | SquealMedia | TimedSqueal | TimedSquealGeo)[]
          | SquealerError = await getAllSquealsFromChannel(
          req.query.name as string,
          (req.user as User)._id
        );
        res.send(squeals);
      } else res.send(unauthorized);
    } catch (error) {
      catchError(error);
    }
  });
