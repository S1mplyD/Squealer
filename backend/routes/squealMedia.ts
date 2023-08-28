import express from "express";
import {
  deleteMediaSqueal,
  getMediaSqueal,
  getMediaSqueals,
  postMediaSqueal,
} from "../database/querys/squealMedia";
import { SquealMedia, Success, User } from "../util/types";
import { SquealerError, catchError, unauthorized } from "../util/errors";

export const router = express.Router();

router
  .route("/")
  /**
   * GET
   * chiamata che ritorna tutti i media squeal
   */
  .get(async (req, res) => {
    try {
      if (!req.user || (req.user as User).status !== "ban") {
        const squeals: SquealMedia[] | SquealerError = await getMediaSqueals();
        if (squeals instanceof SquealerError) res.status(404).send(squeals);
        else res.status(200).send(squeals);
      } else res.status(401).send(unauthorized);
    } catch (error: any) {
      catchError(error);
    }
  })
  /**
   * POST
   * chiamata per creare un media squeal
   */
  .post(async (req, res) => {
    try {
      if (
        req.user &&
        ((req.user as User).status !== "ban" ||
          (req.user as User).status !== "block")
      ) {
        const newSqueal: SquealerError | Success | undefined =
          await postMediaSqueal(
            req.body,
            req.query.filename as string,
            req.user as User
          );
        if (newSqueal instanceof SquealerError) {
          if (newSqueal.code === 20) res.status(404).send(newSqueal);
          else if (newSqueal.code === 30) res.status(415).send(newSqueal);
          else res.status(500).send(newSqueal);
        } else if (newSqueal === undefined) res.sendStatus(500);
        else res.status(200).send(newSqueal);
      } else res.status(401).send(unauthorized);
    } catch (error: any) {
      catchError(error);
    }
  })
  /**
   * DELETE
   * Elimina uno squeal
   */
  .delete(async (req, res) => {
    try {
      if (!req.user) res.status(401).send(unauthorized);
      else if ((req.user as User).plan === "admin") {
        const ret: SquealerError | Success = await deleteMediaSqueal(
          req.query.id as string
        );
        if (ret instanceof SquealerError) res.status(500).send(ret);
        else res.status(200).send(ret);
      } else {
        //Se l'utente non è admin allora controllo che sia l'autore dello squeal e poi cancello
        const squeal: SquealMedia | SquealerError = await getMediaSqueal(
          req.query.id as string
        );
        if (squeal instanceof SquealerError) res.status(404).send(squeal);
        else {
          if (
            (squeal as SquealMedia).author === (req.user as User).username ||
            (req.user as User).managedAccounts.includes(
              (squeal as SquealMedia).author as string
            )
          ) {
            const returnValue: SquealerError | Success =
              await deleteMediaSqueal(req.query.id as string);
            if (returnValue instanceof SquealerError)
              res.status(500).send(returnValue);
            else res.status(200).send(returnValue);
          } else res.status(401).send(unauthorized);
        }
      }
    } catch (error: any) {
      catchError(error);
    }
  });
