import { postAutomatedSqueal } from "../database/querys/automatedSqueal";
import { getAllTimedSqueals, getTextSqueal } from "../database/querys/squeals";
import { getTimedSqueal } from "../database/querys/timedSqueal";
import { getTimedSquealGeo } from "../database/querys/timedSquealGeo";
import { no_timers, cannot_create } from "./errors";
import { created } from "./success";
import {
  Interval,
  TimedSqueal,
  Error,
  Success,
  Id,
  TimedSquealGeo,
} from "./types";
import mongoose from "mongoose";

var intervals: Array<Interval> = [];

/**
 * funzione che attiva tutti i timer (da usare all'avvio del server)
 */
export async function startAllTimer() {
  console.log("[STARTING TIMERS...]");
  const squeals: (TimedSqueal | TimedSquealGeo)[] | Error =
    await getAllTimedSqueals();
  if (squeals instanceof Error) {
    return squeals as Error;
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
 * @returns Error | Success
 */
export async function startTimer(
  squeal: TimedSqueal | TimedSquealGeo,
  userId: Id,
) {
  let interval: NodeJS.Timeout;
  interval = setInterval(async () => {
    const newSqueal: TimedSqueal | TimedSquealGeo | Error =
      await getTimedSquealById(squeal._id);
    if (newSqueal instanceof Error) return no_timers;
    else
      await postAutomatedSqueal(
        newSqueal as TimedSqueal | TimedSquealGeo,
        (newSqueal as TimedSqueal | TimedSquealGeo)._id,
        userId,
      );
  }, squeal.time as number);
  const ret: Error | Success = await setSquealInterval(interval, squeal._id);
  return ret;
}

/**
 * funzione che ferma un post automatico
 * @param TimedSqueal squeal automatico da fermare
 */
export async function stopTimer(squeal: TimedSqueal | TimedSquealGeo) {
  clearInterval(await findInterval(squeal));
  const newIntervals = intervals.filter(
    (interval) => interval.id !== squeal._id,
  );
  intervals = newIntervals;
}

/**
 * funzione che trova e ritorna l'intervalId di uno squeal
 * @param TimedSqueal | TimedSquealGeo squeal
 * @returns NodeJS.Timeout
 */
export async function findInterval(squeal: TimedSqueal | TimedSquealGeo) {
  const ret: Interval | undefined = intervals.find((el) =>
    el.id.equals(squeal._id),
  );
  return ret?.timeout as NodeJS.Timeout;
}

/**
 *funzione che trova e ritorna uno squeal temporizzato dato un id
 * @param id id dello squeal
 * @returns TimedSqueal | TimedSquealGeo | Error
 */
export async function getTimedSquealById(id: Id) {
  const timedSqueal: TimedSqueal | Error = await getTimedSqueal(id);
  if (timedSqueal instanceof Error) {
    const timedGeoSqueal: TimedSquealGeo | Error = await getTimedSquealGeo(id);
    return timedGeoSqueal;
  } else return timedSqueal;
}

/**
 * funzione che salva gli intervalli degli squeal automatici
 * @param timeout valore dell'interval
 * @param id id squeal
 */
export async function setSquealInterval(
  timeout: NodeJS.Timeout,
  id: mongoose.Types.ObjectId,
) {
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
