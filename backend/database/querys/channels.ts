import {
  SquealerError,
  cannot_create,
  cannot_delete,
  cannot_update,
  non_existent,
  unauthorized,
} from "../../util/errors";
import { created, removed, updated } from "../../util/success";
import { Channel, Squeal, Success, User } from "../../util/types";
import channelsModel from "../models/channels.model";
import { getSquealById } from "./squeals";
import { getUserByUsername } from "./users";
import { UpdateWriteOpResult } from "mongoose";

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
export async function getAllUserChannel(user: User) {
  const userChannels: Channel[] | null = await channelsModel.find({
    type: "userchannel",
    allowedRead: user._id,
  });
  if (!userChannels) return [];
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
  console.log(channels);
  if (!channels) return [];
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
  if (!channels) return [];
  else return channels;
}

/**
 * funzione che ritorna tutte le menzioni
 * @returns Channel[] | SquealerError
 */
export async function getAllMentionChannel(user: User) {
  const channels: Channel[] | null = await channelsModel.find({
    type: "mention",
    allowedRead: user._id,
    allowedWrite: user._id,
  });
  if (!channels) return [];
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
export async function getAllSquealsFromChannel(
  channelName: string,
  userId: string,
) {
  const channel: Channel | SquealerError = await getChannel(channelName);
  if (channel instanceof SquealerError) return non_existent;
  else {
    if (channel.allowedRead.includes(userId)) {
      let squeals: Squeal[] = [];
      for (let i of channel.squeals) {
        const squeal: Squeal | SquealerError = await getSquealById(i);
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
 * @param type tipo del canale da creare
 * @param user utente che crea il canale
 * @returns SquealerError | Success
 */
export async function createChannel(
  channelName: string,
  type: string,
  user: User,
) {
  if (type === "userchannel") {
    const newChannel = await channelsModel.create({
      name: channelName.toLowerCase(),
      type: type,
      channelAdmins: user._id,
      allowedRead: user._id,
      allowedWrite: user._id,
    });
    if (!newChannel) return cannot_create;
    else return created;
  } else if (type === "officialchannel" && user.plan === "admin") {
    const newChannel = await channelsModel.create({
      name: channelName.toUpperCase(),
      type: type,
      channelAdmins: user._id,
      allowedRead: user._id,
      allowedWrite: user._id,
    });
    if (!newChannel) return cannot_create;
    else return created;
  } else {
    const newChannel = await channelsModel.create({
      name: channelName,
      type: type,
      channelAdmins: user._id,
      allowedRead: user._id,
      allowedWrite: user._id,
    });
    if (!newChannel) return cannot_create;
    else return created;
  }
}

/**
 * funzione che aggiunge un utente al canale con i permessi di leggere e scrivere
 * @param username username dell'utente
 * @param channelName nome del canale
 * @returns SquealerError | Success
 */
export async function addUserToUserChannel(
  username: string,
  channelName: string,
) {
  const user: User | SquealerError = await getUserByUsername(username);
  if (user instanceof SquealerError) return non_existent;
  else {
    const userId = user._id;
    const update = await channelsModel.updateOne(
      { name: channelName, type: "userchannel" },
      { $push: { allowedRead: userId, allowedWrite: userId } },
    );
    if (update.modifiedCount < 1) return cannot_update;
    else return updated;
  }
}

/**
 * funzione che rimuove un utente da un canale
 * @param username username utente
 * @param channelName nome del canale
 * @returns Success | SquealerError
 */
export async function removeUserFromChannel(
  username: string,
  channelName: string,
) {
  const user: User | SquealerError = await getUserByUsername(username);
  if (user instanceof SquealerError) return non_existent;
  else {
    const userId = user._id;
    const update = await channelsModel.updateOne(
      { name: channelName },
      { $pop: { allowedRead: userId, allowedWrite: userId } },
    );
    if (update.modifiedCount < 1) return cannot_update;
    else return updated;
  }
}

export async function editOfficialChannel(
  name: string,
  newName: string,
  allowedRead: string[],
  allowedWrite: string[],
  channelAdmins: string[],
): Promise<Success> {
  const update: UpdateWriteOpResult = await channelsModel.updateOne(
    { name: name },
    {
      name: newName,
      allowedRead: allowedRead,
      allowedWrite: allowedWrite,
      channelAdmins: channelAdmins,
    },
  );
  if (update.modifiedCount > 0) return updated;
  else throw new Error("Cannot Update");
}

export async function updateOfficialSqueals(name: string, squeals: string[]) {
  const update: UpdateWriteOpResult = await channelsModel.updateOne(
    { name: name },
    { squeals: squeals },
  );
  if (update.modifiedCount > 0) return updated;
  else throw new Error("Cannot Update");
}

//ESEGUIRE OGNI VOLTA CHE UN ACCOUNT VIENE CREATO
/**
 * funzione che aggiunge un utente a un canale ufficiale
 * @param userId id dell'utente
 * @param channelName nome del canale
 * @returns Success | SquealerError
 */
export async function addUserReadToOfficialChannel(
  userId: string,
  channelName: string,
) {
  const update = await channelsModel.updateOne(
    { name: channelName },
    { $push: { allowedRead: userId } },
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
  channelName: string,
) {
  const update = await channelsModel.updateOne(
    { name: channelName },
    { $push: { allowedRead: adminId, allowedWrite: adminId } },
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
  user: User,
) {
  const channel: Channel | SquealerError = await getChannel(channelName);
  if (channel instanceof SquealerError) {
    const squeal: SquealerError | Squeal = await getSquealById(squealId);
    if (squeal instanceof SquealerError) return non_existent;
    else {
      //Se il canale non esiste ma è una keyword creo il canale e poi aggiungo lo squeal
      for (let i of squeal.channels) {
        if (i.includes("#")) {
          const create: SquealerError | Success = await createChannel(
            i,
            "keyword",
            user,
          );
          if (create instanceof SquealerError) return create;
          else await addSquealToChannel(i, squeal._id, user);
        }
      }
      return cannot_create;
    }
  } else {
    //canali con richiesta di scrittura
    if (
      (channel.type === "userchannel" || channel.type === "officialchannel") &&
      channel.allowedWrite.includes(user._id)
    ) {
      const update = await channelsModel.updateOne(
        { name: channelName },
        { $push: { squeals: squealId } },
      );
      if (update.modifiedCount < 1) return cannot_update;
      else return updated;
    } else {
      const update = await channelsModel.updateOne(
        { name: channelName },
        { $push: { squeals: squealId } },
      );
      if (update.modifiedCount < 1) return cannot_update;
      else return updated;
    }
  }
}

/**
 * funzione che elimina un canale
 * utilizzata in /api/channels dagli admin
 * @param name nome del canale
 * @returns SquealerError | Success
 */
export async function deleteChannel(name: string, user: User) {
  if (user.plan === "admin") {
    const deleted: any = await channelsModel.deleteOne(
      { name: name },
      { returnDocument: "after" },
    );
    if (deleted.deletedCount == 0) {
      return cannot_delete;
    } else {
      return removed;
    }
  } else {
    const deleted: any = await channelsModel.deleteOne(
      { $and: [{ name: name }, { channelAdmins: user._id }] },
      { returnDocument: "after" },
    );
    if (deleted.deletedCount == 0) {
      return cannot_delete;
    } else {
      return removed;
    }
  }
}

export async function deleteUserChannel(channelName: string) {}

export async function checkChannelType(channelName: string) {
  if (channelName.startsWith("@")) {
    return "mention";
  } else if (channelName.startsWith("#")) {
    return "keyword";
  } else if (
    channelName.startsWith("§") &&
    channelName === channelName.toLowerCase()
  ) {
    return "userchannel";
  } else if (
    channelName.startsWith("§") &&
    channelName === channelName.toUpperCase()
  ) {
    return "officialchannel";
  } else return "";
}
