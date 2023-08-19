import express from "express";
import {
  deleteMediaSqueal,
  getMediaSqueal,
  getMediaSqueals,
  postMediaSqueal,
} from "../database/querys/squealMedia";
import { Error, SquealMedia, Success, User } from "../util/types";
import { catchError, unauthorized } from "../util/errors";
import mongoose from "mongoose";

export const router = express.Router();

router
  .route("/")
  /**
   * GET
   * chiamata che ritorna tutti i media squeal
   */
  .get(async (req, res) => {
    try {
      const squeals: SquealMedia[] | Error | undefined =
        await getMediaSqueals();
      res.send(squeals);
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
      if (req.user) {
        const newSqueal: any = await postMediaSqueal(
          req.body,
          req.query.filename as string
        );
        res.send(newSqueal);
      } else res.send(unauthorized);
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
      if (!req.user) res.send(unauthorized);
      else if ((req.user as User).plan === "admin") {
        const ret: Error | Success | undefined = await deleteMediaSqueal(
          req.query.id as string
        );
        res.send(ret);
      } else {
        //Se l'utente non è admin allora controllo che sia l'autore dello squeal e poi cancello
        const squeal: SquealMedia | Error = await getMediaSqueal(
          req.query.id as string
        );
        if (squeal instanceof Error) return squeal;
        else {
          if (
            (squeal as SquealMedia).author === (req.user as User).username ||
            (req.user as User).managedAccounts.includes(
              (squeal as SquealMedia).author as string
            )
          ) {
            const returnValue: Error | Success | undefined =
              await deleteMediaSqueal(req.query.id as string);
            res.send(returnValue);
          } else res.send(unauthorized);
        }
      }
    } catch (error: any) {
      catchError(error);
    }
  });
