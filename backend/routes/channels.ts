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
import { SquealerError, catchError } from "../util/errors";
import { Channel, Squeal, Success, User } from "../util/types";

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
        if (channels instanceof SquealerError) res.sendStatus(404);
        else res.status(200).send(channels);
      } else res.sendStatus(401);
    } catch (error: any) {
      console.log(error);
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
        if (returnValue instanceof SquealerError) res.sendStatus(500);
        else res.status(201).send(returnValue);
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
        if (newChannel instanceof SquealerError) res.sendStatus(500);
        res.status(201).send(newChannel);
      } else {
        res.sendStatus(401);
      }
    } catch (error: any) {
      console.log(error);
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
        if (returnValue instanceof SquealerError) res.sendStatus(500);
        res.status(200).send(returnValue);
      } else {
        res.sendStatus(401);
      }
    } catch (error: any) {
      console.log(error);
    }
  });

router
  .route("/channel/:name")
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
        if (channel instanceof SquealerError) res.sendStatus(404);
        else res.status(200).send(channel);
      } else res.sendStatus(401);
    } catch (error) {
      console.log(error);
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
      if (req.user && (req.user as User).status !== "ban") {
        const userchannel: Channel[] | SquealerError = await getAllUserChannel(
          req.user as User
        );
        if (userchannel instanceof SquealerError) res.sendStatus(404);
        else res.status(200).send(userchannel);
      } else if (!req.user) res.sendStatus(401);
      else res.sendStatus(401);
    } catch (error) {
      console.log(error);
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
      } else res.sendStatus(401);
    } catch (error) {
      console.log(error);
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
      } else res.sendStatus(401);
    } catch (error) {
      console.log(error);
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
        if (officialChannels instanceof SquealerError) res.sendStatus(404);
        else res.status(200).send(officialChannels);
      } else res.sendStatus(401);
    } catch (error) {
      console.log(error);
    }
  });

router
  .route("/keyword")
  /**
   * GET
   * getAllKeywordChannel
   */
  .get(async (req, res) => {
    console.log(req.user);

    try {
      if ((req.user as User).status !== "ban") {
        const keywordChannel: Channel[] | SquealerError =
          await getAllKeywordChannel();
        if (keywordChannel instanceof SquealerError)
          res.status(404).send("DBT");
        else res.status(200).send(keywordChannel);
      } else res.sendStatus(401);
    } catch (error) {
      console.log(error);
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
          await getAllMentionChannel(req.user as User);
        if (mentionChannel instanceof SquealerError) res.sendStatus(404);
        else res.status(200).send(mentionChannel);
      } else res.sendStatus(401);
    } catch (error) {
      console.log(error);
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
        const squeals: Squeal[] | SquealerError =
          await getAllSquealsFromChannel(
            req.query.name as string,
            (req.user as User)._id
          );
        if (squeals instanceof SquealerError) res.sendStatus(404);
        else res.status(200).send(squeals);
      } else res.sendStatus(401);
    } catch (error) {
      console.log(error);
    }
  });
