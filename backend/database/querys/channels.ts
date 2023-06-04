import { Error, ErrorCodes, ErrorDescriptions } from "../../util/errors";
import { Success, SuccessCode, SuccessDescription } from "../../util/success";
import { channelsModel } from "../models/channels.model";

/**
 * funzione che ritorna tutti i canali
 * TESTATA
 */
export async function getAllChannels() {
  const channels: any = await channelsModel.find();
  console.log(channels);
  if (channels.length < 1) {
    return new Error(ErrorDescriptions.non_existent, ErrorCodes.non_existent);
  } else {
    return channels;
  }
}

/**
 * funzione che crea un canale
 * @param channelName nome del canale da creare
 */
export async function createChannel(channelName: string) {
  await channelsModel.create({ name: channelName }).then((newChannel) => {
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
  await channelsModel
    .findOneAndUpdate(
      { name: channelName },
      { $push: { squeals: squealId } },
      { returnDocument: "after" }
    )
    .then((updatedDoc) => {
      if (!updatedDoc)
        return new Error(
          ErrorDescriptions.non_existent,
          ErrorCodes.non_existent
        );
      else {
        if (updatedDoc.squeals.includes(squealId))
          return new Success(SuccessDescription.updated, SuccessCode.updated);
        else
          return new Error(
            ErrorDescriptions.cannot_update,
            ErrorCodes.cannot_update
          );
      }
    });
}
