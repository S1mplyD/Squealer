import {
  addNegativeReaction,
  addPositiveReaction,
  deleteMediaSqueal,
  deleteSqueal,
  deleteTimedSqueal,
  editReaction,
  getAllGeoSqueals,
  getAllMediaSqueals,
  getAllSqueals,
  getAllTimedSqueals,
  getAllUserSqueals,
  getAutoSqueals,
  getMediaSqueal,
  getSquealById,
  getSquealResponses,
  getSquealsByDateAsc,
  getSquealsByDateDesc,
  getSquealsByRecipients,
  getSquealsByRecipientsAsc,
  getSquealsByRecipientsDesc,
  getSquealsBySenderAsc,
  getSquealsBySenderDesc,
  getTextSqueals,
  getTimedSqueal,
  postResponse,
  postSqueal,
  postSquealAsUser,
  updateSquealRecipients,
} from "../database/queries/squeals";
import express, {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";
import { Squeal, Success, User } from "../util/types";
import { SquealerError } from "../util/errors";
import { startTimer } from "../API/timers";

export const router = express.Router();

//Funzioni generali

router
  .route("/")
  /**
   * GET
   * Ritorna tutti gli squeal
   */
  .get(async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      if (!req.user || (req.user as User).status !== "ban") {
        const squeals: Squeal[] = await getAllSqueals();
        res.status(200).send(squeals);
      } else res.sendStatus(401);
    } catch (error: any) {
      if (error instanceof SquealerError) res.status(404).send(error);
      else res.status(500).send(error);
    }
  });

router
  .route("/type/:type")
  .get(async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      if (!req.user || (req.user as User).status !== "ban") {
        switch (req.params.type) {
          case "geo":
            const squealsGeo: Squeal[] = await getAllGeoSqueals();
            res.status(200).send(squealsGeo);
            break;
          case "timed":
            const squealsTimed: Squeal[] = await getAllTimedSqueals();
            res.status(200).send(squealsTimed);
            break;
          case "media":
            const squealsMedia: Squeal[] = await getAllMediaSqueals();
            res.status(200).send(squealsMedia);
            break;
          case "text":
            const squealsText: Squeal[] = await getTextSqueals();
            res.status(200).send(squealsText);
            break;
          case "auto":
            const squealsAuto: Squeal[] = await getAutoSqueals();
            res.status(200).send(squealsAuto);
            break;
          default:
            break;
        }
      } else res.sendStatus(401);
    } catch (error: any) {
      if (error instanceof SquealerError) res.status(404).send(error);
      else res.status(500).send(error);
    }
  });
router
  .route("/type")
  //TODO fix
  .post(async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      if (
        req.user &&
        ((req.user as User).status !== "ban" ||
          (req.user as User).status !== "block")
      ) {
        switch (req.body.type) {
          case "timed":
            const newSqueal: Squeal | undefined = await postSqueal(
              req.body,
              req.user as User,
            );
            if (!newSqueal) res.sendStatus(404);
            else if (newSqueal) {
              const ret: SquealerError | Error | Success = await startTimer(
                newSqueal,
              );
              const squeals: SquealerError | Squeal[] | null =
                await getAllSqueals();
              if (ret instanceof SquealerError) res.sendStatus(404);
              res.status(201).send(squeals);
            }
            break;
          default:
            await postSqueal(req.body, req.user as User);
            const squeals: Squeal[] = await getAllSqueals();
            res.status(201).send(squeals);
            break;
        }
      } else res.sendStatus(401);
    } catch (error: any) {
      console.log(error);
      if (error instanceof SquealerError) res.status(404).send(error);
      else res.status(500).send(error);
    }
  })
  .delete(async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      const squeal: Squeal | SquealerError = await getSquealById(
        req.query.id as string,
      );
      if (squeal instanceof SquealerError) res.sendStatus(404);
      if (!req.user) res.sendStatus(401);
      else if ((req.user as User).plan === "admin") {
        switch ((squeal as Squeal).type) {
          case "timed":
            const squealTimed: Squeal | SquealerError = await getTimedSqueal(
              req.query.id as string,
            );
            if (squealTimed instanceof SquealerError) res.sendStatus(500);
            else {
              const ret: SquealerError | Success = await deleteTimedSqueal(
                squealTimed,
              );
              if (ret instanceof SquealerError) res.sendStatus(500);
              else {
                const squeals: SquealerError | Squeal[] | null =
                  await getAllSqueals();
                res.status(200).send(squeals);
              }
            }
            break;
          case "media":
            const squealMedia: Squeal | SquealerError = await getMediaSqueal(
              req.query.id as string,
            );
            if (squealMedia instanceof SquealerError) res.sendStatus(500);
            else {
              const ret: SquealerError | Success = await deleteMediaSqueal(
                squealMedia,
              );
              if (ret instanceof SquealerError) res.sendStatus(500);
              else {
                const squeals: SquealerError | Squeal[] | null =
                  await getAllSqueals();
                res.status(200).send(squeals);
              }
            }
            break;
          default:
            const ret: SquealerError | Success = await deleteSqueal(
              req.query.id as string,
            );
            if (ret instanceof SquealerError) res.sendStatus(500);
            else {
              const squeals: SquealerError | Squeal[] | null =
                await getAllSqueals();
              res.status(200).send(squeals);
            }
            break;
        }
      } else {
        switch ((squeal as Squeal).type) {
          case "timed":
            if (
              (squeal as Squeal).author === (req.user as User).username ||
              (req.user as User).managedAccounts.includes(
                (squeal as Squeal).author as string,
              )
            ) {
              await deleteTimedSqueal(squeal as Squeal);
              const squeals: Squeal[] = await getAllSqueals();
              res.status(200).send(squeals);
            }

            break;
          case "media":
            if (
              (squeal as Squeal).author === (req.user as User).username ||
              (req.user as User).managedAccounts.includes(
                (squeal as Squeal).author as string,
              )
            ) {
              await deleteMediaSqueal(squeal as Squeal);
              const squeals: Squeal[] = await getAllSqueals();
              res.status(200).send(squeals);
            }
            break;
          default:
            if (
              (squeal as Squeal).author === (req.user as User).username ||
              (req.user as User).managedAccounts.includes(
                (squeal as Squeal).author as string,
              )
            ) {
              const ret: Success = await deleteSqueal(req.query.id as string);
              const squeals: Squeal[] = await getAllSqueals();
              res.status(200).send(squeals);
            }
            break;
        }
      }
    } catch (error: any) {
      console.log(error);
      if (error instanceof SquealerError) res.status(404).send(error);
      else res.status(500).send(error);
    }
  });

router
  .route("/user/:username")
  /**
   * GET
   * chiamata che ritorna tutti gli squeals pubblicati da un utente
   */
  .get(async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      if (!req.user || (req.user as User).status !== "ban") {
        const squeals: SquealerError | Squeal[] = await getAllUserSqueals(
          req.params.username,
        );
        res.status(200).send(squeals);
      } else res.sendStatus(401);
    } catch (error) {
      console.log(error);
      if (error instanceof SquealerError) res.status(404).send(error);
      else res.status(500).send(error);
    }
  });

router
  .route("/recipients")
  /**
   * GET
   * ritorna tutti gli squeal appartenenti ai recipients ricercati
   */
  .get(async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      if (!req.user || (req.user as User).status !== "ban") {
        const squeals: Squeal[] = await getSquealsByRecipients(
          req.query.recipient as string,
        );
        res.status(200).send(squeals);
      } else res.sendStatus(401);
    } catch (error: any) {
      console.log(error);
      if (error instanceof SquealerError) res.status(404).send(error);
      else res.status(500).send(error);
    }
  });

router
  .route("/recipients/:id")
  .post(async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      if (req.user && (req.user as User).plan === "admin") {
        await updateSquealRecipients(req.params.id, req.body.recipients);
        res.sendStatus(200);
      } else res.sendStatus(401);
    } catch (e) {
      res.status(500).send(e);
    }
  });
router
  .route("/reactions")
  /**
   *GET
   * permette ad un amministratore di modificare le reazioni ad uno squeal
   */
  .get(async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      if ((req.user as User).plan === "admin") {
        const update: Success = await editReaction(
          req.body.squealid,
          req.body.positiveReactions,
          req.body.negativeReactions,
        );
        res.sendStatus(200);
      }
    } catch (error) {
      if (error instanceof SquealerError) res.status(404).send(error);
      else res.status(500).send(error);
    }
  });

router
  .route("/positiveReactions")
  .post(async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      if (
        !req.user ||
        (req.user as User).status !== "ban" ||
        (req.user as User).status !== "block"
      ) {
        const update: Success = await addPositiveReaction(
          req.query.squealId as string,
          (req.user as User)?._id,
        );
        res.sendStatus(200);
      }
    } catch (error) {
      console.log(error);
      if (error instanceof SquealerError) res.status(404).send(error);
      else res.status(500).send(error);
    }
  });

router
  .route("/negativeReactions")
  .post(async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      if (
        !req.user ||
        (req.user as User).status !== "ban" ||
        (req.user as User).status !== "block"
      ) {
        const update: Success = await addNegativeReaction(
          req.query.squealId as string,
          (req.user as User)?._id,
        );
        res.sendStatus(200);
      } else res.sendStatus(401);
    } catch (error) {
      if (error instanceof SquealerError) res.status(404).send(error);
      else res.status(500).send(error);
      console.log(error);
    }
  });

router
  .route("/smm/:username")
  .post(async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      if (
        (req.user as User).status !== "ban" &&
        (req.user as User).status !== "block"
      ) {
        const newSqueal: Squeal = await postSquealAsUser(
          req.params.username,
          (req.user as User).username,
          req.body,
        );
        res.status(201).send(newSqueal);
      } else res.sendStatus(401);
    } catch (error) {
      console.log(error);
      if (error instanceof SquealerError) res.status(404).send(error);
      else res.status(500).send(error);
    }
  });

/**
 * POST
 */
router
  .route("/response/:id")
  .get(async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      if (
        !req.user ||
        ((req.user as User).status !== "ban" &&
          (req.user as User).status !== "ban")
      ) {
        const responses: Squeal[] = await getSquealResponses(req.params.id);
        res.status(200).send(responses);
      } else res.sendStatus(401);
    } catch (error) {
      if (error instanceof SquealerError) res.status(404).send(error);
      else res.status(500).send(error);
    }
  })
  .post(async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      if (
        (req.user as User).status !== "ban" &&
        (req.user as User).status !== "block"
      ) {
        const newSqueal: Squeal = await postResponse(
          req.body,
          req.params.id,
          req.user as User,
        );
        res.status(201).send(newSqueal);
      } else res.sendStatus(401);
    } catch (error) {
      res.status(500).send(error);
    }
  });

router
  .route("/squeal/:id")
  .get(async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      if (
        !req.user ||
        ((req.user as User).status !== "ban" &&
          (req.user as User).status !== "ban")
      ) {
        const squeal: Squeal = await getSquealById(req.params.id);
        res.status(200).send(squeal);
      } else res.sendStatus(401);
    } catch (error) {
      if (error instanceof SquealerError) res.status(404).send(error);
      else res.status(500).send(error);
    }
  });

router
  .route("/sender/asc")
  .get(async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      if (req.user && (req.user as User).plan === "admin") {
        const squeals: Squeal[] = await getSquealsBySenderAsc();
        res.status(200).send(squeals);
      } else res.sendStatus(401);
    } catch (e) {
      res.status(500).send(e);
    }
  });
router
  .route("/sender/desc")
  .get(async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      if (req.user && (req.user as User).plan === "admin") {
        const squeals: Squeal[] = await getSquealsBySenderDesc();
        res.status(200).send(squeals);
      } else res.sendStatus(401);
    } catch (e) {
      res.status(500).send(e);
    }
  });
router
  .route("/date/asc")
  .get(async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      if (req.user && (req.user as User).plan === "admin") {
        const squeals: Squeal[] = await getSquealsByDateAsc();
        res.status(200).send(squeals);
      } else res.sendStatus(401);
    } catch (e) {
      res.status(500).send(e);
    }
  });
router
  .route("/date/desc")
  .get(async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      if (req.user && (req.user as User).plan === "admin") {
        const squeals: Squeal[] = await getSquealsByDateDesc();
        res.status(200).send(squeals);
      } else res.sendStatus(401);
    } catch (e) {
      res.status(500).send(e);
    }
  });
router
  .route("/recipients/asc")
  .get(async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      if (req.user && (req.user as User).plan === "admin") {
        const squeals: Squeal[] = await getSquealsByRecipientsAsc();
        res.status(200).send(squeals);
      } else res.sendStatus(401);
    } catch (e) {
      res.status(500).send(e);
    }
  });
router
  .route("/recipients/desc")
  .get(async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      if (req.user && (req.user as User).plan === "admin") {
        const squeals: Squeal[] = await getSquealsByRecipientsDesc();
        res.status(200).send(squeals);
      } else res.sendStatus(401);
    } catch (e) {
      res.status(500).send(e);
    }
  });
