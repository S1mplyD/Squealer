import express from "express";
import {
  deleteGeoSqueal,
  getGeoSqueal,
  getGeoSqueals,
  postGeoSqueal,
} from "../database/querys/squealGeo";
import { SquealGeo, Success, User } from "../util/types";
import { SquealerError, catchError, unauthorized } from "../util/errors";

export const router = express.Router();

router
  .route("/")
  /**
   * GET
   * chiamata che ritorna tutti i geo squeals
   */
  .get(async (req, res) => {
    try {
      if (!req.user || (req.user as User).status !== "ban") {
        const squeals: SquealGeo[] | SquealerError = await getGeoSqueals();
        if (squeals instanceof SquealerError) res.status(404).send(squeals);
        else res.status(200).send(squeals);
      } else res.send(unauthorized);
    } catch (error: any) {
      catchError(error);
    }
  })
  /**
   * POST
   * chiamata per creare un geo squeal
   */
  .post(async (req, res) => {
    try {
      if (
        req.user &&
        ((req.user as User).status !== "ban" ||
          (req.user as User).status !== "block")
      ) {
        const ret: SquealerError | Success | undefined = await postGeoSqueal(
          req.body,
          req.user as User
        );
        if (ret instanceof SquealerError) res.status(500).send(ret);
        else if (ret === undefined) res.sendStatus(500);
        else res.status(201).send(ret);
      } else res.status(401).send(unauthorized);
    } catch (error: any) {
      catchError(error);
    }
  })
  /**
   * DELETE
   * chiamata per rimuovere un geo squeal
   */
  .delete(async (req, res) => {
    try {
      // Controllo se l'utente è loggato
      if (!req.user) res.status(401).send(unauthorized);
      // Controllo se l'utente è admin
      // Se è admin posso cancellare qualsiasi squeal
      else if ((req.user as User).plan == "admin") {
        const returnValue: SquealerError | Success | undefined =
          await deleteGeoSqueal(req.query.id as string);
        if (returnValue instanceof SquealerError)
          res.status(500).send(returnValue);
        else if (returnValue === undefined) res.sendStatus(500);
        else res.status(200).send(returnValue);
      } else {
        //Se l'utente non è admin allora controllo che sia l'autore dello squeal e poi cancello
        const squeal: SquealGeo | SquealerError = await getGeoSqueal(
          req.query.id as string
        );
        if (squeal instanceof SquealerError) res.status(404).send(squeal);
        else {
          //Controllo se l'utente è il creatore dello squeal oppure se gestisce l'account del creatore dello squeal
          if (
            (squeal as SquealGeo).author === (req.user as User).username ||
            (req.user as User).managedAccounts.includes(
              (squeal as SquealGeo).author as string
            )
          ) {
            const returnValue: SquealerError | Success | undefined =
              await deleteGeoSqueal(req.query.id as string);
            if (returnValue instanceof SquealerError)
              res.status(500).send(returnValue);
            else if (returnValue === undefined) res.sendStatus(500);
            else res.status(200).send(returnValue);
          } else res.status(401).send(unauthorized);
        }
      }
    } catch (error: any) {
      catchError(error);
    }
  });
