import squealModel from "../models/squeals.model";
import { Squeal, Success, User, Channel } from "../../util/types";
import {
  non_existent,
  cannot_create,
  cannot_delete,
  SquealerError,
  cannot_update,
} from "../../util/errors";
import { removed, updated } from "../../util/success";
import { addSquealToChannel } from "./channels";
import channelsModel from "../models/channels.model";
import { resolve } from "path";
import fs from "fs";
import { startTimer, stopTimer } from "../../API/timers";
import { updateDailyCharacters } from "../../API/characters";
import { createNotification } from "./notification";

const publicUploadPath = resolve(__dirname, "../..", "public/uploads/");

/**
 * funzione che ritorna tutti gli squeals non temporizzati
 * @returns Squeal[] | non_existent
 */
export async function getAllSqueals() {
  const squeals: Squeal[] | null = await squealModel.find().sort({ date: -1 });
  if (squeals.length < 1) return non_existent;
  else return squeals;
}

/**
 * funzione che ritorna tutti gli squeals postati da un utente
 * @param username username dell'utente
 * @returns Squeal [] | non_existent
 */
export async function getAllUserSqueals(username: string) {
  const squeals: Squeal[] | null = await squealModel
    .find({ author: username })
    .sort({ date: -1 });
  if (!squeals) return non_existent;
  else return squeals;
}

/**
 * funzione che ritorna tutti gli squeals temporizzati
 * @returns non_existent | TimedSqueal []
 */
export async function getAllTimedSqueals() {
  const squeals: Squeal[] | null = await squealModel
    .find({
      type: "timed",
    })
    .sort({ date: -1 });
  if (!squeals) return non_existent;
  else return squeals;
}

/**
 * funzione che ritorna tutti gli squeals temporizzati
 * @returns non_existent | TimedSqueal []
 */
export async function getAllMediaSqueals() {
  const squeals: Squeal[] | null = await squealModel
    .find({
      type: "media",
    })
    .sort({ date: -1 });
  if (!squeals) return non_existent;
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

  if (!squeals) return non_existent;
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

  if (!squeals) return non_existent;
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

  if (!squeals) return non_existent;
  else return squeals;
}
/**
 * funzione che ritorna uno squeal tramite id
 * @param id id dello squeal
 * @returns non_existent | Squeal
 */
export async function getSquealById(id: string) {
  const squeal: Squeal | null = await squealModel.findOne({ _id: id });
  if (!squeal) return non_existent;
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
  if (!squeal) return non_existent;
  else return squeal;
}

/**
 * funzione che ritorna uno squeal temporizzato
 * @param id id dello squeal
 * @returns non_existent | Squeal
 */
export async function getTimedSqueal(id: string) {
  const squeal: Squeal | null = await squealModel.findOne({
    $and: [{ _id: id }, { type: "timed" }],
  });
  if (!squeal) return non_existent;
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
  if (!squeal) return non_existent;
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
  if (!squeal) return non_existent;
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
  if (!squeal) return non_existent;
  else return squeal;
}

/**
 * crea un nuovo squeal (non automatizzato)
 * @param squeal oggetto contenente i parametri dello squeal
 * @returns eventuali errori
 */
export async function postSqueal(squeal: Squeal, user: User) {
  const channels: SquealerError | Channel[] = await channelsModel.find({
    name: { $in: squeal.channels },
  });
  if (channels instanceof SquealerError) return channels;
  let rec: string[] = [];
  if (squeal.recipients.length > 0) {
    for (let i of squeal.recipients) {
      rec.push(i.replace(" ", ""));
    }
  }
  const newSqueal: Squeal | null = await squealModel.create({
    body: squeal.body,
    lat: squeal.lat,
    lng: squeal.lng,
    recipients: rec,
    date: new Date(),
    category: squeal.category,
    channels: squeal.channels,
    author: user.username,
    type: squeal.type,
    time: squeal.time,
    positiveReactions: [],
    negativeReactions: [],
  });

  if (!newSqueal) return cannot_create;
  else {
    if (newSqueal.type === "media") {
      const characters: SquealerError | Success = await updateDailyCharacters(
        user._id,
        125,
      );
      if (characters instanceof SquealerError) {
        await squealModel.deleteOne({ _id: newSqueal._id });
        return cannot_update;
      }
    } else {
      const characters: SquealerError | Success = await updateDailyCharacters(
        user._id,
        newSqueal.body.length,
      );
      if (characters instanceof SquealerError) {
        await squealModel.deleteOne({ _id: newSqueal._id });
        return cannot_update;
      }
    }
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
    if (newSqueal.recipients.length > 0) {
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
  }
}

/**
 * funzione che cancella uno squeal
 * @param id id dello squeal
 * @returns errori eventuali
 */
export async function deleteSqueal(id: string) {
  const squeal: Squeal | SquealerError = await getSquealById(id);
  if (squeal instanceof SquealerError) return non_existent;
  if (squeal.type === "media") {
    const result: SquealerError | Success = await deleteMediaSqueal(squeal);
    return result;
  } else if (squeal.type === "timed") {
    const result: SquealerError | Success = await deleteTimedSqueal(squeal);
    return result;
  } else {
    const deleted: any = await squealModel.deleteOne({ _id: id });
    if (deleted.deletedCount < 1) return cannot_delete;
    else return removed;
  }
}

/**
 * funzione che cancella uno squeal
 * @param id id dello squeal
 * @returns errori eventuali
 */
export async function deleteMediaSqueal(squeal: Squeal) {
  const file = squeal.body;
  fs.unlink(resolve(publicUploadPath, file), (err) => {
    if (err) {
      return cannot_delete;
    }
  });
  const deleted: any = await squealModel.deleteOne({ _id: squeal._id });
  if (deleted.deletedCount < 1) return cannot_delete;
  else return removed;
}

/**
 * funzione che cancella uno squeal temporizzato
 * @param id id dello squeal temporizzato
 */
export async function deleteTimedSqueal(squeal: Squeal) {
  const timedSqueal: Squeal | null = await squealModel.findOne({
    _id: squeal._id,
  });

  if (!timedSqueal) {
    return non_existent;
  } else {
    await stopTimer(squeal);
    const deleted = await squealModel.deleteOne({ _id: squeal._id });
    if (deleted.deletedCount < 1) return cannot_delete;
    else return removed;
  }
}

/**
 * funzione che fa arresta uno squeal temporizzato
 * @param squeal  squeal da arrestare
 */
export async function stopTimedSqueal(squeal: Squeal) {
  const timedSqueal: Squeal | SquealerError = await getTimedSqueal(squeal._id);
  if (!(timedSqueal instanceof SquealerError)) {
    await stopTimer(timedSqueal);
  }
}

/**
 * funzione che fa ripartire uno squeal temporizzato
 * @param squeal  squeal da far ripartire
 */
export async function restartTimedSqueal(squeal: Squeal) {
  const timedSqueal: Squeal | SquealerError = await getTimedSqueal(squeal._id);
  if (!(timedSqueal instanceof SquealerError)) {
    const ret = await startTimer(timedSqueal);
    return ret;
  }
}

/**
 * funzione che ritorna tutti gli squeal appartenenti a certi destinatari
 * @param recipients destinatari da ricercare
 * @returns squeals appartenenti ai destinatari scelti
 */
export async function getSquealsByRecipients(recipient: string) {
  const squeals: Squeal[] | SquealerError = await squealModel.find({
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
  const squeals: Squeal[] | SquealerError = await squealModel.find({
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
  if (update.modifiedCount < 1) return cannot_update;
  else return updated;
}

export async function addPositiveReaction(squealId: string, userId?: string) {
  const squeal: Squeal | SquealerError = await getSquealById(squealId);
  if (userId === undefined) {
    const update = await squealModel.updateOne(
      { _id: squealId },
      {
        $push: { positiveReactions: "guest" },
      },
    );
    if (update.modifiedCount < 1) return cannot_update;
    else return updated;
  } else if (
    !(squeal instanceof SquealerError) &&
    squeal.negativeReactions?.includes(userId!)
  ) {
    const update = await squealModel.updateOne(
      { _id: squealId },
      {
        $pull: { negativeReactions: userId },
        $push: { positiveReactions: userId },
      },
    );
    if (update.modifiedCount < 1) return cannot_update;
    else return updated;
  } else {
    if (
      !(squeal instanceof SquealerError) &&
      !squeal.positiveReactions?.includes(userId)
    ) {
      const update = await squealModel.updateOne(
        { _id: squealId },
        {
          $push: { positiveReactions: userId },
        },
      );
      if (update.modifiedCount < 1) return cannot_update;
      else return updated;
    }
  }
}

export async function addNegativeReaction(squealId: string, userId?: string) {
  const squeal: Squeal | SquealerError = await getSquealById(squealId);
  if (userId === undefined) {
    const update = await squealModel.updateOne(
      { _id: squealId },
      {
        $push: { negativeReactions: "guest" },
      },
    );
    if (update.modifiedCount < 1) return cannot_update;
    else return updated;
  } else if (
    !(squeal instanceof SquealerError) &&
    squeal.positiveReactions?.includes(userId)
  ) {
    const update = await squealModel.updateOne(
      { _id: squealId },
      {
        $push: { negativeReactions: userId },
        $pull: { positiveReactions: userId },
      },
    );
    if (update.modifiedCount < 1) return cannot_update;
    else return updated;
  } else {
    if (
      !(squeal instanceof SquealerError) &&
      !squeal.negativeReactions?.includes(userId)
    ) {
      const update = await squealModel.updateOne(
        { _id: squealId },
        {
          $push: { negativeReactions: userId },
        },
      );
      if (update.modifiedCount < 1) return cannot_update;
      else return updated;
    }
  }
}

export async function updateSquealsUsername(
  oldUsername: string,
  username: string,
): Promise<Success | SquealerError> {
  const update = await squealModel.updateMany(
    { author: oldUsername },
    { author: username },
  );
  if (update.modifiedCount > 0) return updated;
  else return cannot_update;
}
