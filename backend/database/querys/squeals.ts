import squealModel from "../models/squeals.model";
import squealGeoModel from "../models/squealGeo.model";
import squealMediaModel from "../models/squalMedia.model";
import {
  Squeal,
  TimedSqueal,
  SquealGeo,
  SquealMedia,
  Success,
  TimedSquealGeo,
} from "../../util/types";
import timedSquealModel from "../models/timedSqueals.model";
import {
  non_existent,
  cannot_create,
  cannot_delete,
  SquealerError,
} from "../../util/errors";
import { created, removed } from "../../util/success";
import { addSquealToChannel, getAllChannels } from "./channels";
import timedSquealGeoModel from "../models/timedSquealGeo.model";
import { getTimedSqueal } from "./timedSqueal";
import { getTimedSquealGeo } from "./timedSquealGeo";
import { getGeoSqueal } from "./squealGeo";
import { getMediaSqueal } from "./squealMedia";

//FUNZIONI GLOBALI

/**
 * funzione che ritorna tutti gli squeals non temporizzati
 * @returns tutti gli squeals
 */
export async function getAllSqueals() {
  const squealsText: Squeal[] = await squealModel.find();
  const squealsGeo: SquealGeo[] = await squealGeoModel.find();
  const squealsMedia: SquealMedia[] = await squealMediaModel.find();
  const timedSqueal: TimedSqueal[] = await timedSquealModel.find();
  const timedGeoSqueal: TimedSquealGeo[] = await timedSquealGeoModel.find();
  const squeals: (
    | Squeal
    | SquealGeo
    | SquealMedia
    | TimedSqueal
    | TimedSquealGeo
  )[] = [
    ...squealsText,
    ...squealsGeo,
    ...squealsMedia,
    ...timedSqueal,
    ...timedGeoSqueal,
  ];
  if (squeals.length < 1) return non_existent;
  else return squeals;
}

export async function getAllTimedSqueals() {
  const timedTextSqueals: TimedSqueal[] | SquealerError | undefined =
    await timedSquealGeoModel.find();
  const timedGeoSqueals: TimedSquealGeo[] | SquealerError | undefined =
    await timedSquealGeoModel.find();
  const squeals: (TimedSqueal | TimedSquealGeo)[] = [
    ...timedGeoSqueals,
    ...timedTextSqueals,
  ];
  if (squeals.length < 1) return non_existent;
  else return squeals;
}

export async function getSquealById(
  id: string
): Promise<
  | Squeal
  | SquealGeo
  | SquealMedia
  | TimedSqueal
  | TimedSquealGeo
  | SquealerError
> {
  const textSqueal = await getTextSqueal(id);
  if (!(textSqueal instanceof SquealerError)) return textSqueal;

  const geoSqueal = await getGeoSqueal(id);
  if (!(geoSqueal instanceof SquealerError)) return geoSqueal;

  const mediaSqueal = await getMediaSqueal(id);
  if (!(mediaSqueal instanceof SquealerError)) return mediaSqueal;

  const timedTextSqueal = await getTimedSqueal(id);
  if (!(timedTextSqueal instanceof SquealerError)) return timedTextSqueal;

  const timedGeoSqueal = await getTimedSquealGeo(id);
  if (!(timedGeoSqueal instanceof SquealerError)) return timedGeoSqueal;

  return non_existent;
}

//FUNZIONI TEXT

/**
 * funzione che ritorna tutti i text squeal
 * @returns error o gli squeal text
 */
export async function getTextSqueals() {
  const squeals: any[] = await squealModel.find();
  if (squeals.length < 1) return non_existent;
  else return squeals;
}

export async function getTextSqueal(id: string) {
  const squeal: Squeal | null = await squealModel.findById(id);
  if (!squeal) return non_existent;
  else return squeal;
}

/**
 * crea un nuovo squeal (non automatizzato)
 * @param squeal oggetto contenente i parametri dello squeal
 * @returns eventuali errori
 */
export async function postTextSqueal(squeal: Squeal) {
  const channels: any = await getAllChannels();

  const newSqueal: any = await squealModel.create({
    body: squeal.body,
    recipients: squeal.recipients,
    date: new Date(),
    category: squeal.category,
    channels: squeal.channels,
  });

  if (!newSqueal) return cannot_create;
  else {
    if (newSqueal.channels.length < 1) {
      return created;
    } else {
      for (let i of newSqueal.channels) {
        for (let j of channels) {
          if (i === j.name) {
            const id: string = newSqueal._id;
            const ret: SquealerError | Success = await addSquealToChannel(
              j.name,
              id
            );
            return ret;
          }
        }
      }
      return created;
    }
  }
}

/**
 * funzione che cancella uno squeal
 * @param id id dello squeal
 * @returns errori eventuali
 */
export async function deleteTextSqueal(id: string) {
  const deleted: any = await squealModel.deleteOne(
    { _id: id },
    { returnDocument: "after" }
  );
  if (deleted.deletedCount < 1) return cannot_delete;
  else return removed;
}

/**
 * funzione che ritorna tutti gli squeal appartenenti a certi destinatari
 * @param recipients destinatari da ricercare
 * @returns squeals appartenenti ai destinatari scelti
 */
export async function getSquealsByRecipients(recipient: string) {
  const squeals: (Squeal | SquealGeo | SquealMedia | TimedSqueal)[] =
    (await getAllSqueals()) as (
      | Squeal
      | SquealGeo
      | SquealMedia
      | TimedSqueal
    )[];
  if (squeals instanceof SquealerError) return squeals;
  else {
    let squealArray: (Squeal | SquealGeo | SquealMedia | TimedSqueal)[] = [];
    //Controllo che il destinatario ricercato sia presente in uno squeal
    for (let i of squeals) {
      for (let j of i.recipients) {
        if (j === recipient) {
          squealArray.push(i);
        }
      }
    }
    if (squealArray.length < 1) return non_existent;
    else return squealArray;
  }
}

/**
 * funzione che ritorna tutti gli squeal appartenenti ad un certo canale
 * @param channel canale da ricercare
 * @returns squeals appartenenti al canale scelto
 */
export async function getSquealsByChannel(channel: string) {
  const squeals: (Squeal | SquealGeo | SquealMedia | TimedSqueal)[] =
    (await getAllSqueals()) as (
      | Squeal
      | SquealGeo
      | SquealMedia
      | TimedSqueal
    )[];
  if (squeals instanceof SquealerError) return squeals;
  else {
    let squealArray: (Squeal | SquealGeo | SquealMedia | TimedSqueal)[] = [];
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
    if (squealArray.length < 1) return non_existent;
    else return squealArray;
  }
}
