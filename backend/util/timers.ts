import timedSquealModel from "../database/models/timedSqueals.model";
import { postAutomatedSqueal } from "../database/querys/automatedSqueal";
import { getAllTimers } from "../database/querys/timedSqueal";
import { ErrorCodes, ErrorDescriptions, Error } from "./errors";
import { Success, SuccessCode, SuccessDescription } from "./success";
import { Interval, TimedSqueal } from "./types";
import mongoose, { Types } from "mongoose";

var intervals: Array<Interval> = [];

/**
 * funzione che attiva tutti i timer (da usare all'avvio del server)
 */
export async function startAllTimer() {
  const squeals: TimedSqueal[] | Error | undefined = await getAllTimers();
  if (squeals instanceof Error) {
    return squeals;
  }
  if (squeals) {
    if (squeals.length > 0) {
      for (let i of squeals) {
        await startTimer(i as TimedSqueal, i.author);
      }
    } else return new Error(ErrorDescriptions.no_timers, ErrorCodes.no_timers);
  } else return new Error(ErrorDescriptions.no_timers, ErrorCodes.no_timers);
}

/**
 * funzione che inizializza un timer per uno squeal automatizzato
 * @param squeal lo squeal da postare
 * @param time il tempo necessario per postare uno squeal
 * @param id id dello squeal
 */
export async function startTimer(squeal: TimedSqueal, author: string) {
  let interval: NodeJS.Timeout;
  interval = setInterval(async () => {
    console.log("interval");

    const newSqueal: TimedSqueal | null = await timedSquealModel
      .findById(squeal._id)
      .lean();
    if (!newSqueal)
      return new Error(ErrorDescriptions.no_timers, ErrorCodes.no_timers);
    else await postAutomatedSqueal(newSqueal, newSqueal._id);
  }, squeal.time as number);
  const ret: Error | Success = await setSquealInterval(interval, squeal._id);
  return ret;
}

/**
 * funzione che ferma un post automatico
 * @param TimedSqueal squeal automatico da fermare
 */
export async function stopTimer(squeal: TimedSqueal) {
  clearInterval(await findInterval(squeal));
  const newIntervals = intervals.filter(
    (interval) => interval.id !== squeal._id
  );
  intervals = newIntervals;
}

export async function findInterval(squeal: TimedSqueal) {
  const ret: Interval | undefined = intervals.find((el) =>
    el.id.equals(squeal._id)
  );
  return ret?.timeout as NodeJS.Timeout;
}

/**
 * funzione che salva gli intervalli degli squeal automatici
 */
export async function setSquealInterval(
  timeout: NodeJS.Timeout,
  id: mongoose.Types.ObjectId
) {
  const len: number = intervals.length;
  const newInterval: Interval = {
    timeout: timeout,
    id: id,
  };
  intervals.push(newInterval);
  console.log(newInterval.timeout);

  if (intervals.length > len) {
    return new Success(SuccessDescription.created, SuccessCode.created);
  } else
    return new Error(ErrorDescriptions.cannot_create, ErrorCodes.cannot_create);
}
