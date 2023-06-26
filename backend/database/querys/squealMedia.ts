import { ErrorCodes, ErrorDescriptions, Error } from "../../util/errors";
import { Success, SuccessCode, SuccessDescription } from "../../util/success";
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
    const squeals: any[] = await squealMediaModel.find();
    if (squeals.length < 1)
      return new Error(ErrorDescriptions.non_existent, ErrorCodes.non_existent);
    else return squeals;
  } catch (error) {
    console.log(error);
  }
}

/**
 * funzione che crea un media squeal
 * @param squeal corpo dello squeal da creare
 * @param filename nome del file (utilizzare la chiamata di caricamento e poi mettere in "filename" il valore di ritorno)
 * @returns ritorna successo o errore
 */
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
 * funzione che cancella uno squeal
 * @param id id dello squeal
 * @returns errori eventuali
 */
export async function deleteMediaSqueal(id: string) {
  try {
    const file = await squealMediaModel.findById(id);
    await fs.unlink(resolve(publicUploadPath, file?.body!), (err) => {
      if (err) {
        console.log(err);
        return new Error(
          ErrorDescriptions.cannot_delete,
          ErrorCodes.cannot_delete
        );
      }
    });
    const deleted: any = await squealMediaModel.deleteOne(
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
