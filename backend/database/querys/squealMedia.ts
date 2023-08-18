import mongoose from "mongoose";
import { imagetypes, videotypes } from "../../util/constants";
import {
  cannot_delete,
  non_existent,
  not_recived,
  not_supported,
  cannot_create,
} from "../../util/errors";
import { created, removed } from "../../util/success";
import { SquealMedia } from "../../util/types";
import squealMediaModel from "../models/squalMedia.model";
import { addSquealToChannel, getAllChannels } from "./channels";
import fs from "fs";
import { resolve } from "path";

const publicUploadPath = resolve(__dirname, "../..", "public/uploads/");

/**
 * funzione che ritorna tutti i media squeals
 * @returns un array di media squeals o un errore
 */
export async function getMediaSqueals() {
  try {
    const squeals: SquealMedia[] = await squealMediaModel.find();
    if (squeals.length < 1) return non_existent;
    else return squeals;
  } catch (error: any) {
    console.log({ errorName: error.name, errorDescription: error.message });
  }
}

export async function getMediaSqueal(id: string) {
  const squeal: SquealMedia | null = await squealMediaModel.findById(id);
  if (!squeal) return non_existent;
  else return squeal;
}

/**
 * funzione che crea un media squeal
 * @param squeal corpo dello squeal da creare
 * @param filename {string} nome del file (utilizzare la chiamata di caricamento e poi mettere in "filename" il valore di ritorno)
 * @returns ritorna successo o errore
 */
export async function postMediaSqueal(squeal: SquealMedia, filename: string) {
  try {
    const channels: any = await getAllChannels();
    var type: string | undefined = filename.split(".").pop();

    if (typeof type === "undefined") {
      return not_recived;
    } else {
      if (imagetypes.includes(type)) {
        type = "image";
      } else if (videotypes.includes(type)) {
        type = "video";
      } else {
        return not_supported;
      }
    }

    const newSqueal: any = await squealMediaModel.create({
      body: filename,
      type: type,
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
              const ret: any = await addSquealToChannel(j.name, id);
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
export async function deleteMediaSqueal(id: string) {
  try {
    const file = await squealMediaModel.findById(id);
    await fs.unlink(resolve(publicUploadPath, file?.body!), (err) => {
      if (err) {
        return cannot_delete;
      }
    });
    const deleted: any = await squealMediaModel.deleteOne(
      { _id: id },
      { returnDocument: "after" }
    );
    if (deleted.deletedCount < 1) return cannot_delete;
    else return removed;
  } catch (error: any) {
    console.log({ errorName: error.name, errorDescription: error.message });
  }
}
