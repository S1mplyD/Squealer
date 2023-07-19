import express from "express";
import {
  deleteGeoSqueal,
  getGeoSqueal,
  getGeoSqueals,
  postGeoSqueal,
} from "../database/querys/squealGeo";
import { Error, SquealGeo, Success, User } from "../util/types";
import { unauthorized } from "../util/errors";
import mongoose from "mongoose";

export const router = express.Router();

router
  .route("/")
  /**
   * GET
   * chiamata che ritorna tutti i geo squeals
   */
  .get(async (req, res) => {
    try {
      const squeals: SquealGeo[] | Error | undefined = await getGeoSqueals();
      res.send(squeals);
    } catch (error: any) {
      res.send({ errorName: error.name, errorDescription: error.message });
    }
  })
  /**
   * POST
   * chiamata per creare un geo squeal
   */
  .post(async (req, res) => {
    try {
      if (req.user) {
        const ret: any = await postGeoSqueal(
          req.body,
          (req.user as User).username
        );
        res.send(ret);
      } else res.send(unauthorized);
    } catch (error: any) {
      res.send({ errorName: error.name, errorDescription: error.message });
    }
  })
  /**
   * DELETE
   * chiamata per rimuovere un geo squeal
   */
  //TODO controllo per SMM
  .delete(async (req, res) => {
    try {
      // Controllo se l'utente è loggato
      if (!req.user) res.send(unauthorized);
      // Controllo se l'utente è admin
      // Se è admin posso cancellare qualsiasi squeal
      else if ((req.user as User).plan == "admin") {
        const returnValue: Error | Success | undefined = await deleteGeoSqueal(
          req.query.id as string
        );
        res.send(returnValue);
      } else {
        //Se l'utente non è admin allora controllo che sia l'autore dello squeal e poi cancello
        const squeal: SquealGeo | Error = await getGeoSqueal(
          req.query.id as unknown as mongoose.Types.ObjectId
        );
        if (squeal instanceof Error) return squeal;
        else {
          if ((squeal as SquealGeo).author === (req.user as User).username) {
            const returnValue: Error | Success | undefined =
              await deleteGeoSqueal(req.query.id as string);
            res.send(returnValue);
          } else res.send(unauthorized);
        }
      }
    } catch (error: any) {
      res.send({ errorName: error.name, errorDescription: error.message });
    }
  });
