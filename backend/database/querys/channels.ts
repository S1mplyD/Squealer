import {
  cannot_create,
  cannot_delete,
  cannot_update,
  non_existent,
} from "../../util/errors";
import { created, removed, updated } from "../../util/success";
import { Channel } from "../../util/types";
import channelsModel from "../models/channels.model";

/**
 * funzione che ritorna tutti i canali
 * @returns SquealerError | Channel[]
 */
export async function getAllChannels() {
  const channels: Channel[] = await channelsModel.find();
  if (channels.length < 1) {
    return non_existent;
  } else {
    return channels;
  }
}

/**
 * funzione che crea un canale
 * @param channelName nome del canale da creare
 * @returns SquealerError | Success
 * TESTATA
 */
export async function createChannel(channelName: string) {
  const newChannel = await channelsModel.create({ name: channelName });
  if (!newChannel) return cannot_create;
  else return created;
}

/**
 * funzione che aggiunge uno squeal ad un canale
 * @param channelName nome del canale
 * @param squealId id dello squeal da aggiungere al canale
 * @returns SquealerError | Success
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
  if (!updatedDoc) return non_existent;
  else {
    if (updatedDoc.squeals.includes(squealId)) return updated;
    else return cannot_update;
  }
}

/**
 * funzione che elimina un canale
 * @param name nome del canale
 * @returns SquealerError | Success
 * TESTATA
 */
export async function deleteChannel(name: string) {
  const deleted: any = await channelsModel.deleteOne(
    { name: name },
    { returnDocument: "after" }
  );
  if (deleted.deletedCount == 0) {
    return cannot_delete;
  } else {
    return removed;
  }
}
