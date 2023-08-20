import {
  cannot_create,
  cannot_delete,
  cannot_update,
  non_existent,
} from "../../util/errors";
import { removed, updated } from "../../util/success";
import { stopTimer } from "../../API/timers";
import { TimedSqueal } from "../../util/types";
import timedSquealModel from "../models/timedSqueals.model";

/**
 * funzione che ritorna tutti gli squeal temporizzati
 * @returns TimedSqueal[] | SquealerError
 */
export async function getAllTextTimers() {
  const timedSqueals: TimedSqueal[] = await timedSquealModel.find();
  if (timedSqueals.length < 1) return non_existent;
  else return timedSqueals;
}

export async function getTimedSqueal(id: string) {
  const timedSqueal: TimedSqueal | null = await timedSquealModel.findById(id);
  if (!timedSqueal) return non_existent;
  else return timedSqueal;
}

/**
 * funzione che crea uno squeal temporizzato (per farlo partire usare la funzione apposita)
 * @param squeal squeal temporizzato
 */
export async function postTimedSqueal(squeal: TimedSqueal, author: string) {
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
}

/**
 * funzione che cancella uno squeal temporizzato
 * @param id id dello squeal temporizzato
 */
export async function deleteTimedSqueal(id: string) {
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
}

/**
 * funzione che aggiorna il conteggio dei post automatici
 * @param id id dello squeal
 * @returns Success | SquealerError
 */
export async function updateCount(id: string) {
  const update = await timedSquealModel.updateOne(
    { _id: id },
    { $inc: { count: 1 } }
  );
  if (update.modifiedCount < 1) {
    return updated;
  } else return cannot_update;
}
