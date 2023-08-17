import mongoose from "mongoose";
import {
  cannot_create,
  cannot_delete,
  cannot_update,
  non_existent,
} from "../../util/errors";
import { removed, updated } from "../../util/success";
import { stopTimer } from "../../util/timers";
import { Id, TimedSquealGeo } from "../../util/types";
import timedSquealGeoModel from "../models/timedSquealGeo.model";
/**
 * funzione che ritorna tutti gli squeal temporizzati
 * @returns squeals or Error
 */
export async function getAllGeoTimers() {
  try {
    const timedSqueals: TimedSquealGeo[] = await timedSquealGeoModel.find();
    if (timedSqueals.length < 1) return non_existent;
    else return timedSqueals;
  } catch (error: any) {
    console.log({ errorName: error.name, errorDescription: error.message });
  }
}

/**
 * funzione che ritorna un timed geo squeal dato il suo id
 * @param id id dello squeal
 * @returns Error | TimedSquealGeo
 */
export async function getTimedSquealGeo(id: mongoose.Types.ObjectId) {
  const timedSqueal: TimedSquealGeo | null = await timedSquealGeoModel.findById(
    id,
  );
  if (!timedSqueal) return non_existent;
  else return timedSqueal;
}

/**
 * funzione che crea uno squeal temporizzato (per farlo partire usare la funzione apposita)
 * @param squeal squeal temporizzato
 */
export async function postTimedSquealGeo(
  squeal: TimedSquealGeo,
  author: string,
) {
  try {
    const newSqueal: any = await timedSquealGeoModel.create({
      lat: squeal.lat,
      lng: squeal.lng,
      recipients: squeal.recipients,
      author: author,
      date: new Date(),
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
 * @returns Error | Success
 */
export async function deleteTimedSquealGeo(id: string) {
  try {
    const squeal: TimedSquealGeo | null = (await timedSquealGeoModel.findById(
      id,
    )) as TimedSquealGeo;
    if (squeal === null) {
      return non_existent;
    } else {
      await stopTimer(squeal);
      const deleted: any = await timedSquealGeoModel.deleteOne(
        { _id: id },
        {
          returnDocument: "after",
        },
      );
      if (deleted.deletedCount < 1) return cannot_delete;
      else return removed;
    }
  } catch (error: any) {
    console.log({ errorName: error.name, errorDescription: error.message });
  }
}

/**
 * funzione che aggiorna il conteggio dei post automatici
 * @param id id dello squeal
 * @returns Success | Error
 */
export async function updateCount(id: Id) {
  const update = await timedSquealGeoModel.updateOne(
    { _id: id },
    { $inc: { count: 1 } },
  );
  if (update.modifiedCount < 1) {
    return updated;
  } else return cannot_update;
}
