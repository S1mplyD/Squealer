import { squealModel } from "../models/squeals.model";

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
 * funzione che ritorna tutti gli squeal appartenenti a certi destinatari
 * @param recipients destinatari da ricercare
 * @returns squeals appartenenti ai destinatari scelti
 */
export async function getSquealsByRecipients(recipients: string[]) {
  try {
    return await squealModel.find({ recipients: { $in: recipients } });
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
    return await squealModel.find({ channels: { $in: channels } });
  } catch (error) {
    console.log(error);
  }
}

/**
 * crea un nuovo squeal (non automatizzato)
 * @param squeal oggetto contenente i parametri dello squeal
 * @returns eventuali errori
 */
export async function postSqueal(squeal: any) {
  try {
    return await squealModel.create({
      body: squeal.body,
      recipients: squeal.recipients,
      date: new Date(),
      category: squeal.category,
    });
  } catch (error) {
    console.log(error);
  }
}

/**
 * imposta un timer per un post
 * @param time tempo tra un post e l'altro
 * @param intervalId id dell'intervallo
 * @param id id del post
 */
export async function setSquealTimer(
  time: number,
  intervalId: number,
  id: string
) {
  try {
    await squealModel.findByIdAndUpdate(id, {
      time: time,
      intervalId: intervalId,
    });
  } catch (error) {
    console.log(error);
  }
}

/**
 * funzione che cancella uno squeal
 * @param id id dell squeal
 * @returns errori eventuali
 */
export async function deleteSqueal(id: any) {
  try {
    await squealModel.findByIdAndDelete(id);
  } catch (error) {
    console.log(error);
  }
}
