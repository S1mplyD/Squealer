import {
  getAllTimers,
  postTimedSqueal,
  setSquealTimer,
} from "../database/querys/squeals";

/**
 * funzione che attiva tutti i timer (da usare all'avvio del server)
 */
export async function startAllTimer() {
  const squeals: any = await getAllTimers();
  for (let i of squeals) {
    await startTimer(i, i.time as number, i.id as string);
  }
}

/**
 * funzione che inizializza un timer per uno squeal automatizzato
 * @param squeal lo squeal da postare
 * @param time il tempo necessario per postare uno squeal
 * @param id id dello squeal
 */
export async function startTimer(squeal: any, time: number, id: string) {
  const interval: any = setInterval(async () => {
    await postTimedSqueal(squeal);
  }, time);
  await setSquealTimer(time, interval, id);
}

/**
 * funzione che ferma un post automatico
 * @param squeal squeal automatico da fermare
 */
export async function stopTimer(squeal: any) {
  clearInterval(squeal.intervalId);
}
