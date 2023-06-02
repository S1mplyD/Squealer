import { squealModel } from "../models/squeals.model";
import { Squeal, TimedSqueal, Channel } from "../../util/types";
import { timedSquealModel } from "../models/timedSqueals.model";
import { channelsModel } from "../models/channels.model";
import { ErrorCodes, Error, ErrorDescriptions } from "../../util/errors";
import { Success, SuccessCode, SuccessDescription } from "../../util/success";
import { addSquealToChannel, getAllChannels } from "./channels";

/**
 * funzione che ritorna tutti gli squeals non temporizzati
 * @returns tutti gli squeals
 */
export async function getAllSqueals() {
  try {
    await squealModel.find().then((squeals) => {
      if (!squeals)
        return new Error(
          ErrorDescriptions.non_existent,
          ErrorCodes.non_existent
        );
      else return squeals;
    });
  } catch (error) {
    console.log(error);
  }
}

/**
 * funzione che ritorna tutti gli squeal temporizzati
 * @returns squeals temporizzati
 */
export async function getAllTimers() {
  try {
    await timedSquealModel.find().then((timedSqueals) => {
      if (!timedSqueals)
        return new Error(
          ErrorDescriptions.non_existent,
          ErrorCodes.non_existent
        );
      else return timedSqueals;
    });
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
    if (squealArray.length < 1)
      return new Error(ErrorDescriptions.non_existent, ErrorCodes.non_existent);
    else return squealArray;
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
    if (squealArray.length < 1)
      return new Error(ErrorDescriptions.non_existent, ErrorCodes.non_existent);
    else return squealArray;
  } catch (error) {
    console.log(error);
  }
}

/**
 * crea un nuovo squeal (non automatizzato)
 * @param squeal oggetto contenente i parametri dello squeal
 * @returns eventuali errori
 */
// TODO aggiungere squeals ai channel
export async function postSqueal(squeal: Squeal) {
  try {
    const channels: any = await getAllChannels();

    await squealModel.create(squeal).then(async (newSqueal) => {
      for (let i of newSqueal.channels) {
        for (let j of channels) {
          if (i === j.name) {
            const id: unknown = newSqueal._id;
            await addSquealToChannel(j.name, id as string);
          }
        }
      }
    });
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
    await timedSquealModel
      .findByIdAndUpdate(
        squeal._id,
        {
          intervalId: intervalId,
        },
        { returnDocument: "after" }
      )
      .then((newDocument) => {
        if (!newDocument)
          return new Error(
            ErrorDescriptions.non_existent,
            ErrorCodes.non_existent
          );
        else {
          if (intervalId === newDocument.intervalId) {
            return new Success(SuccessDescription.updated, SuccessCode.updated);
          } else {
            return new Error(
              ErrorDescriptions.cannot_update,
              ErrorCodes.cannot_update
            );
          }
        }
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
    await timedSquealModel.create(squeal).then((newSqueal) => {
      if (!newSqueal)
        return new Error(
          ErrorDescriptions.cannot_create,
          ErrorCodes.cannot_create
        );
      else return new Success(SuccessDescription.created, SuccessCode.created);
    });
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
    await squealModel.findByIdAndDelete(id).then((document) => {
      // TODO testare il valore di ritorno e fare error handling
      console.log(document);
    });
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
    await timedSquealModel
      .findByIdAndDelete(id, { returnDocument: "after" })
      .then((doc) => {
        // TODO testare il valore di ritorno e fare error handling
        console.log(doc);
      });
  } catch (error) {
    console.log(error);
  }
}
