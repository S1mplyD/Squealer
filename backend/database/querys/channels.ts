import { Error, ErrorCodes, ErrorDescriptions } from "../../util/errors";
import { Success, SuccessCode, SuccessDescription } from "../../util/success";
import { channelsModel } from "../models/channels.model";

/**
 * funzione che ritorna tutti i canali
 * TESTATA
 */
export async function getAllChannels() {
  const channels: any = await channelsModel.find();
  if (channels.length < 1) {
    return new Error(ErrorDescriptions.non_existent, ErrorCodes.non_existent);
  } else {
    return channels;
  }
}

/**
 * funzione che crea un canale
 * @param channelName nome del canale da creare
 * TESTATA
 */
export async function createChannel(channelName: string) {
  await channelsModel.create({ name: channelName }).then((newChannel) => {
    console.log(newChannel);
    if (!newChannel)
      return new Error(
        ErrorDescriptions.cannot_create,
        ErrorCodes.cannot_create
      );
    else return new Success(SuccessDescription.created, SuccessCode.created);
  });
}

/**
 * funzione che aggiunge uno squeal ad un canale
 * @param channelName nome del canale
 * @param squealId id dello squeal da aggiungere al canale
 */
export async function addSquealToChannel(
  channelName: string,
  squealId: string
) {
  const updatedDoc: any = await channelsModel.findOneAndUpdate(
    { name: channelName },
    { $push: { squeals: squealId } },
    { returnDocument: "after" }
  );

  console.log(updatedDoc);

  if (!updatedDoc)
    return new Error(ErrorDescriptions.non_existent, ErrorCodes.non_existent);
  else {
    if (updatedDoc.squeals.includes(squealId))
      return new Success(SuccessDescription.updated, SuccessCode.updated);
    else
      return new Error(
        ErrorDescriptions.cannot_update,
        ErrorCodes.cannot_update
      );
  }
}

/**
 * funzione che elimina un canale
 * @param name nome del canale
 * TESTATA
 */
export async function deleteChannel(name: string) {
  const deleted: any = await channelsModel.deleteOne(
    { name: name },
    { returnDocument: "after" }
  );
  if (deleted.deletedCount == 0) {
    return new Error(ErrorDescriptions.cannot_delete, ErrorCodes.cannot_delete);
  } else {
    return new Success(SuccessDescription.removed, SuccessCode.removed);
  }
}
