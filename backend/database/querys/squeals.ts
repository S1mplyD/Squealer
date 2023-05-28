import { squealModel } from "../models/squeals.model";
import { Squeal, TimedSqueal } from "../../util/types";
import { timedSquealModel } from "../models/timedSqueals.model";

/**
 * funzione che ritorna tutti gli squeals
 * @returns tutti gli squeals
 */
export async function getAllSqueals() {
  try {
    return await squealModel.find();
  } catch (error) {
    console.log(error);
  }
}

/**
 * funzione che ritorna tutti gli squeal temporizzati
 * @returns squeal con un timer
 */
export async function getAllTimers() {
  try {
    return await timedSquealModel.find().where("time").gte(1);
  } catch (error) {
    console.log(error);
  }
}

/**
 * funzione che ritorna tutti gli squeal appartenenti a certi destinatari
 * @param recipients destinatari da ricercare
 * @returns squeals appartenenti ai destinatari scelti
 */
export async function getSquealsByRecipients(recipients: string[]) {
  try {
    const squeals: any = await squealModel.find().in(recipients);
    const timedSqueals: any = await timedSquealModel.find().in(recipients);
    let squealArray: any[] = [];
    for (let i of squeals) {
      squealArray.push(i);
    }
    for (let i of timedSqueals) {
      squealArray.push(i);
    }
    return squealArray;
  } catch (error) {
    console.log(error);
  }
}

/**
 * funzione che ritorna tutti gli squeal appartenenti a certi canali
 * @param channels canali da ricercare
 * @returns squeals appartenenti ai canali scelti
 */
export async function getSquealsByChannel(channels: string[]) {
  try {
    const squeals: any = await squealModel.find().in(channels);
    const timedSqueals: any = await timedSquealModel.find().in(channels);
    let squealArray: any[] = [];
    for (let i of squeals) {
      squealArray.push(i);
    }
    for (let i of timedSqueals) {
      squealArray.push(i);
    }
    return squealArray;
  } catch (error) {
    console.log(error);
  }
}

/**
 * crea un nuovo squeal (non automatizzato)
 * @param squeal oggetto contenente i parametri dello squeal
 * @returns eventuali errori
 */
export async function postSqueal(squeal: Squeal) {
  try {
    return await squealModel.create(squeal);
  } catch (error) {
    console.log(error);
  }
}

/**
 * inserisce l'id dell'interval al timedSqueal
 * @param intervalId id dell'intervallo
 */
export async function setSquealInterval(squeal: TimedSqueal, intervalId: any) {
  try {
    await squealModel.findByIdAndUpdate(squeal._id, {
      intervalId: intervalId,
    });
  } catch (error) {
    console.log(error);
  }
}

/**
 * funzione che crea uno squeal temporizzato
 * @param squeal squeal temporizzato
 */
export async function postTimedSqueal(squeal: TimedSqueal) {
  try {
    await timedSquealModel.create(squeal);
  } catch (error) {
    console.log(error);
  }
}

/**
 * funzione che cancella uno squeal
 * @param id id dello squeal
 * @returns errori eventuali
 */
export async function deleteSqueal(id: string) {
  try {
    await squealModel.findByIdAndDelete(id);
  } catch (error) {
    console.log(error);
  }
}

/**
 * funzione che cancella uno squeal temporizzato
 * @param id id dello squeal temporizzato
 */
export async function deleteTimedSqueal(id: string) {
  try {
    await timedSquealModel.findByIdAndDelete(id);
  } catch (error) {
    console.log(error);
  }
}
