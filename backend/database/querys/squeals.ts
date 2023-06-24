import squealModel from "../models/squeals.model";
import squealGeoModel from "../models/squealGeo.model";
import squealMediaModel from "../models/squalMedia.model";
import {
  Squeal,
  TimedSqueal,
  SquealGeo,
  SquealMedia,
  Error as ErrorType,
} from "../../util/types";
import timedSquealModel from "../models/timedSqueals.model";
import { ErrorCodes, Error, ErrorDescriptions } from "../../util/errors";
import { Success, SuccessCode, SuccessDescription } from "../../util/success";
import { addSquealToChannel, getAllChannels } from "./channels";

/**
 * funzione che ritorna tutti gli squeals non temporizzati
 * @returns tutti gli squeals
 */
export async function getAllSqueals() {
  try {
    const squealsText: Squeal[] = await squealModel.find();
    const squealsGeo: SquealGeo[] = await squealGeoModel.find();
    const squealsMedia: SquealMedia[] = await squealMediaModel.find();
    const timedSqueal: TimedSqueal[] = await timedSquealModel.find();
    const squeals: (Squeal | SquealGeo | SquealMedia | TimedSqueal)[] = [
      ...squealsText,
      ...squealsGeo,
      ...squealsMedia,
      ...timedSqueal,
    ];
    if (squeals.length < 1)
      return new Error(ErrorDescriptions.non_existent, ErrorCodes.non_existent);
    else return squeals;
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
 * funzione che ritorna tutti i media squeals
 * @returns un array di media squeals o un errore
 */
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

/**
 * funzione che ritorna tutti gli squeal appartenenti a certi destinatari
 * @param recipients destinatari da ricercare
 * @returns squeals appartenenti ai destinatari scelti
 */
export async function getSquealsByRecipients(recipient: string) {
  try {
    const squeals: (Squeal | SquealGeo | SquealMedia | TimedSqueal)[] =
      (await getAllSqueals()) as (
        | Squeal
        | SquealGeo
        | SquealMedia
        | TimedSqueal
      )[];
    if (squeals instanceof Error) return Error;
    else {
      let squealArray: any[] = [];
      //Controllo che il destinatario ricercato sia presente in uno squeal
      for (let i of squeals) {
        for (let j of i.recipients) {
          if (j === recipient) {
            squealArray.push(i);
          }
        }
      }
      if (squealArray.length < 1)
        return new Error(
          ErrorDescriptions.non_existent,
          ErrorCodes.non_existent
        );
      else return squealArray;
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * funzione che ritorna tutti gli squeal appartenenti ad un certo canale
 * @param channel canale da ricercare
 * @returns squeals appartenenti al canale scelto
 */
export async function getSquealsByChannel(channel: string) {
  try {
    const squeals: (Squeal | SquealGeo | SquealMedia | TimedSqueal)[] =
      (await getAllSqueals()) as (
        | Squeal
        | SquealGeo
        | SquealMedia
        | TimedSqueal
      )[];
    if (squeals instanceof Error) return Error;
    else {
      let squealArray: any[] = [];
      //Controllo che il destinatario ricercato sia presente in uno squeal
      for (let i of squeals) {
        if (i.channels) {
          for (let j of i.channels) {
            if (j === channel) {
              squealArray.push(i);
            }
          }
        }
      }
      if (squealArray.length < 1)
        return new Error(
          ErrorDescriptions.non_existent,
          ErrorCodes.non_existent
        );
      else return squealArray;
    }
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
    const timedSqueals: TimedSqueal[] = await timedSquealModel.find();
    if (timedSqueals.length < 1)
      return new Error(ErrorDescriptions.non_existent, ErrorCodes.non_existent);
    else return timedSqueals;
  } catch (error: any) {
    console.log({ errorName: error.name, errorDescription: error.message });
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
 * funzione che cancella uno squeal temporizzato
 * @param id id dello squeal temporizzato
 */
//TODO fermare il timer
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
