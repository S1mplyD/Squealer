import mongoose from "mongoose";
import {
  Error,
  ErrorCodes,
  ErrorDescriptions,
  cannot_create,
  cannot_delete,
  non_existent,
} from "../../util/errors";
import {
  Success,
  SuccessCode,
  SuccessDescription,
  created,
  removed,
} from "../../util/success";
import { SquealGeo } from "../../util/types";
import squealGeoModel from "../models/squealGeo.model";
import { addSquealToChannel, getAllChannels } from "./channels";

/**
 * funzione che ritorna tutti i geo squeal
 * @returns error o geo squeals
 */
export async function getGeoSqueals() {
  try {
    const squeals: any[] = await squealGeoModel.find();
    if (squeals.length < 1) return non_existent;
    else return squeals;
  } catch (error: any) {
    console.log({ errorName: error.name, errorDescription: error.message });
  }
}

export async function getGeoSqueal(id: mongoose.Types.ObjectId) {
  const squeal: SquealGeo | null = await squealGeoModel.findById(id);
  if (!squeal) return non_existent;
  else return squeal;
}

/**
 * funzione che crea un geo squeal
 * @param squeal corpo del geo squeal da creare
 * @returns errore o successo
 */
export async function postGeoSqueal(squeal: SquealGeo, author: string) {
  try {
    const channels: any = await getAllChannels();

    const newSqueal: any = await squealGeoModel.create({
      lat: squeal.lat,
      lng: squeal.lng,
      recipients: squeal.recipients,
      date: new Date(),
      category: squeal.category,
      channels: squeal.channels,
      author: author,
    });

    if (!newSqueal) return cannot_create;
    else {
      if (newSqueal.channels.length < 1) {
        return created;
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
        return created;
      }
    }
  } catch (error: any) {
    console.log({ errorName: error.name, errorDescription: error.message });
  }
}

/**
 * funzione che cancella uno squeal
 * @param id id dello squeal
 * @returns errori eventuali
 */
export async function deleteGeoSqueal(id: string) {
  try {
    const deleted: any = await squealGeoModel.deleteOne(
      { _id: id },
      { returnDocument: "after" }
    );
    if (deleted.deletedCount < 1) return cannot_delete;
    else return removed;
  } catch (error: any) {
    console.log({ errorName: error.name, errorDescription: error.message });
  }
}
