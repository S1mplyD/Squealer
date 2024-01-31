import {
    cannot_create,
    cannot_delete,
    cannot_update,
    non_existent,
    not_valid,
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
        throw non_existent;
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
    if (!channel) throw non_existent;
    else return channel;
}

export async function getSubscribedChannels(user: User) {
    const channels: Channel[] = await getAllChannels();
    let subscribedChannels: Channel[] = [];
    for (let i of channels) {
        if (i.allowedRead.includes(user._id)) {
            subscribedChannels.push(i);
        }
    }
    return subscribedChannels;
}

/**
 * funzione che ritorna tutti gli userchannel
 * @returns Channel[] | SquealerError
 */
export async function getAllUserChannel(user: User) {
    const userChannels: Channel[] | null = await channelsModel.find({
        type: "userchannel",
    });
    if (!userChannels) throw non_existent;
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
    if (!channels) throw non_existent;
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
    if (!channels) throw non_existent;
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
    if (!channels) throw non_existent;
    else return channels;
}

/**
 * funzione che ritorna tutti gli squeal appartenenti ad un canale
 * @param channelName nome del canale
 * @param userId id utente
 * @returns SquealerError | (Squeal | SquealGeo | SquealMedia
      | TimedSqueal
      | TimedSquealGeo
    )[]
 */
export async function getAllSquealsFromChannel(
    channelName: string,
    userId: string,
) {
    const channel: Channel = await getChannel(channelName);
    if (channel.allowedRead.includes(userId)) {
        let squeals: Squeal[] = [];
        for (let i of channel.squeals) {
            const squeal: Squeal = await getSquealById(i);
            squeals.push(squeal);
        }
        return squeals;
    } else throw unauthorized;
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
        if (!newChannel) throw new Error("Cannot create Channel");
        else return created;
    } else if (type === "officialchannel" && user.plan === "admin") {
        const newChannel = await channelsModel.create({
            name: channelName.toUpperCase(),
            type: type,
            channelAdmins: user._id,
            allowedRead: user._id,
            allowedWrite: user._id,
        });
        if (!newChannel) throw new Error("Cannot create Channel");
        else return created;
    } else {
        const newChannel = await channelsModel.create({
            name: channelName,
            type: type,
            channelAdmins: user._id,
            allowedRead: user._id,
            allowedWrite: user._id,
        });
        if (!newChannel) throw new Error("Cannot create Channel");
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
    const user: User = await getUserByUsername(username);
    const userId = user._id;
    const update = await channelsModel.updateOne(
        { name: channelName, type: "userchannel" },
        { $push: { allowedRead: userId, allowedWrite: userId } },
    );
    if (update.modifiedCount < 1) throw cannot_update;
    else return updated;
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
    const user: User = await getUserByUsername(username);
    const userId = user._id;
    const update = await channelsModel.updateOne(
        { name: channelName },
        { $pop: { allowedRead: userId, allowedWrite: userId } },
    );
    if (update.modifiedCount < 1) throw cannot_update;
    else return updated;
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
    else throw cannot_update;
}

export async function updateOfficialSqueals(name: string, squeals: string[]) {
    const update: UpdateWriteOpResult = await channelsModel.updateOne(
        { name: name },
        { squeals: squeals },
    );
    if (update.modifiedCount > 0) return updated;
    else throw cannot_update;
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
    if (update.modifiedCount < 1) throw cannot_update;
    else return updated;
}

// TODO eseguire dopo grantPermission
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
    if (update.modifiedCount < 1) throw cannot_update;
    else return updated;
}

//TODO funzione equivalente a quella sopra per rimuovere un utente dagli admin degli official channels
export async function removeAdminToOfficialChannel(
    adminId: string,
    channelName: string,
) { }
export async function checkChannel(
    channelName: string,
): Promise<Channel | null> {
    return channelsModel.findOne({
        name: channelName,
    });
}

/**
 * funzione che aggiunge uno squeal ad un canale
 * @param channelName nome del canale
 * @param squealId id dello squeal da aggiungere al canale
 * @param user utente
 * @returns SquealerError | Success
 */
export async function addSquealToChannel(
    channelName: string,
    squealId: string,
    user: User,
) {
    const channel: Channel = await getChannel(channelName);
    if (!(await checkChannel(channelName))) {
        const squeal: Squeal = await getSquealById(squealId);
        //Se il canale non esiste ma è una keyword creo il canale e poi aggiungo lo squeal
        for (let i of squeal.channels) {
            if (i.includes("#")) {
                await createChannel(i, "keyword", user);
                await addSquealToChannel(i, squeal._id, user);
            } else throw cannot_create;
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
            if (update.modifiedCount < 1) throw cannot_update;
            else return updated;
        } else {
            const update = await channelsModel.updateOne(
                { name: channelName },
                { $push: { squeals: squealId } },
            );
            if (update.modifiedCount < 1) throw cannot_update;
            else return updated;
        }
    }
}

/**
 * funzione che elimina un canale
 * utilizzata in /api/channels dagli admin
 * @param name nome del canale
 * @param user utente
 * @returns SquealerError | Success
 */
export async function deleteChannel(name: string, user: User) {
    if (user.plan === "admin") {
        const deleted: any = await channelsModel.deleteOne(
            { name: name },
            { returnDocument: "after" },
        );
        if (deleted.deletedCount == 0) {
            throw cannot_delete;
        } else {
            return removed;
        }
    } else {
        const deleted: any = await channelsModel.deleteOne(
            { $and: [{ name: name }, { channelAdmins: user._id }] },
            { returnDocument: "after" },
        );
        if (deleted.deletedCount == 0) {
            throw cannot_delete;
        } else {
            return removed;
        }
    }
}

// TODO ?
export async function deleteUserChannel(channelName: string) { }

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
    } else throw not_valid;
}
