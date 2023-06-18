import squealModel from "../models/squeals.model";
import squealGeoModel from "../models/squealGeo.model";
import squealMediaModel from "../models/squalMedia.model";
import {
  Squeal,
  TimedSqueal,
  Channel,
  SquealGeo,
  SquealMedia,
} from "../../util/types";
import timedSquealModel from "../models/timedSqueals.model";
import channelsModel from "../models/channels.model";
import { ErrorCodes, Error, ErrorDescriptions } from "../../util/errors";
import { Success, SuccessCode, SuccessDescription } from "../../util/success";
import { addSquealToChannel, getAllChannels } from "./channels";

/**
 * funzione che ritorna tutti gli squeals non temporizzati
 * @returns tutti gli squeals
 * TESTATA
 */
export async function getAllSqueals() {
  try {
    const squealsText: any[] = await squealModel.find();
    const squealsGeo: any[] = await squealGeoModel.find();
    const squealsMedia: any[] = await squealMediaModel.find();
    const squeals = squealsText.concat(squealsGeo, squealsMedia);
    if (squeals.length < 1)
      return new Error(ErrorDescriptions.non_existent, ErrorCodes.non_existent);
    else return squeals;
  } catch (error) {
    console.log(error);
  }
}

export async function getTextSqueals() {
  try {
    const squeals: any[] = await squealModel.find();
    if (squeals.length < 1)
      return new Error(ErrorDescriptions.non_existent, ErrorCodes.non_existent);
    else return squeals;
  } catch (error) {
    console.log(error);
  }
}

export async function getMediaSqueals() {
  try {
    const squeals: any[] = await squealMediaModel.find();
    if (squeals.length < 1)
      return new Error(ErrorDescriptions.non_existent, ErrorCodes.non_existent);
    else return squeals;
  } catch (error) {
    console.log(error);
  }
}

export async function getGeoSqueals() {
  try {
    const squeals: any[] = await squealGeoModel.find();
    if (squeals.length < 1)
      return new Error(ErrorDescriptions.non_existent, ErrorCodes.non_existent);
    else return squeals;
  } catch (error) {
    console.log(error);
  }
}

/**
 * funzione che ritorna tutti gli squeal temporizzati
 * @returns squeals temporizzati
 * TESTATA
 */
export async function getAllTimers() {
  try {
    const timedSqueals: any = await timedSquealModel.find();
    if (timedSqueals.length < 1)
      return new Error(ErrorDescriptions.non_existent, ErrorCodes.non_existent);
    else return timedSqueals as TimedSqueal;
  } catch (error: any) {
    console.log({ errorName: error.name, errorDescription: error.message });
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
export async function postTextSqueal(squeal: Squeal) {
  try {
    const channels: any = await getAllChannels();

    const newSqueal: any = await squealModel.create({
      body: squeal.body,
      recipients: squeal.recipients,
      date: new Date(),
      category: squeal.category,
      channels: squeal.channels,
    });

    if (!newSqueal)
      return new Error(
        ErrorDescriptions.cannot_create,
        ErrorCodes.cannot_create
      );
    else {
      if (newSqueal.channels.length < 1) {
        return new Success(SuccessDescription.created, SuccessCode.created);
      } else {
        for (let i of newSqueal.channels) {
          for (let j of channels) {
            if (i === j.name) {
              const id: unknown = newSqueal._id;
              const ret: any = await addSquealToChannel(j.name, id as string);
              return ret;
            }
          }
        }
        return new Success(SuccessDescription.created, SuccessCode.created);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

export async function postGeoSqueal(squeal: SquealGeo) {
  try {
    const channels: any = await getAllChannels();

    const newSqueal: any = await squealGeoModel.create({
      lat: squeal.lat,
      lng: squeal.lng,
      recipients: squeal.recipients,
      date: new Date(),
      category: squeal.category,
      channels: squeal.channels,
    });

    if (!newSqueal)
      return new Error(
        ErrorDescriptions.cannot_create,
        ErrorCodes.cannot_create
      );
    else {
      if (newSqueal.channels.length < 1) {
        return new Success(SuccessDescription.created, SuccessCode.created);
      } else {
        for (let i of newSqueal.channels) {
          for (let j of channels) {
            if (i === j.name) {
              const id: unknown = newSqueal._id;
              const ret: any = await addSquealToChannel(j.name, id as string);
              return ret;
            }
          }
        }
        return new Success(SuccessDescription.created, SuccessCode.created);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

//TODO
export async function postMediaSqueal(squeal: SquealMedia, filename: string) {
  try {
    const channels: any = await getAllChannels();

    const newSqueal: any = await squealMediaModel.create({
      body: filename,
      recipients: squeal.recipients,
      date: new Date(),
      category: squeal.category,
      channels: squeal.channels,
    });

    if (!newSqueal)
      return new Error(
        ErrorDescriptions.cannot_create,
        ErrorCodes.cannot_create
      );
    else {
      if (newSqueal.channels.length < 1) {
        return new Success(SuccessDescription.created, SuccessCode.created);
      } else {
        for (let i of newSqueal.channels) {
          for (let j of channels) {
            if (i === j.name) {
              const id: unknown = newSqueal._id;
              const ret: any = await addSquealToChannel(j.name, id as string);
              return ret;
            }
          }
        }
        return new Success(SuccessDescription.created, SuccessCode.created);
      }
    }
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
 * funzione che crea uno squeal temporizzato (per farlo partire usare la funzione apposita)
 * @param squeal squeal temporizzato
 */
export async function postTimedSqueal(squeal: TimedSqueal) {
  try {
    const newSqueal: any = await timedSquealModel.create(squeal);
    if (!newSqueal)
      return new Error(
        ErrorDescriptions.cannot_create,
        ErrorCodes.cannot_create
      );
    else return new Success(SuccessDescription.created, SuccessCode.created);
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
    const deleted: any = await squealModel.deleteOne(
      { _id: id },
      { returnDocument: "after" }
    );
    // TODO testare il valore di ritorno e fare error handling
    if (deleted.deletedCount < 1)
      return new Error(
        ErrorDescriptions.cannot_delete,
        ErrorCodes.cannot_delete
      );
    else return new Success(SuccessDescription.removed, SuccessCode.removed);
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
    const deleted: any = await timedSquealModel.deleteOne(
      { _id: id },
      {
        returnDocument: "after",
      }
    );
    if (deleted.deletedCount < 1)
      return new Error(
        ErrorDescriptions.cannot_delete,
        ErrorCodes.cannot_delete
      );
    else return new Success(SuccessDescription.removed, SuccessCode.removed);
  } catch (error) {
    console.log(error);
  }
}
