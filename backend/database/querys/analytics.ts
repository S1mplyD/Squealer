import { updateAnalyticTime } from "../../util/constants";
import { cannot_create, cannot_update, non_existent } from "../../util/errors";
import { created, updated } from "../../util/success";
import {
  Analytic,
  Error,
  Squeal,
  SquealGeo,
  SquealMedia,
  Success,
  TimedSqueal,
  TimedSquealGeo,
} from "../../util/types";
import analyticsDataModel from "../models/analytics.model";
import { getAllSqueals, getAllTimedSqueals, getSquealById } from "./squeals";

/**
 * funzione che ritorna le analitiche di un determinato squeal
 * @param id id dello squeal
 * @returns Error | Analytic
 */
export async function getAnalytic(id: string) {
  const analytic: Analytic | null = await analyticsDataModel.findOne({
    squealId: id,
  });
  if (!analytic) return non_existent;
  else return analytic;
}
/**
 * funzione che ritorna tutte le analitiche
 * @returns Error | Analytic[]
 */
export async function getAllAnalytics() {
  const analytics: Analytic[] = await analyticsDataModel.find();
  if (analytics.length < 1) return non_existent;
  else return analytics;
}

/**
 * funzione che crea un'analitica di uno squeal (da utilizzare al momento della creazione dello squeal)
 * (NON UTILIZZARE CON SQUEAL AUTOMATIZZATI, SOLO SQUEAL NORMALI E TEMPORIZZATI)
 * @param id id dello squeal
 * @returns Error | Success
 */
export async function createAnalyticForSqueal(id: string) {
  const squeal = await getSquealById(id);
  if (squeal instanceof Error) return squeal;
  else {
    if ("visual" in squeal) {
      const newAnalytic = await analyticsDataModel.create({
        squealId: squeal._id,
        $push: [
          { dates: new Date() },
          { visuals: squeal.visual },
          { positiveReactions: squeal.positiveReactions },
          { negativeReactions: squeal.negativeReactions },
        ],
      });
      if (!newAnalytic) return cannot_create;
      else return created;
    }
  }
}
/**
 * funzione che aggiorna tutte le analitiche
 * (NON ESEGUIRE, IL SERVER LA ESEGUE IN AUTOMATICO)
 * @returns Error | Success
 */
export async function updateAnalyticForEverySqueal() {
  const analytics: Error | Analytic[] = await getAllAnalytics();
  if (analytics instanceof Error) return non_existent;
  else {
    for (let i of analytics as Analytic[]) {
      const squeal:
        | Squeal
        | SquealGeo
        | SquealMedia
        | TimedSqueal
        | TimedSquealGeo
        | Error = await getSquealById(i.squealId);
      if (squeal instanceof Error) return non_existent;
      else {
        if ("visual" in squeal) {
          const update = await analyticsDataModel.updateOne(
            {
              _id: squeal._id,
            },
            {
              $push: [
                { dates: new Date() },
                { visuals: squeal.visual },
                { positiveReactions: squeal.positiveReactions },
                { negativeReactions: squeal.negativeReactions },
              ],
            }
          );
          if (update.modifiedCount < 1) return cannot_update;
          else return updated;
        }
      }
    }
  }
}

/**
 * funzione che esegue l'aggiornamento delle analytics ogni tot. ore
 */
export async function updateAnalyticTimer() {
  setInterval(async () => {
    console.log("[UPDATING ANALYTICS...]");
    const update: Error | Success | undefined =
      await updateAnalyticForEverySqueal();
  }, updateAnalyticTime);
}
