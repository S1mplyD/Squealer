import express from "express";
import {
  deleteGeoSqueal,
  getGeoSqueals,
  postGeoSqueal,
} from "../database/querys/squealGeo";
import { Error, SquealGeo } from "../util/types";

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
    } catch (error) {
      res.send(error);
    }
  })
  /**
   * POST
   * chiamata per creare un geo squeal
   */
  .post(async (req, res) => {
    try {
      const ret: any = await postGeoSqueal(req.body);
      res.send(ret);
    } catch (error) {
      console.log(error);
    }
  })
  /**
   * DELETE
   * chiamata per rimuovere un geo squeal
   */
  .delete(async (req, res) => {
    try {
      await deleteGeoSqueal(req.query.id as string).then((ret) => {
        res.send(ret);
      });
    } catch (error) {
      console.log(error);
    }
  });
