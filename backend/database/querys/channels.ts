import {
  SquealerError,
  cannot_create,
  cannot_delete,
  cannot_update,
  non_existent,
  unauthorized,
} from "../../util/errors";
import { created, removed, updated } from "../../util/success";
import {
  Channel,
  Squeal,
  SquealGeo,
  SquealMedia,
  TimedSqueal,
  TimedSquealGeo,
} from "../../util/types";
import channelsModel from "../models/channels.model";
import { getSquealById } from "./squeals";

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
 * funziona che ritorna un canale
 * @param name nome del canale
 * @returns Channel | SquealerError
 */
export async function getChannel(name: string) {
  const channel: Channel | null = await channelsModel.findOne({ name: name });
  if (!channel) return non_existent;
  else return channel;
}

/**
 * funzione che ritorna tutti gli userchannel
 * @returns Channel[] | SquealerError
 */
export async function getAllUserChannel() {
  const userChannels: Channel[] | null = await channelsModel.find({
    type: "userchannel",
  });
  if (!userChannels) return non_existent;
  else return userChannels;
}

/**
 * funzione che ritorna tutti gli officialchannle
 * @returns Channel[] | SquealerError
 */
export async function getAllOfficialChannel() {
  const channels: Channel[] | null = await channelsModel.find({
    type: "officialchannel",
  });
  if (!channels) return non_existent;
  else return channels;
}

/**
 * funzione che ritorna tutti i keyword channel
 * @returns Channel[] | SquealerError
 */
export async function getAllKeywordChannel() {
  const channels: Channel[] | null = await channelsModel.find({
    type: "keyword",
  });
  if (!channels) return non_existent;
  else return channels;
}

/**
 * funzione che ritorna tutte le menzioni
 * @returns Channel[] | SquealerError
 */
export async function getAllMentionChannel() {
  const channels: Channel[] | null = await channelsModel.find({
    type: "mention",
  });
  if (!channels) return non_existent;
  else return channels;
}

/**
 * funzione che ritorna tutti gli squeal appartenenti ad un canale
 * @param channelName nome del canale
 * @returns SquealerError | (Squeal | SquealGeo | SquealMedia
      | TimedSqueal
      | TimedSquealGeo
    )[]
 */
export async function getAllSquealFromChannel(channelName: string, userId) {
  const channel: Channel | SquealerError = await getChannel(channelName);
  if (channel instanceof SquealerError) return non_existent;
  else {
    if (channel.allowedRead.includes(userId)) {
      let squeals: (
        | Squeal
        | SquealGeo
        | SquealMedia
        | TimedSqueal
        | TimedSquealGeo
      )[] = [];
      for (let i of channel.squeals) {
        const squeal:
          | SquealerError
          | Squeal
          | SquealGeo
          | SquealMedia
          | TimedSqueal
          | TimedSquealGeo = await getSquealById(i);
        if (squeal instanceof SquealerError) return non_existent;
        else {
          squeals.push(squeal);
        }
      }
      return squeals;
    } else return unauthorized;
  }
}

/**
 * funzione che crea un canale
 * @param channelName nome del canale da creare
 * @returns SquealerError | Success
 */
export async function createChannel(channelName: string, type: string) {
  if (type === "userchannel") {
    const newChannel = await channelsModel.create({
      name: channelName.toLowerCase(),
      type: type,
    });
    if (!newChannel) return cannot_create;
    else return created;
  } else if (type === "officialchannel") {
    const newChannel = await channelsModel.create({
      name: channelName.toUpperCase(),
      type: type,
    });
    if (!newChannel) return cannot_create;
    else return created;
  } else {
    const newChannel = await channelsModel.create({
      name: channelName,
      type: type,
    });
    if (!newChannel) return cannot_create;
    else return created;
  }
}

/**
 * funzione che aggiunge un utente al canale con i permessi di leggere e scrivere
 * @param userId id dell'utente
 * @param channelName nome del canale
 * @returns SquealerError | Success
 */
export async function addUserToUserChannel(
  userId: string,
  channelName: string
) {
  const update = await channelsModel.updateOne(
    { name: channelName, type: "userchannel" },
    { $push: { allowedRead: userId, allowedWrite: userId } }
  );
  if (update.modifiedCount < 1) return cannot_update;
  else return updated;
}

/**
 * funzione che rimuove un utente da un canale
 * @param userId id utente
 * @param channelName nome del canale
 * @returns Success | SquealerError
 */
export async function removeUserFromChannel(
  userId: string,
  channelName: string
) {
  const update = await channelsModel.updateOne(
    { name: channelName },
    { $pop: { allowedRead: userId, allowedWrite: userId } }
  );
  if (update.modifiedCount < 1) return cannot_update;
  else return updated;
}

//ESEGUIRE OGNI VOLTA CHE UN ACCOUNT VIENE CREATO
/**
 * funzione che aggiunge un utente ad un canale ufficiale
 * @param userId id dell'utente
 * @param channelName nome del canale
 * @returns Success | SquealerError
 */
export async function addUserReadToOfficialChannel(
  userId: string,
  channelName: string
) {
  const update = await channelsModel.updateOne(
    { name: channelName },
    { $push: { allowedRead: userId } }
  );
  if (update.modifiedCount < 1) return cannot_update;
  else return updated;
}

//ESEGUIRE OGNI VOLTA CHE UN UTENTE RICEVE I PERMESSI DA ADMIN
/**
 * funzione che aggiunge un admin ad un canale ufficiale
 * @param adminId id dell'admin
 * @param channelName nome del canale
 * @returns Success | SquealerError
 */
export async function addAdminToOfficialChannel(
  adminId: string,
  channelName: string
) {
  const update = await channelsModel.updateOne(
    { name: channelName },
    { $push: { allowedRead: adminId, allowedWrite: adminId } }
  );
  if (update.modifiedCount < 1) return cannot_update;
  else return updated;
}

/**
 * funzione che aggiunge uno squeal ad un canale
 * @param channelName nome del canale
 * @param squealId id dello squeal da aggiungere al canale
 * @param userId id dell'utente
 * @returns SquealerError | Success
 */
export async function addSquealToChannel(
  channelName: string,
  squealId: string,
  userId: string
) {
  const channel: Channel | SquealerError = await getChannel(channelName);
  if (channel instanceof SquealerError) {
    const squeal:
      | SquealerError
      | Squeal
      | SquealGeo
      | SquealMedia
      | TimedSqueal
      | TimedSquealGeo = await getSquealById(squealId);
    if (squeal instanceof SquealerError) return non_existent;
    else {
      //Se il canale non esiste ma è una keyword creo il canale e poi aggiungo lo squeal
      for (let i of squeal.recipients) {
        if (i.includes("#")) {
          await createChannel(i, "keyword");
          await addSquealToChannel(i, squeal._id, userId);
        }
      }
    }
  } else {
    //canali con richiesta di scrittura
    if (
      (channel.type === "userchannel" || channel.type === "officialchannel") &&
      channel.allowedWrite.includes(userId)
    ) {
      const update = await channelsModel.updateOne(
        { name: channelName },
        { $push: { squeals: squealId } }
      );
      if (update.modifiedCount < 1) return cannot_update;
      else return updated;
    } else {
      const update = await channelsModel.updateOne(
        { name: channelName },
        { $push: { squeals: squealId } }
      );
      if (update.modifiedCount < 1) return cannot_update;
      else return updated;
    }
  }
}

/**
 * funzione che elimina un canale
 * @param name nome del canale
 * @returns SquealerError | Success
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
