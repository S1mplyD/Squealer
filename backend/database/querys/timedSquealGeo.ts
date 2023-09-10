import {
  cannot_create,
  cannot_delete,
  cannot_update,
  non_existent,
} from "../../util/errors";
import { removed, updated } from "../../util/success";
import { stopTimer } from "../../API/timers";
import { TimedSquealGeo } from "../../util/types";
import timedSquealGeoModel from "../models/timedSquealGeo.model";
/**
 * funzione che ritorna tutti gli squeal temporizzati
 * @returns squeals or SquealerError
 */
export async function getAllGeoTimers() {
  const timedSqueals: TimedSquealGeo[] = await timedSquealGeoModel.find();
  if (timedSqueals.length < 1) return non_existent;
  else return timedSqueals;
}

/**
 * funzione che ritorna un timed geo squeal dato il suo id
 * @param id id dello squeal
 * @returns SquealerError | TimedSquealGeo
 */
export async function getTimedSquealGeo(id: string) {
  const timedSqueal: TimedSquealGeo | null = await timedSquealGeoModel.findById(
    id
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
  author: string
) {
  const newSqueal: TimedSquealGeo = await timedSquealGeoModel.create({
    lat: squeal.lat,
    lng: squeal.lng,
    recipients: squeal.recipients,
    author: author,
    date: new Date(),
    channels: squeal.channels,
    category: squeal.category,
    time: squeal.time,
  });

  if (!newSqueal) return cannot_create;
  else return newSqueal;
}

/**
 * funzione che cancella uno squeal temporizzato
 * @param id id dello squeal temporizzato
 * @returns SquealerError | Success
 */
export async function deleteTimedSquealGeo(id: string) {
  const squeal: TimedSquealGeo | null = (await timedSquealGeoModel.findById(
    id
  )) as TimedSquealGeo;
  if (squeal === null) {
    return non_existent;
  } else {
    await stopTimer(squeal);
    const deleted: any = await timedSquealGeoModel.deleteOne(
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
  const update = await timedSquealGeoModel.updateOne(
    { _id: id },
    { $inc: { count: 1 } }
  );
  if (update.modifiedCount < 1) {
    return updated;
  } else return cannot_update;
}
