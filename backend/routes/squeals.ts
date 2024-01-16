import {
  getAllSqueals,
  getSquealsByRecipients,
  getAllUserSqueals,
  getAllGeoSqueals,
  getTextSqueals,
  getAllMediaSqueals,
  getAllTimedSqueals,
  getAutoSqueals,
  postSqueal,
  getTimedSqueal,
  deleteTimedSqueal,
  getMediaSqueal,
  deleteMediaSqueal,
  getSquealById,
  deleteSqueal,
  editReaction,
  addPositiveReaction,
  addNegativeReaction,
  postSquealAsUser,
  postResponse,
  getSquealResponses,
  updateSquealRecipients,
} from "../database/querys/squeals";
import express, {Request as ExpressRequest, Response as ExpressResponse} from "express";
import { Squeal, Success, User } from "../util/types";
import { SquealerError } from "../util/errors";
import { startTimer } from "../API/timers";
import { changeUserPlan } from "../database/querys/users";

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
        const squeals: SquealerError | Squeal[] | null = await getAllSqueals();
        if (squeals instanceof SquealerError) res.sendStatus(404);
        else res.status(200).send(squeals);
      } else res.sendStatus(401);
    } catch (error: any) {
      console.log(error);
    }
  });

router.route("/type/:type").get(async (req: ExpressRequest, res: ExpressResponse) => {
  try {
    if (!req.user || (req.user as User).status !== "ban") {
      switch (req.params.type) {
        case "geo":
          const squealsGeo: Squeal[] | SquealerError = await getAllGeoSqueals();
          if (squealsGeo instanceof SquealerError) res.sendStatus(404);
          else res.status(200).send(squealsGeo);
          break;
        case "timed":
          const squealsTimed: Squeal[] | SquealerError =
            await getAllTimedSqueals();
          if (squealsTimed instanceof SquealerError) res.sendStatus(404);
          else res.status(200).send(squealsTimed);
          break;
        case "media":
          const squealsMedia: Squeal[] | SquealerError =
            await getAllMediaSqueals();
          if (squealsMedia instanceof SquealerError) res.sendStatus(404);
          else res.status(200).send(squealsMedia);
          break;

        case "text":
          const squealsText: Squeal[] | SquealerError = await getTextSqueals();
          if (squealsText instanceof SquealerError) res.sendStatus(404);
          else res.status(200).send(squealsText);
          break;
        case "auto":
          const squealsAuto: Squeal[] | SquealerError = await getAutoSqueals();
          if (squealsAuto instanceof SquealerError) res.sendStatus(404);
          else res.status(200).send(squealsAuto);
          break;
        default:
          break;
      }
    } else res.sendStatus(401);
  } catch (error: any) {
    console.log(error);
  }
});
router
  .route("/type")
  .post(async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      if (
        req.user &&
        ((req.user as User).status !== "ban" ||
          (req.user as User).status !== "block")
      ) {
        switch (req.body.type) {
          case "timed":
            const newSqueal: SquealerError | Squeal | null = await postSqueal(
              req.body,
              req.user as User,
            );
            if (newSqueal instanceof SquealerError) res.sendStatus(404);
            else if (newSqueal) {
              const ret: SquealerError | Error | Success = await startTimer(
                newSqueal,
              );
              const squeals: SquealerError | Squeal[] | null = await getAllSqueals();
              if (ret instanceof SquealerError) res.sendStatus(404);
              res.status(201).send(squeals);
            }
            break;
          default:
            const post = await postSqueal(req.body, req.user as User);
            const squeals: SquealerError | Squeal[] | null = await getAllSqueals();
            if (post instanceof SquealerError) res.status(500).send(squeals);
            else res.status(201).send(squeals);
            break;
        }
      } else res.sendStatus(401);
    } catch (error: any) {
      console.log(error);
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
                const squeals: SquealerError | Squeal[] | null = await getAllSqueals();
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
                const squeals: SquealerError | Squeal[] | null = await getAllSqueals();
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
              const squeals: SquealerError | Squeal[] | null = await getAllSqueals();
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
              const ret: SquealerError | Success = await deleteTimedSqueal(
                squeal as Squeal,
              );
              if (ret instanceof SquealerError) res.sendStatus(500);
              else {
                const squeals: SquealerError | Squeal[] | null = await getAllSqueals();
                res.status(200).send(squeals);
              }
            }

            break;
          case "media":
            if (
              (squeal as Squeal).author === (req.user as User).username ||
              (req.user as User).managedAccounts.includes(
                (squeal as Squeal).author as string,
              )
            ) {
              const ret: SquealerError | Success = await deleteMediaSqueal(
                squeal as Squeal,
              );
              if (ret instanceof SquealerError) res.sendStatus(500);
              else {
                const squeals: SquealerError | Squeal[] | null = await getAllSqueals();
                res.status(200).send(squeals);
              }
            }

            break;
          default:
            if (
              (squeal as Squeal).author === (req.user as User).username ||
              (req.user as User).managedAccounts.includes(
                (squeal as Squeal).author as string,
              )
            ) {
              const ret: SquealerError | Success = await deleteSqueal(
                req.query.id as string,
              );
              if (ret instanceof SquealerError) res.sendStatus(500);
              else {
                const squeals: SquealerError | Squeal[] | null = await getAllSqueals();
                res.status(200).send(squeals);
              }
            }

            break;
        }
      }
    } catch (error: any) {
      console.log(error);
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
        if (squeals instanceof SquealerError) res.sendStatus(404);
        else res.status(200).send(squeals);
      } else res.sendStatus(401);
    } catch (error) {
      console.log(error);
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
        const squeals: Squeal[] | SquealerError = await getSquealsByRecipients(
          req.query.recipient as string,
        );
        if (squeals instanceof SquealerError) res.sendStatus(404);
        else res.status(200).send(squeals);
      } else res.sendStatus(401);
    } catch (error: any) {
      console.log(error);
    }
  });

router.route("/recipients/:id").post(async (req: ExpressRequest, res: ExpressResponse) => {
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
        const update: SquealerError | Success = await editReaction(
          req.body.squealid,
          req.body.positiveReactions,
          req.body.negativeReactions,
        );
        if (update instanceof SquealerError) res.sendStatus(500);
        else res.sendStatus(200);
      }
    } catch (err) {
      console.log(err);
    }
  });

router.route("/positiveReactions").post(async (req: ExpressRequest, res: ExpressResponse) => {
  try {
    if (
      !req.user ||
      (req.user as User).status !== "ban" ||
      (req.user as User).status !== "block"
    ) {
      const update: SquealerError | Success | undefined =
        await addPositiveReaction(
          req.query.squealId as string,
          (req.user as User)?._id,
        );
      if (!(update instanceof SquealerError) && update !== undefined)
        res.sendStatus(200);
      else res.sendStatus(500);
    }
  } catch (error) {
    console.log(error);
  }
});

router.route("/negativeReactions").post(async (req: ExpressRequest, res: ExpressResponse) => {
  try {
    if (
      !req.user ||
      (req.user as User).status !== "ban" ||
      (req.user as User).status !== "block"
    ) {
      const update: SquealerError | Success | undefined =
        await addNegativeReaction(
          req.query.squealId as string,
          (req.user as User)?._id,
        );
      if (!(update instanceof SquealerError) && update !== undefined)
        res.sendStatus(200);
      else res.sendStatus(500);
    } else res.sendStatus(401);
  } catch (error) {
    console.log(error);
  }
});

router.route("/smm/:username").post(async (req: ExpressRequest, res: ExpressResponse) => {
  try {
    if (
      (req.user as User).status !== "ban" &&
      (req.user as User).status !== "block"
    ) {
      const newSqueal: Squeal | SquealerError | undefined =
        await postSquealAsUser(
          req.params.username,
          (req.user as User).username,
          req.body,
        );
      if (!newSqueal) res.sendStatus(500);
      else if (newSqueal instanceof SquealerError)
        res.status(500).send(newSqueal);
      else res.status(201).send(newSqueal);
    } else res.sendStatus(401);
  } catch (error) {
    console.log(error);
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
        const responses: Squeal[] | SquealerError | null =
          await getSquealResponses(req.params.id);
        if (responses instanceof SquealerError) res.sendStatus(500);
        else if (!responses) res.sendStatus(404);
        else res.status(200).send(responses);
      } else res.sendStatus(401);
    } catch (e) {
      console.log(e);
    }
  })
  .post(async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      if (
        (req.user as User).status !== "ban" &&
        (req.user as User).status !== "block"
      ) {
        const newSqueal: Squeal | SquealerError = await postResponse(
          req.body,
          req.params.id,
          req.user as User,
        );
        if (newSqueal instanceof SquealerError) res.sendStatus(500);
        else res.status(201).send(newSqueal);
      } else res.sendStatus(401);
    } catch (e) {
      console.log(e);
    }
  });

router.route("/squeal/:id").get(async (req: ExpressRequest, res: ExpressResponse) => {
  try {
    if (
      !req.user ||
      ((req.user as User).status !== "ban" &&
        (req.user as User).status !== "ban")
    ) {
      const squeal: Squeal | SquealerError = await getSquealById(req.params.id);
      if (squeal instanceof SquealerError) res.sendStatus(404);
      else res.status(200).send(squeal);
    } else res.sendStatus(401);
  } catch (e) {
    console.log(e);
  }
});
