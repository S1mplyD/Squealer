import {
  getSquealsByChannel,
  deleteTextSqueal,
  getAllSqueals,
  getSquealsByRecipients,
  postTextSqueal,
  getTextSqueals,
  getTextSqueal,
  getAllUserSqueals,
} from "../database/querys/squeals";
import express from "express";
import {
  TimedSqueal,
  Squeal,
  SquealGeo,
  SquealMedia,
  User,
  Success,
  TimedSquealGeo,
} from "../util/types";
import {
  SquealerError,
  catchError,
  non_existent,
  unauthorized,
} from "../util/errors";

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
          | (Squeal | SquealGeo | SquealMedia | TimedSqueal | TimedSquealGeo)[]
          | undefined = await getAllSqueals();
        res.send(squeals);
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
        if (squeals instanceof SquealerError) return non_existent;
        else return squeals;
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
          req.query.recipient as string
        );
        if (squeals === undefined) res.send(non_existent);
        else res.send(squeals);
      } else res.send(unauthorized);
    } catch (error: any) {
      catchError(error);
    }
  });
