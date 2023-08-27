import {
  SquealerError,
  cannot_create,
  cannot_delete,
  cannot_update,
  non_existent,
} from "../../util/errors";
import { created, removed, updated } from "../../util/success";
import { Timeout, User } from "../../util/types";
import userModel from "../models/users.model";
import fs from "fs";
import { resolve } from "path";

const publicUploadPath = resolve(__dirname, "../../..", "public");

var intervals: Array<Timeout> = [];

/**
 * Ritorna tutti gli utenti
 */
export async function getAllUsers() {
  const users: User[] | null = await userModel.find();
  if (users.length < 1) return non_existent;
  else return users;
}

/**
 * funzione che ritorna un utente
 * @param id id dell'utente
 * @returns SquealerError | User
 */
export async function getUser(id: string) {
  const user: User | null = await userModel.findOne({ _id: id });
  if (!user) return non_existent;
  else return user;
}

/**
 * funzione che ritorna un utente
 * @param username username dell'utente
 * @returns SquealerError | User
 */
export async function getUserByUsername(username: string) {
  const user: User | null = await userModel.findOne({ username: username });
  if (!user) return non_existent;
  else return user;
}

/**
 * Crea un utente tramite normali credenziali
 * @param name : nome e cognome dell'utente
 * @param username : username dell'utente
 * @param mail : mail dell'utente
 * @param password : password dell'utente (cifrata)
 */
export async function createDefaultUser(
  name: string,
  username: string,
  mail: string,
  password: string
) {
  const doc = await userModel.create({
    name: name,
    username: username,
    mail: mail,
    password: password,
    createdAt: new Date(),
    followersCount: 0,
    followingCount: 0,
  });
  if (!doc) return cannot_create;
  else return doc;
}

/**
 * Crea un account tramite login con google
 * @param name nome dell'utente
 * @param username username dell'utente
 * @param mail mail dell'utente
 * @param serviceId serviceId del profilo fornito da google
 * @param profilePicture immagine profilo fornita da google
 * @param createdAt data di creazione dell'utente
 */
export async function createUserUsingGoogle(
  name: string,
  username: string,
  mail: string,
  serviceId: number,
  profilePicture: string,
  createdAt: Date
) {
  const newUser = await userModel.create({
    name: name,
    username: username,
    mail: mail,
    serviceId: serviceId,
    profilePicture: profilePicture,
    followersCount: 0,
    followingCount: 0,
    createdAt: createdAt,
  });
  if (!newUser) return cannot_create;
  else return newUser;
}

/**
 * Aggiorna i dettagli di un utente
 * @param user oggetto contenente i dettagli di un utente
 */
export async function updateUser(username: string, user: User) {
  const oldUser: User | SquealerError = await getUserByUsername(username);
  const update = await userModel.updateOne(
    { username: username },
    {
      name: user.name,
      username: user.username,
      mail: user.mail,
    },
    { returnDocument: "after" }
  );
  if (update.modifiedCount < 1) return cannot_update;
  else {
    const newUser = await getUser((oldUser as User)._id);
    return newUser;
  }
}

/**
 * funzione che aggiorna il path all'immagine profilo dell'utente
 * @param id id dell'utente
 * @param filename nome del file
 * @returns Errore o Successo
 */
export async function updateProfilePicture(id: string, filename: string) {
  const user = await userModel.updateOne(
    { _id: id },
    { profilepicture: filename }
  );
  if (user.modifiedCount < 1) return cannot_update;
  else return updated;
}

/**
 * funzione che elimina la foto profilo dell'utente
 * @param id id dell'utente
 */
export async function deleteProfilePicture(id: string) {
  const user = await userModel.findOne({ _id: id });
  if (!user) return non_existent;
  else {
    fs.unlink(publicUploadPath + user?.profilePicture, async (err) => {
      if (err) return cannot_delete;
      else {
        await user?.updateOne(
          { profilePicture: "default.png" },
          { returnDocument: "after" }
        );
      }
    });
  }
}

/**
 * cancella l'account dell'utente
 * @param mail mail dell'utente
 * @param password password dell'utente (cifrata)
 * @param isAdmin indica se l'utente è admin o no
 * @returns SquealerError | Success
 */
export async function deleteAccount(
  mail: string,
  password: string,
  isAdmin: boolean
) {
  const profilepicture = await userModel.findOne({ mail: mail });
  fs.unlink(publicUploadPath + profilepicture?.profilePicture, (err) => {
    if (err) console.log(err);
  });
  if (isAdmin) {
    const user = await userModel.deleteOne({ mail: mail });
    if (user.deletedCount < 1) return cannot_delete;
    else return removed;
  } else {
    const user = await userModel.deleteOne({
      $and: [{ mail: mail }, { password: password }],
    });
    if (user.deletedCount < 1) return cannot_delete;
    else return removed;
  }
}

/**
 * aggiorna il reset token al valore del token generato dal server
 * @param mail mail dell'utente
 * @param token token di conferma
 */
export async function updateResetToken(mail: string, token: string) {
  const result = await userModel.updateOne(
    { mail: mail },
    { resetToken: token }
  );
  if (result.modifiedCount < 1) return cannot_update;
  else return updated;
}

/**
 * aggiorna la password di un utente e resetta il token
 * @param mail mail dell'utente
 * @param password nuova password dell'utente
 */
export async function updatePassword(mail: string, password: string) {
  const newDoc = await userModel
    .findOneAndUpdate({ mail: mail }, { password: password, resetToken: "" })
    .lean();
  if (!newDoc) return non_existent;
  else {
    if (newDoc.password !== password) return updated;
    else return cannot_update;
  }
}

/**
 * funzione che fornisce i permessi da admin ad un utente
 * @param userId {Id} id dell'utente
 * @returns SquealerError | Success
 */
export async function grantPermissions(userId: string) {
  const update = await userModel.updateOne({ _id: userId }, { plan: "admin" });
  if (update.modifiedCount < 1) return cannot_update;
  else return updated;
}

/**
 * funzione che revoca i permessi da admin ad un utente
 * @param userId {Id} id dell'utente
 * @returns SquealerError | Success
 */
export async function revokePermissions(userId: string) {
  const update = await userModel.updateOne({ _id: userId }, { plan: "base" });
  if (update.modifiedCount < 1) return cannot_update;
  else return updated;
}

//TODO test
export async function ban(id: string) {
  const update = await userModel.updateOne({ _id: id }, { status: "ban" });
  if (update.modifiedCount < 1) return cannot_update;
  else return updated;
}

//TODO test
export async function unbanUser(id: string) {
  const update = await userModel.updateOne({ _id: id }, { status: "normal" });
  if (update.modifiedCount < 1) return cannot_update;
  else return updated;
}

//TODO test
export async function blockUser(username: string, time: number) {
  const update = await userModel.updateOne(
    { username: username },
    { status: "block", blockedFor: time }
  );
  let timeout;
  if (update.modifiedCount < 1) return cannot_update;
  else {
    timeout = setTimeout(async () => {
      const update = await userModel.updateOne(
        { username: username },
        { status: "normal", blockedFor: 0 }
      );
      if (update.modifiedCount < 1) return cannot_update;
      else return updated;
    }, time);
    const newTimeout: Timeout = {
      timeout: timeout,
      username: username,
    };
    intervals.push(newTimeout);
  }
}

export async function unblockUser(username: string) {
  const update = await userModel.updateOne(
    { username: username },
    { status: "normal", blockedFor: 0 }
  );
  if (update.modifiedCount < 1) return cannot_update;
  else {
    stopTimer(username);
    return updated;
  }
}

async function findInterval(username) {
  const ret: Timeout | undefined = intervals.find(
    (el) => el.username === username
  );
  return ret?.timeout as NodeJS.Timeout;
}

async function stopTimer(username) {
  clearInterval(await findInterval(username));
  const newIntervals = intervals.filter(
    (interval) => interval.username !== username
  );
  intervals = newIntervals;
}
