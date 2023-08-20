import { postAutomatedSqueal } from "../database/querys/automatedSqueal";
import { getAllTimedSqueals, getTextSqueal } from "../database/querys/squeals";
import { getTimedSqueal } from "../database/querys/timedSqueal";
import { getTimedSquealGeo } from "../database/querys/timedSquealGeo";
import { no_timers, cannot_create, SquealerError } from "../util/errors";
import { created } from "../util/success";
import { Interval, TimedSqueal, Success, TimedSquealGeo } from "../util/types";
import mongoose from "mongoose";

var intervals: Array<Interval> = [];

/**
 * funzione che attiva tutti i timer (da usare all'avvio del server)
 */
export async function startAllTimer() {
  console.log("[STARTING TIMERS...]");
  const squeals: (TimedSqueal | TimedSquealGeo)[] | SquealerError =
    await getAllTimedSqueals();
  if (squeals instanceof SquealerError) {
    return squeals as SquealerError;
  } else if (squeals === undefined) {
    return squeals;
  } else if (Array.isArray(squeals)) {
    for (let i of squeals) {
      await startTimer(i, i._id);
    }
  } else return no_timers;
}

/**
 * funzione che inizializza un timer per uno squeal automatizzato
 * @param squeal lo squeal da postare
 * @param time il tempo necessario per postare uno squeal
 * @param id id dello squeal
 * @returns SquealerError | Success
 */
export async function startTimer(
  squeal: TimedSqueal | TimedSquealGeo,
  userId: string
) {
  let interval: NodeJS.Timeout;
  interval = setInterval(async () => {
    const newSqueal: TimedSqueal | TimedSquealGeo | SquealerError =
      await getTimedSquealById(squeal._id);
    if (newSqueal instanceof SquealerError) return no_timers;
    else
      await postAutomatedSqueal(
        newSqueal as TimedSqueal | TimedSquealGeo,
        (newSqueal as TimedSqueal | TimedSquealGeo)._id,
        userId
      );
  }, squeal.time as number);
  const ret: SquealerError | Success = await setSquealInterval(
    interval,
    squeal._id
  );
  return ret;
}

/**
 * funzione che ferma un post automatico
 * @param TimedSqueal squeal automatico da fermare
 */
export async function stopTimer(squeal: TimedSqueal | TimedSquealGeo) {
  clearInterval(await findInterval(squeal));
  const newIntervals = intervals.filter(
    (interval) => interval.id !== squeal._id
  );
  intervals = newIntervals;
}

/**
 * funzione che trova e ritorna l'intervalId di uno squeal
 * @param TimedSqueal | TimedSquealGeo squeal
 * @returns NodeJS.Timeout
 */
export async function findInterval(squeal: TimedSqueal | TimedSquealGeo) {
  const ret: Interval | undefined = intervals.find(
    (el) => el.id === squeal._id
  );
  return ret?.timeout as NodeJS.Timeout;
}

/**
 *funzione che trova e ritorna uno squeal temporizzato dato un id
 * @param id id dello squeal
 * @returns TimedSqueal | TimedSquealGeo | SquealerError
 */
export async function getTimedSquealById(id: string) {
  const timedSqueal: TimedSqueal | SquealerError = await getTimedSqueal(id);
  if (timedSqueal instanceof SquealerError) {
    const timedGeoSqueal: TimedSquealGeo | SquealerError =
      await getTimedSquealGeo(id);
    return timedGeoSqueal;
  } else return timedSqueal;
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
