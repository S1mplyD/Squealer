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
} from "../database/querys/squeals";
import express from "express";
import { Squeal, Success, User } from "../util/types";
import { SquealerError, catchError, unauthorized } from "../util/errors";
import { startTimer } from "../API/timers";

export const router = express.Router();

//Funzioni generali

router
  .route("/")
  /**
   * GET
   * Ritorna tutti gli squeal
   */
  .get(async (req, res) => {
    try {
      if (!req.user || (req.user as User).status !== "ban") {
        const squeals: SquealerError | Squeal[] = await getAllSqueals();
        if (squeals instanceof SquealerError) res.sendStatus(404);
        else res.status(200).send(squeals);
      } else res.sendStatus(401);
    } catch (error: any) {
      console.log(error);
    }
  });

router
  .route("/type/:type")
  .get(async (req, res) => {
    try {
      if (!req.user || (req.user as User).status !== "ban") {
        switch (req.params.type) {
          case "geo":
            const squealsGeo: Squeal[] | SquealerError =
              await getAllGeoSqueals();
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
            const squealsText: Squeal[] | SquealerError =
              await getTextSqueals();
            if (squealsText instanceof SquealerError) res.sendStatus(404);
            else res.status(200).send(squealsText);
            break;
          case "auto":
            const squealsAuto: Squeal[] | SquealerError =
              await getAutoSqueals();
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
  })
  .post(async (req, res) => {
    try {
      if (
        req.user &&
        ((req.user as User).status !== "ban" ||
          (req.user as User).status !== "block")
      ) {
        switch (req.params.type) {
          case "timed":
            const newSqueal: Squeal | SquealerError = await postSqueal(
              req.body,
              req.user as User
            );
            if (newSqueal instanceof SquealerError) res.sendStatus(404);
            else {
              const ret: SquealerError | Success = await startTimer(newSqueal);
              const squeals: Squeal[] | SquealerError = await getAllSqueals();
              if (ret instanceof SquealerError) res.sendStatus(404);
              res.status(201).send(squeals);
            }
            break;
          default:
            const post = await postSqueal(req.body, req.user as User);
            const squeals: Squeal[] | SquealerError = await getAllSqueals();
            if (post instanceof SquealerError) res.status(500).send(squeals);
            break;
        }
      } else res.sendStatus(401);
    } catch (error: any) {
      console.log(error);
    }
  })
  .delete(async (req, res) => {
    try {
      if (!req.user) res.sendStatus(401);
      else if ((req.user as User).plan === "admin") {
        switch (req.params.type) {
          case "timed":
            const squealTimed: Squeal | SquealerError = await getTimedSqueal(
              req.query.id as string
            );
            if (squealTimed instanceof SquealerError) res.sendStatus(500);
            else {
              const ret: SquealerError | Success = await deleteTimedSqueal(
                squealTimed
              );
              if (ret instanceof SquealerError) res.sendStatus(500);
              else {
                const squeals: Squeal[] | SquealerError = await getAllSqueals();
                res.status(200).send(squeals);
              }
            }
            break;
          case "media":
            const squealMedia: Squeal | SquealerError = await getMediaSqueal(
              req.query.id as string
            );
            if (squealMedia instanceof SquealerError) res.sendStatus(500);
            else {
              const ret: SquealerError | Success = await deleteMediaSqueal(
                squealMedia
              );
              if (ret instanceof SquealerError) res.sendStatus(500);
              else {
                const squeals: Squeal[] | SquealerError = await getAllSqueals();
                res.status(200).send(squeals);
              }
            }
            break;
          default:
            const ret: SquealerError | Success = await deleteSqueal(
              req.query.id as string
            );
            if (ret instanceof SquealerError) res.sendStatus(500);
            else {
              const squeals: Squeal[] | SquealerError = await getAllSqueals();
              res.status(200).send(squeals);
            }
            break;
        }
      } else {
        switch (req.params.type) {
          case "timed":
            const squealTimed: Squeal | SquealerError = await getTimedSqueal(
              req.query.id as string
            );
            if (squealTimed instanceof SquealerError) res.sendStatus(500);
            else {
              if (
                (squealTimed as Squeal).author ===
                  (req.user as User).username ||
                (req.user as User).managedAccounts.includes(
                  (squealTimed as Squeal).author as string
                )
              ) {
                const ret: SquealerError | Success = await deleteTimedSqueal(
                  squealTimed
                );
                if (ret instanceof SquealerError) res.sendStatus(500);
                else {
                  const squeals: Squeal[] | SquealerError =
                    await getAllSqueals();
                  res.status(200).send(squeals);
                }
              }
            }
            break;
          case "media":
            const squealMedia: Squeal | SquealerError = await getMediaSqueal(
              req.query.id as string
            );
            if (squealMedia instanceof SquealerError) res.sendStatus(500);
            else {
              if (
                (squealMedia as Squeal).author ===
                  (req.user as User).username ||
                (req.user as User).managedAccounts.includes(
                  (squealMedia as Squeal).author as string
                )
              ) {
                const ret: SquealerError | Success = await deleteMediaSqueal(
                  squealMedia
                );
                if (ret instanceof SquealerError) res.sendStatus(500);
                else {
                  const squeals: Squeal[] | SquealerError =
                    await getAllSqueals();
                  res.status(200).send(squeals);
                }
              }
            }
            break;
          default:
            const squealText: Squeal | SquealerError = await getSquealById(
              req.query.id as string
            );
            if (squealText instanceof SquealerError) res.sendStatus(500);
            else {
              if (
                (squealText as Squeal).author === (req.user as User).username ||
                (req.user as User).managedAccounts.includes(
                  (squealText as Squeal).author as string
                )
              ) {
                const ret: SquealerError | Success = await deleteSqueal(
                  req.query.id as string
                );
                if (ret instanceof SquealerError) res.sendStatus(500);
                else {
                  const squeals: Squeal[] | SquealerError =
                    await getAllSqueals();
                  res.status(200).send(squeals);
                }
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
  .get(async (req, res) => {
    try {
      if (!req.user || (req.user as User).status !== "ban") {
        const squeals: SquealerError | Squeal[] = await getAllUserSqueals(
          req.params.username
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
  //TODO fixme
  .get(async (req, res) => {
    try {
      if (!req.user || (req.user as User).status !== "ban") {
        const squeals: Squeal[] | SquealerError = await getSquealsByRecipients(
          req.query.recipient as string
        );
        if (squeals instanceof SquealerError) res.sendStatus(404);
        else res.status(200).send(squeals);
      } else res.sendStatus(401);
    } catch (error: any) {
      console.log(error);
    }
  });
