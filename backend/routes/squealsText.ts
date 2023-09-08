import express from "express";
import { Squeal, Success, User } from "../util/types";
import { SquealerError, catchError, unauthorized } from "../util/errors";
import {
  deleteTextSqueal,
  getTextSqueal,
  getTextSqueals,
  postTextSqueal,
} from "../database/querys/squeals";

export const router = express.Router();

// funzioni squeals di testo
router
  .route("/")
  /**
   * GET
   * chiamata che ritorna tutti i text squeals
   */
  .get(async (req, res) => {
    try {
      if (!req.user || (req.user as User).status !== "ban") {
        const squeals: Squeal[] | SquealerError = await getTextSqueals();
        if (squeals instanceof SquealerError) res.sendStatus(404);
        else res.status(200).send(squeals);
      } else res.sendStatus(401);
    } catch (error: any) {
      console.log(console.log(error));
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
        const ret: SquealerError | Success = await postTextSqueal(
          req.body,
          req.user as User
        );
        if (ret instanceof SquealerError) res.sendStatus(404);
        else if (ret === undefined) res.sendStatus(500);
        else res.sendStatus(201);
      } else res.sendStatus(401);
    } catch (error: any) {
      console.log(error);
    }
  })
  /**
   * DELETE
   * chiamata per cancellare uno squeal
   */
  .delete(async (req, res) => {
    try {
      if (!req.user) res.sendStatus(401);
      else if ((req.user as User).plan === "admin") {
        const ret: SquealerError | Success = await deleteTextSqueal(
          req.query.id as string
        );
        if (ret instanceof SquealerError) res.sendStatus(500);
        else res.sendStatus(200);
      } else {
        //Se l'utente non è admin allora controllo che sia l'autore dello squeal e poi cancello
        const squeal: Squeal | SquealerError = await getTextSqueal(
          req.query.id as string
        );
        if (squeal instanceof SquealerError) res.sendStatus(404);
        else {
          if (
            (squeal as Squeal).author === (req.user as User).username ||
            (req.user as User).managedAccounts.includes(
              (squeal as Squeal).author as string
            )
          ) {
            const returnValue: SquealerError | Success = await deleteTextSqueal(
              req.query.id as string
            );
            if (returnValue instanceof SquealerError) res.sendStatus(500);
            else res.sendStatus(200);
          } else res.sendStatus(401);
        }
      }
    } catch (error: any) {
      console.log(error);
    }
  });
