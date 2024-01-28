import express, {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";
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
  editOfficialChannel,
  updateOfficialSqueals,
} from "../database/queries/channels";
import { SquealerError } from "../util/errors";
import { Channel, Squeal, Success, User } from "../util/types";
import channelsModel from "../database/models/channels.model";

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
        const channels: Channel[] = await getAllChannels();
        res.status(200).send(channels);
      } else res.sendStatus(401);
    } catch (error: any) {
      if (error instanceof SquealerError) res.status(404).send(error);
      else res.status(500).send(error);
    }
  })
  /**
   * POST
   * createChannel
   */
  .post(async (req, res) => {
    try {
      if ((req.user as User).plan === "admin") {
        const returnValue: Success = await createChannel(
          req.query.name as string,
          req.query.type as string,
          req.user as User,
        );
        res.status(201).send(returnValue);
      } else if (
        req.user &&
        ((req.user as User).status !== "ban" ||
          (req.user as User).status !== "block")
      ) {
        const newChannel: Success = await createChannel(
          req.query.name as string,
          req.query.type as string,
          req.user as User,
        );
        res.status(201).send(newChannel);
      } else {
        res.sendStatus(401);
      }
    } catch (error: any) {
      res.status(500).send(error);
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
        const returnValue: Success = await deleteChannel(
          req.query.name as string,
          req.user as User,
        );
        res.status(200).send(returnValue);
      } else {
        res.sendStatus(401);
      }
    } catch (error: any) {
      res.status(500).send(error);
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
        const channel: Channel = await getChannel(req.params.name);
        res.status(200).send(channel);
      } else res.sendStatus(401);
    } catch (error) {
      if (error instanceof SquealerError) res.sendStatus(404);
      else res.status(500).send(error);
    }
  })
  .post(async (req, res) => {
    try {
      if (req.user && (req.user as User).status === "normal") {
        const channel: Channel = await getChannel(req.params.name);
        await channelsModel.updateOne(
          { _id: channel._id },
          {
            $push: {
              allowedRead: (req.user as User)._id,
              allowedWrite: (req.user as User)._id,
            },
          },
        );
        res.sendStatus(200);
      } else res.sendStatus(401);
    } catch (e) {
      res.status(500).send(e);
    }
  })
  .delete(async (req, res) => {
    try {
      if (req.user && (req.user as User).status === "normal") {
        const channel: Channel = await getChannel(req.params.name);
        await channelsModel.updateOne(
          { _id: channel._id },
          {
            $pull: {
              allowedRead: (req.user as User)._id,
              allowedWrite: (req.user as User)._id,
            },
          },
        );
        res.sendStatus(200);
      } else res.sendStatus(401);
    } catch (e) {
      res.status(500).send(e);
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
        const userchannel: Channel[] = await getAllUserChannel(
          req.user as User,
        );
        res.status(200).send(userchannel);
      } else if (!req.user) res.sendStatus(401);
      else res.sendStatus(401);
    } catch (error) {
      res.status(500).send(error);
    }
  });
router
  .route("/userchannel/add")
  /**
   * POST
   * addUserToUserChannel
   */
  .post(async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      if (
        (req.user as User).status !== "ban" ||
        (req.user as User).status !== "block"
      ) {
        await addUserToUserChannel(req.body.username, req.body.channelName);
        res.sendStatus(200);
      } else res.sendStatus(401);
    } catch (error) {
      if (error instanceof SquealerError) {
        if (error.code === 20) res.sendStatus(404);
        else res.sendStatus(500);
      }
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
        await removeUserFromChannel(req.body.username, req.body.channelName);
        res.sendStatus(200);
      } else res.sendStatus(401);
    } catch (error) {
      if (error instanceof SquealerError) {
        if (error.code === 20) res.sendStatus(404);
        else res.status(500).send(error);
      }
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
        const officialChannels: Channel[] = await getAllOfficialChannel();
        res.status(200).send(officialChannels);
      } else res.sendStatus(401);
    } catch (error) {
      console.log(error);
    }
  })
  .patch(async (req, res) => {
    try {
      if (req.user) {
        if (
          req.body.channelType === "officialchannel" &&
          (req.user as User).plan === "admin"
        ) {
          const update: Success = await editOfficialChannel(
            req.body.name,
            req.body.newName,
            req.body.allowedRead,
            req.body.allowedWrite,
            req.body.channelAdmins,
          );
          if (update) res.sendStatus(200);
        }
      } else res.sendStatus(401);
    } catch (e) {
      res.status(500).send(e);
    }
  });

router.route("/official/:name").patch(async (req, res) => {
  try {
    if (req.user && (req.user as User).plan === "admin") {
      const update = await updateOfficialSqueals(
        req.params.name,
        req.body.squeals,
      );
      if (update) res.sendStatus(200);
    } else res.sendStatus(401);
  } catch (e) {
    res.status(500).send(e);
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
        const keywordChannel: Channel[] = await getAllKeywordChannel();
        res.status(200).send(keywordChannel);
      } else res.sendStatus(401);
    } catch (error) {
      res.status(500).send(error);
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
        const mentionChannel: Channel[] = await getAllMentionChannel(
          req.user as User,
        );
        res.status(200).send(mentionChannel);
      } else res.sendStatus(401);
    } catch (error) {
      res.status(500).send(error);
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
            (req.user as User)._id,
          );
        res.status(200).send(squeals);
      } else res.sendStatus(401);
    } catch (error) {
      if (error instanceof SquealerError) res.sendStatus(404);
      else res.status(500).send(error);
    }
  });
