import squealModel from "../database/models/squeals.model";
import {
  getAllTimedSqueals,
  getTimedSqueal,
  postSqueal,
} from "../database/queries/squeals";
import { getUserByUsername } from "../database/queries/users";
import {
  no_timers,
  cannot_create,
  SquealerError,
  cannot_update,
  non_existent,
} from "../util/errors";
import { created, updated } from "../util/success";
import { Interval, Success, Squeal, User } from "../util/types";

var intervals: Array<Interval> = [];

/**
 * funzione che attiva tutti i timer (da usare all'avvio del server)
 */
export async function startAllTimer() {
  console.log("[STARTING TIMERS...]");
  const squeals: Squeal[] | SquealerError = await getAllTimedSqueals();
  if (squeals instanceof SquealerError) {
    return squeals as SquealerError;
  } else {
    for (let i of squeals) {
      if (i.originalSqueal === undefined || i.originalSqueal == "")
        await startTimer(i);
    }
  }
}

/**
 * funzione che inizializza un timer per uno squeal automatizzato
 * @param squeal lo squeal da postare
 * @param time il tempo necessario per postare uno squeal
 * @param id id dello squeal
 * @returns no_timers | Success | Error
 */
export async function startTimer(squeal: Squeal) {
  let interval: NodeJS.Timeout;
  const existingInterval = await findInterval(squeal);
  if (existingInterval) return new Error("Timed squeal is already on");
  interval = setInterval(async () => {
    const newSqueal: Squeal | SquealerError = await getTimedSqueal(squeal._id);
    if (newSqueal instanceof SquealerError) return no_timers;
    else {
      const user: SquealerError | User = await getUserByUsername(
        newSqueal.author,
      );

      if (user instanceof SquealerError) return non_existent;
      else {
        let squeal: Squeal = {
          body: newSqueal.body,
          lat: newSqueal.lat,
          lng: newSqueal.lng,
          recipients: newSqueal.recipients,
          date: new Date(),
          category: newSqueal.category,
          channels: newSqueal.channels,
          author: newSqueal.author,
          type: "auto",
          originalSqueal: newSqueal._id,
          _id: "",
        };
        await postSqueal(squeal, user);
        await updateCount(newSqueal._id);
      }
    }
  }, squeal.time as number);
  const ret: SquealerError | Success = await setSquealInterval(
    interval,
    squeal._id,
  );
  return ret;
}

/**
 * funzione che ferma un post automatico
 * @param TimedSqueal squeal automatico da fermare
 */
export async function stopTimer(squeal: Squeal) {
  clearInterval(await findInterval(squeal));
  const newIntervals = intervals.filter(
    (interval) => interval.id !== squeal._id,
  );
  intervals = newIntervals;
}

/**
 * funzione che trova e ritorna l'intervalId di uno squeal
 * @param squeal
 * @returns NodeJS.Timeout
 */
export async function findInterval(squeal: Squeal) {
  const ret: Interval | undefined = intervals.find(
    (el) => el.id === squeal._id,
  );
  return ret?.timeout as NodeJS.Timeout;
}

/**
 * funzione che salva gli intervalli degli squeal automatici
 * @param timeout valore dell'interval
 * @param id id squeal
 */
export async function setSquealInterval(timeout: NodeJS.Timeout, id: string) {
  const len: number = intervals.length;
  const newInterval: Interval = {
    timeout: timeout,
    id: id,
  };
  intervals.push(newInterval);
  console.log(newInterval.timeout);

  if (intervals.length > len) {
    return created;
  } else return cannot_create;
}

/**
 * funzione che aggiorna il conteggio dei post automatici
 * @param id id dello squeal
 * @returns Success | SquealerError
 */
export async function updateCount(id: string) {
  const update = await squealModel.updateOne(
    { _id: id },
    { $inc: { count: 1 } },
  );
  if (update.modifiedCount < 1) {
    return updated;
  } else return cannot_update;
}
