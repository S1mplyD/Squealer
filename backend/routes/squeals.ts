import {
  getAllSqueals,
  getSquealsByRecipients,
  getAllUserSqueals,
} from "../database/querys/squeals";
import express from "express";
import {
  TimedSqueal,
  Squeal,
  SquealGeo,
  SquealMedia,
  User,
  TimedSquealGeo,
} from "../util/types";
import { SquealerError, catchError, unauthorized } from "../util/errors";

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
        const squeals:
          | SquealerError
          | (
              | Squeal
              | SquealGeo
              | SquealMedia
              | TimedSqueal
              | TimedSquealGeo
            )[] = await getAllSqueals();
        if (squeals instanceof SquealerError) res.status(404).send(squeals);
        else res.status(200).send(squeals);
      } else res.status(401).send(unauthorized);
    } catch (error: any) {
      catchError(error);
    }
  });

router
  .route("/:username")
  /**
   * GET
   * chiamata che ritorna tutti gli squeals pubblicati da un utente
   */
  .get(async (req, res) => {
    try {
      if (!req.user || (req.user as User).status !== "ban") {
        const squeals:
          | SquealerError
          | (
              | Squeal
              | SquealGeo
              | SquealMedia
              | TimedSqueal
              | TimedSquealGeo
            )[] = await getAllUserSqueals(req.params.username);
        if (squeals instanceof SquealerError) res.status(404).send(squeals);
        else res.status(200).send(squeals);
      } else res.status(401).send(unauthorized);
    } catch (error) {
      catchError(error);
    }
  });

router
  .route("/recipients")
  /**
   * GET
   * ritorna tutti gli squeal appartenenti ai recipients ricercati
   */
  .get(async (req, res) => {
    try {
      if (!req.user || (req.user as User).status !== "ban") {
        const squeals:
          | (Squeal | SquealGeo | SquealMedia | TimedSqueal)[]
          | undefined
          | SquealerError = await getSquealsByRecipients(
          req.query.recipient as string,
        );
        if (squeals instanceof SquealerError) res.status(404).send(squeals);
        else res.status(200).send(squeals);
      } else res.send(unauthorized);
    } catch (error: any) {
      catchError(error);
    }
  });
