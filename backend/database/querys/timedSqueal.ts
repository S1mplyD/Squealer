import {
  Error,
  ErrorCodes,
  ErrorDescriptions,
  cannot_create,
  cannot_delete,
  non_existent,
} from "../../util/errors";
import {
  Success,
  SuccessCode,
  SuccessDescription,
  removed,
} from "../../util/success";
import { stopTimer } from "../../util/timers";
import { TimedSqueal } from "../../util/types";
import timedSquealModel from "../models/timedSqueals.model";

/**
 * funzione che ritorna tutti gli squeal temporizzati
 * @returns squeals or Error
 */
export async function getAllTimers() {
  try {
    const timedSqueals: TimedSqueal[] = await timedSquealModel.find();
    if (timedSqueals.length < 1) return non_existent;
    else return timedSqueals;
  } catch (error: any) {
    console.log({ errorName: error.name, errorDescription: error.message });
  }
}

/**
 * funzione che crea uno squeal temporizzato (per farlo partire usare la funzione apposita)
 * @param squeal squeal temporizzato
 */
//TODO
export async function postTimedSqueal(squeal: TimedSqueal, author: string) {
  try {
    const newSqueal: any = await timedSquealModel.create({
      body: squeal.body,
      recipients: squeal.recipients,
      author: author,
      date: new Date(),
      category: squeal.category, //? automatico o manuale ?
      channels: squeal.channels,
      time: squeal.time,
    });

    if (!newSqueal) return cannot_create;
    else return newSqueal;
  } catch (error: any) {
    console.log({ errorName: error.name, errorDescription: error.message });
  }
}

/**
 * funzione che cancella uno squeal temporizzato
 * @param id id dello squeal temporizzato
 */
export async function deleteTimedSqueal(id: string) {
  try {
    const squeal: TimedSqueal | null = (await timedSquealModel.findById(
      id
    )) as TimedSqueal;
    if (squeal === null) {
      return non_existent;
    } else {
      await stopTimer(squeal);
      const deleted: any = await timedSquealModel.deleteOne(
        { _id: id },
        {
          returnDocument: "after",
        }
      );
      if (deleted.deletedCount < 1) return cannot_delete;
      else return removed;
    }
  } catch (error: any) {
    console.log({ errorName: error.name, errorDescription: error.message });
  }
}
