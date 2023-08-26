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

// funzioni squeals di testo
router
  .route("/text")
  /**
   * GET
   * chiamata che ritorna tutti i text squeals
   */
  .get(async (req, res) => {
    try {
      if (!req.user || (req.user as User).status !== "ban") {
        const squeals: any = await getTextSqueals();
        res.send(squeals);
      } else res.status(401).send(unauthorized);
    } catch (error: any) {
      catchError(error);
    }
  })
  /**
   * POST
   * chiamata per creare un text squeal
   */
  .post(async (req, res) => {
    try {
      if (
        req.user &&
        ((req.user as User).status !== "ban" ||
          (req.user as User).status !== "block")
      ) {
        const ret: SquealerError | Success | undefined = await postTextSqueal(
          req.body,
          req.user as User
        );
        res.send(ret);
      } else res.send(unauthorized);
    } catch (error: any) {
      catchError(error);
    }
  })
  /**
   * DELETE
   * chiamata per cancellare uno squeal
   */
  .delete(async (req, res) => {
    try {
      if (!req.user) res.send(unauthorized);
      else if ((req.user as User).plan === "admin") {
        const ret: SquealerError | Success | undefined = await deleteTextSqueal(
          req.query.id as string
        );
        res.send(ret);
      } else {
        //Se l'utente non è admin allora controllo che sia l'autore dello squeal e poi cancello
        const squeal: Squeal | SquealerError = await getTextSqueal(
          req.query.id as string
        );
        if (squeal instanceof SquealerError) return squeal;
        else {
          if (
            (squeal as Squeal).author === (req.user as User).username ||
            (req.user as User).managedAccounts.includes(
              (squeal as Squeal).author as string
            )
          ) {
            const returnValue: SquealerError | Success | undefined =
              await deleteTextSqueal(req.query.id as string);
            res.send(returnValue);
          } else res.send(unauthorized);
        }
      }
    } catch (error: any) {
      catchError(error);
    }
  });
