import { updateAnalyticTime } from "../../util/constants";
import {
  SquealerError,
  cannot_create,
  cannot_update,
  non_existent,
} from "../../util/errors";
import { created, updated } from "../../util/success";
import { Analytic, Squeal } from "../../util/types";
import analyticsDataModel from "../models/analytics.model";
import { getSquealById } from "./squeals";

/**
 * funzione che ritorna le analitiche di un determinato squeal
 * @param id id dello squeal
 * @returns SquealerError | Analytic
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
 * @param id id dell'utente
 * @returns SquealerError | Analytic[]
 */
export async function getAllAnalytics() {
  const analytics: Analytic[] = await analyticsDataModel.find();
  if (analytics.length < 1) return non_existent;
  else return analytics;
}

/**
 * funzione che ritorna tutte le analitiche
 * @param username id dell'utente
 * @returns SquealerError | Analytic[]
 */
export async function getAllUserAnalytics(username: string) {
  const analytics: Analytic[] = await analyticsDataModel
    .find({
      author: username,
    })
    .sort({ date: -1 });
  if (analytics.length < 1) return non_existent;
  else return analytics;
}

/**
 * funzione che crea un'analitica di uno squeal (da utilizzare al momento della creazione dello squeal)
 * (NON UTILIZZARE CON SQUEAL AUTOMATIZZATI, SOLO SQUEAL NORMALI E TEMPORIZZATI)
 * @param id id dello squeal
 * @returns SquealerError | Success
 */
export async function createAnalyticForSqueal(id: string) {
  const squeal = await getSquealById(id);
  if (squeal instanceof SquealerError) return squeal;
  else {
    if ("visual" in squeal) {
      const newAnalytic = await analyticsDataModel.create({
        squealId: squeal._id,
        dates: new Date(),
        visuals: squeal.visual,
        positiveReactions: squeal.positiveReactions,
        negativeReactions: squeal.negativeReactions,
      });
      if (!newAnalytic) return cannot_create;
      else return created;
    }
  }
}
/**
 * funzione che aggiorna tutte le analitiche
 * (NON ESEGUIRE, IL SERVER LA ESEGUE IN AUTOMATICO)
 * @returns SquealerError | Success
 */
export async function updateAnalyticForEverySqueal() {
  try {
    const analytics: SquealerError | Analytic[] = await getAllAnalytics();
    if (analytics instanceof SquealerError) {
      // return non_existent;
      throw non_existent;
    } else {
      for (let i of analytics as Analytic[]) {
        const squeal: Squeal | SquealerError = await getSquealById(i.squealId);
        if ("visual" in squeal) {
          const update = await analyticsDataModel.updateOne(
            {
              _id: squeal._id,
            },
            {
              dates: new Date(),
              visuals: squeal.visual,
              positiveReactions: squeal.positiveReactions,
              negativeReactions: squeal.negativeReactions,
            },
          );
          if (update.modifiedCount < 1) return cannot_update;
          else return updated;
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * funzione che esegue l'aggiornamento delle analytics ogni tot. ore
 */
export async function updateAnalyticTimer() {
  setInterval(async () => {
    console.log("[UPDATING ANALYTICS...]");
    await updateAnalyticForEverySqueal();
  }, updateAnalyticTime);
}
