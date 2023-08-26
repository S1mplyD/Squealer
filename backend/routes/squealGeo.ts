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
        res.send(squeals);
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
        const ret: any = await postGeoSqueal(req.body, req.user as User);
        res.send(ret);
      } else res.send(unauthorized);
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
      if (!req.user) res.send(unauthorized);
      // Controllo se l'utente è admin
      // Se è admin posso cancellare qualsiasi squeal
      else if ((req.user as User).plan == "admin") {
        const returnValue: SquealerError | Success | undefined =
          await deleteGeoSqueal(req.query.id as string);
        res.send(returnValue);
      } else {
        //Se l'utente non è admin allora controllo che sia l'autore dello squeal e poi cancello
        const squeal: SquealGeo | SquealerError = await getGeoSqueal(
          req.query.id as string
        );
        if (squeal instanceof SquealerError) return squeal;
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
            res.send(returnValue);
          } else res.send(unauthorized);
        }
      }
    } catch (error: any) {
      catchError(error);
    }
  });
