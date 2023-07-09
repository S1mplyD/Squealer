import {
  getAllTimers,
  postTimedSqueal,
  setSquealInterval,
} from "../database/querys/timedSqueal";
import { ErrorCodes, ErrorDescriptions, Error } from "./errors";
import { TimedSqueal } from "./types";

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
  const interval: NodeJS.Timer = setInterval(async () => {
    await postTimedSqueal(squeal, author);
  }, squeal.time);
  await setSquealInterval(squeal, interval);
}

/**
 * funzione che ferma un post automatico
 * @param TimedSqueal squeal automatico da fermare
 */
export async function stopTimer(squeal: TimedSqueal) {
  clearInterval(squeal.intervalId);
}
