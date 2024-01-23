import squealModel from "../models/squeals.model";
import { Channel, Squeal, Success, User } from "../../util/types";
import {
  cannot_create,
  cannot_delete,
  cannot_update,
  non_existent,
  not_recived,
  SquealerError,
  unauthorized,
} from "../../util/errors";
import { removed, updated } from "../../util/success";
import {
  addSquealToChannel,
  checkChannelType,
  createChannel,
} from "./channels";
import channelsModel from "../models/channels.model";
import { resolve } from "path";
import fs from "fs";
import { startTimer, stopTimer } from "../../API/timers";
import { updateDailyCharacters } from "../../API/characters";
import { createNotification } from "./notification";
import { getUserByUsername } from "./users";

const publicUploadPath = resolve(__dirname, "../..", "public/uploads/");

/**
 * funzione che ritorna tutti gli squeals non temporizzati
 */
export async function getAllSqueals(): Promise<Squeal[]> {
  const squeals: Squeal[] | null = await squealModel.find().sort({ date: -1 });
  if (squeals.length < 1) throw non_existent;
  else return squeals;
}

/**
 * funzione che ritorna tutti gli squeals postati da un utente
 * @param username username dell'utente
 */
export async function getAllUserSqueals(username: string): Promise<Squeal[]> {
  const squeals: Squeal[] | null = await squealModel
    .find({ author: username })
    .sort({ date: -1 });
  if (!squeals) throw non_existent;
  else return squeals;
}

/**
 * funzione che ritorna tutti gli squeals temporizzati
 */
export async function getAllTimedSqueals(): Promise<Squeal[]> {
  const squeals: Squeal[] | null = await squealModel
    .find({
      time: { $gt: 0 },
    })
    .sort({ date: -1 });
  if (!squeals) throw non_existent;
  else return squeals;
}

/**
 * funzione che ritorna tutti gli squeals temporizzati
 */
export async function getAllMediaSqueals(): Promise<Squeal[]> {
  const squeals: Squeal[] | null = await squealModel
    .find({
      type: "media",
    })
    .sort({ date: -1 });
  if (!squeals) throw non_existent;
  else return squeals;
}

/**
 * funzione che ritorna tutti i text squeal
 * @returns error o gli squeal text
 */
export async function getTextSqueals() {
  const squeals: Squeal[] | null = await squealModel
    .find({ type: "text" })
    .sort({ date: -1 });

  if (!squeals) throw non_existent;
  else return squeals;
}

/**
 * funzione che ritorna tutti i text squeal
 * @returns error o gli squeal text
 */
export async function getAllGeoSqueals() {
  const squeals: Squeal[] | null = await squealModel
    .find({ type: "geo" })
    .sort({ date: -1 });

  if (!squeals) throw non_existent;
  else return squeals;
}

/**
 * funzione che ritorna tutti gli squeals automatici
 * @returns Squeal[] | non_existent
 */
export async function getAutoSqueals() {
  const squeals: Squeal[] | null = await squealModel
    .find({ type: "auto" })
    .sort({ date: -1 });

  if (!squeals) throw non_existent;
  else return squeals;
}
/**
 * funzione che ritorna uno squeal tramite id
 * @param id id dello squeal
 * @returns non_existent | Squeal
 */
export async function getSquealById(id: string) {
  const squeal: Squeal | null = await squealModel.findOne({ _id: id });
  if (!squeal) throw non_existent;
  else return squeal;
}

/**
 * funzione che ritorna uno squeal di testo
 * @param id id dello squeal
 * @returns non_existent | Squeal
 */
export async function getTextSqueal(id: string) {
  const squeal: Squeal | null = await squealModel.findOne({
    $and: [{ _id: id, type: "text" }],
  });
  if (!squeal) throw non_existent;
  else return squeal;
}

/**
 * funzione che ritorna uno squeal temporizzato
 * @param id id dello squeal
 * @returns non_existent | Squeal
 */
export async function getTimedSqueal(id: string) {
  const squeal: Squeal | null = await squealModel.findOne({
    $and: [{ _id: id }, { time: { $gt: 0 } }],
  });
  if (!squeal) throw non_existent;
  else return squeal;
}

/**
 * funzione che ritorna uno squeal automatico
 * @param id id dello squeal
 * @returns non_existent | Squeal
 */
export async function getAutoSqueal(id: string) {
  const squeal: Squeal | null = await squealModel.findOne({
    $and: [{ _id: id, type: "auto" }],
  });
  if (!squeal) throw non_existent;
  else return squeal;
}

/**
 * funzione che ritorna uno squeal geo
 * @param id id dello squeal
 * @returns non_existent | Squeal
 */
export async function getGeoSqueal(id: string) {
  const squeal: Squeal | null = await squealModel.findOne({
    $and: [{ _id: id, type: "geo" }],
  });
  if (!squeal) throw non_existent;
  else return squeal;
}

/**
 * funzione che ritorna uno squeal media
 * @param id id dello squeal
 * @returns non_existent | Squeal
 */
export async function getMediaSqueal(id: string) {
  const squeal: Squeal | null = await squealModel.findOne({
    $and: [{ _id: id, type: "media" }],
  });
  if (!squeal) throw non_existent;
  else return squeal;
}

export async function postResponse(
  squeal: Squeal,
  originalSquealId: string,
  user: User,
) {
  const newSqueal: Squeal | undefined = await postSqueal(squeal, user);
  if (!newSqueal) throw cannot_create;
  await squealModel.updateOne(
    { _id: originalSquealId },
    { $push: { responses: newSqueal._id } },
  );
  await squealModel.updateOne(
    {
      _id: newSqueal._id,
    },
    {
      originalSqueal: originalSquealId,
    },
  );
  return newSqueal;
}

/**
 * crea un nuovo squeal (non automatizzato)
 * @param squeal oggetto contenente i parametri dello squeal
 * @param user utente che posta lo squeal
 * @returns eventuali errori
 */
export async function postSqueal(squeal: Squeal, user: User) {
  try {
    console.log(squeal);
    const channels: null | Channel[] = await channelsModel.find({
      name: { $in: squeal.channels },
    });
    let rec: string[] = [];
    if (!(channels.length > 0)) {
      for (let i of squeal.channels) {
        await createChannel(i.substring(1), await checkChannelType(i), user);
      }
    }
    if (squeal.recipients && squeal.recipients.length > 0) {
      for (let i of squeal.recipients) {
        rec.push(i.replace(" ", ""));
      }
    }
    let newSqueal: Squeal | null;
    if (squeal.body && user.dailyCharacters >= squeal.body.length) {
      newSqueal = await squealModel.create({
        body: squeal.body,
        lat: squeal.lat,
        lng: squeal.lng,
        locationName: squeal.locationName,
        recipients: rec,
        date: new Date(),
        category: squeal.category,
        channels: squeal.channels,
        author: user.username,
        type: squeal.type,
        time: squeal.time ? squeal.time * 1000 * 60 : squeal.time,
        positiveReactions: [],
        negativeReactions: [],
        originalSqueal: squeal.originalSqueal,
      });
      const characters: SquealerError | Success = await updateDailyCharacters(
        user._id,
        newSqueal.body!.length,
      );
      if (characters instanceof SquealerError) {
        await squealModel.deleteOne({ _id: newSqueal._id });
        throw cannot_update;
      }
    } else if (
      !squeal.body &&
      (squeal.type === "media" || squeal.type === "geo") &&
      user.dailyCharacters >= 125
    ) {
      newSqueal = await squealModel.create({
        body: squeal.body,
        lat: squeal.lat,
        lng: squeal.lng,
        locationName: squeal.locationName,
        recipients: rec,
        date: new Date(),
        category: squeal.category,
        channels: squeal.channels,
        author: user.username,
        type: squeal.type,
        time: squeal.time ? squeal.time * 1000 * 60 : squeal.time,
        positiveReactions: [],
        negativeReactions: [],
        originalSqueal: squeal.originalSqueal,
      });
      const characters: SquealerError | Success = await updateDailyCharacters(
        user._id,
        125,
      );
      if (characters instanceof SquealerError) {
        await squealModel.deleteOne({ _id: newSqueal._id });
        throw cannot_update;
      }
    } else throw cannot_create;

    if (newSqueal.channels.length > 0) {
      for (let i of newSqueal.channels) {
        for (let j of channels) {
          if (i === j.name) {
            const id: string = newSqueal._id;
            await addSquealToChannel(j.name, id, user);
          }
        }
      }
    }
    if (newSqueal.recipients && newSqueal.recipients.length > 0) {
      for (let i of newSqueal.recipients) {
        await createNotification(
          i.includes("@")
            ? `You have a new message from ${newSqueal.author}`
            : `A new message has been posted by ${newSqueal.author} in channel ${i}`,
          i,
        );
      }
    }
    return newSqueal;
  } catch (e) {
    console.log(e);
  }
}

/**
 * funzione che cancella uno squeal
 * @param id id dello squeal
 * @returns errori eventuali
 */
export async function deleteSqueal(id: string) {
  const squeal: Squeal = await getSquealById(id);
  if (squeal.type === "media") {
    const result: Success = await deleteMediaSqueal(squeal);
    return result;
  } else if (squeal.type === "timed") {
    const result: Success = await deleteTimedSqueal(squeal);
    return result;
  } else {
    const deleted: any = await squealModel.deleteOne({ _id: id });
    if (deleted.deletedCount < 1) throw cannot_delete;
    else return removed;
  }
}

/**
 * funzione che cancella uno squeal
 * @param squeal squeal da eliminare
 * @returns errori eventuali
 */
export async function deleteMediaSqueal(squeal: Squeal) {
  if (squeal.body) {
    fs.unlink(resolve(publicUploadPath, squeal.body), (err) => {
      if (err) {
        throw cannot_delete;
      }
    });
    const deleted = await squealModel.deleteOne({ _id: squeal._id });
    if (deleted.deletedCount < 1) throw cannot_delete;
    else return removed;
  } else throw not_recived;
}

/**
 * funzione che cancella uno squeal temporizzato
 * @param squeal squeal da eliminare
 */
export async function deleteTimedSqueal(squeal: Squeal) {
  const timedSqueal: Squeal | null = await squealModel.findOne({
    _id: squeal._id,
  });

  if (!timedSqueal) {
    throw non_existent;
  } else {
    await stopTimer(squeal);
    const deleted = await squealModel.deleteOne({ _id: squeal._id });
    if (deleted.deletedCount < 1) throw cannot_delete;
    else return removed;
  }
}

/**
 * funzione che fa arresta uno squeal temporizzato
 * @param squeal  squeal da arrestare
 */
export async function stopTimedSqueal(squeal: Squeal) {
  const timedSqueal: Squeal = await getTimedSqueal(squeal._id);
  await stopTimer(timedSqueal);
}

/**
 * funzione che fa ripartire uno squeal temporizzato
 * @param squeal  squeal da far ripartire
 */
export async function restartTimedSqueal(squeal: Squeal) {
  const timedSqueal: Squeal = await getTimedSqueal(squeal._id);
  return await startTimer(timedSqueal);
}

/**
 * funzione che ritorna tutti gli squeal appartenenti a certi destinatari
 * @param recipient destinatario da ricercare
 * @returns squeals appartenenti ai destinatari scelti
 */
export async function getSquealsByRecipients(recipient: string) {
  const squeals: Squeal[] = await squealModel.find({
    recipients: recipient,
  });
  return squeals;
}

/**
 * funzione che ritorna tutti gli squeal appartenenti ad un certo canale
 * @param channel canale da ricercare
 * @returns squeals appartenenti al canale scelto
 */
export async function getSquealsByChannel(channel: string) {
  const squeals: Squeal[] = await squealModel.find({
    channels: channel,
  });
  return squeals;
}

export async function editReaction(
  squealId: string,
  positiveReactions: number,
  negativeReactions: number,
) {
  const update = await squealModel.updateOne(
    { _id: squealId },
    {
      positveReactions: positiveReactions,
      negativeReactions: negativeReactions,
    },
  );
  if (update.modifiedCount < 1) throw cannot_update;
  else return updated;
}

export async function addPositiveReaction(
  squealId: string,
  userId?: string,
): Promise<Success> {
  const squeal: Squeal = await getSquealById(squealId);
  if (!userId) {
    const update = await squealModel.updateOne(
      { _id: squealId },
      {
        $push: { positiveReactions: "guest" },
      },
    );
    if (update.modifiedCount < 1) throw cannot_update;
    else return updated;
  } else if (squeal.negativeReactions?.includes(userId)) {
    const update = await squealModel.updateOne(
      { _id: squealId },
      {
        $pull: { negativeReactions: userId },
        $push: { positiveReactions: userId },
      },
    );
    if (update.modifiedCount < 1) throw cannot_update;
    else return updated;
  } else if (!squeal.positiveReactions?.includes(userId)) {
    const update = await squealModel.updateOne(
      { _id: squealId },
      {
        $push: { positiveReactions: userId },
      },
    );
    if (update.modifiedCount < 1) throw cannot_update;
    else return updated;
  } else throw cannot_update;
}

export async function addNegativeReaction(squealId: string, userId?: string) {
  const squeal: Squeal = await getSquealById(squealId);
  if (!userId) {
    const update = await squealModel.updateOne(
      { _id: squealId },
      {
        $push: { negativeReactions: "guest" },
      },
    );
    if (update.modifiedCount < 1) throw cannot_update;
    else return updated;
  } else if (squeal.positiveReactions?.includes(userId)) {
    const update = await squealModel.updateOne(
      { _id: squealId },
      {
        $push: { negativeReactions: userId },
        $pull: { positiveReactions: userId },
      },
    );
    if (update.modifiedCount < 1) throw cannot_update;
    else return updated;
  } else if (!squeal.negativeReactions?.includes(userId)) {
    const update = await squealModel.updateOne(
      { _id: squealId },
      {
        $push: { negativeReactions: userId },
      },
    );
    if (update.modifiedCount < 1) throw cannot_update;
    else return updated;
  } else throw cannot_update;
}

export async function updateSquealsUsername(
  oldUsername: string,
  username: string,
): Promise<Success> {
  const update = await squealModel.updateMany(
    { author: oldUsername },
    { author: username },
  );
  if (update.modifiedCount > 0) return updated;
  else throw cannot_update;
}

/**
 * funzione che permette ad un smm di pubblicare uno squeal a nome di un altro utente
 * @param username username dell'account gestito
 * @param smm id del smm
 * @param squeal squeal da pubblicare
 * @returns Squeal | non_existent
 */
export async function postSquealAsUser(
  username: string,
  smm: string,
  squeal: Squeal,
) {
  const user: User = await getUserByUsername(username);
  if (user.SMM == smm) {
    const newSqueal: Squeal | undefined = await postSqueal(squeal, user);
    if (!newSqueal) throw cannot_create;
    return newSqueal;
  } else throw unauthorized;
}

export async function getSquealResponses(id: string) {
  const originalSqueal: Squeal = await getSquealById(id);
  let responses: Squeal[] = [];
  if (originalSqueal.responses) {
    for (let i of originalSqueal.responses) {
      const squeal: Squeal = await getSquealById(i);
      responses.push(squeal);
    }
  }
  return responses;
}

export async function updateSquealRecipients(
  squealId: string,
  recipients: string[],
) {
  const update = await squealModel.updateOne(
    { _id: squealId },
    { recipients: recipients },
  );
  if (update.modifiedCount < 1) {
    throw cannot_update;
  } else return updated;
}

export const getSquealsBySenderAsc = async () => {
  const squeals: Squeal[] = await squealModel.find({}).sort({ author: 1 });
  return squeals;
};
export const getSquealsBySenderDesc = async () => {
  const squeals: Squeal[] = await squealModel.find({}).sort({ author: -1 });
  return squeals;
};
export const getSquealsByDateAsc = async () => {
  const squeals: Squeal[] = await squealModel.find({}).sort({ date: 1 });
  return squeals;
};
export const getSquealsByDateDesc = async () => {
  const squeals: Squeal[] = await squealModel.find({}).sort({ date: -1 });
  return squeals;
};
export const getSquealsByRecipientsAsc = async () => {
  const squeals: Squeal[] = await squealModel.find({}).sort({ recipients: 1 });
  return squeals;
};
export const getSquealsByRecipientsDesc = async () => {
  const squeals: Squeal[] = await squealModel.find({}).sort({ recipients: -1 });
  return squeals;
};
