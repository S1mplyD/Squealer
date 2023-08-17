import {
  cannot_create,
  cannot_delete,
  cannot_update,
  non_existent,
} from "../../util/errors";
import { created, removed, updated } from "../../util/success";
import { Id, User } from "../../util/types";
import userModel from "../models/users.model";
import fs from "fs";
import { resolve } from "path";

const publicUploadPath = resolve(__dirname, "../../..", "public");

/**
 * Ritorna tutti gli utenti
 */
export async function getAllUsers() {
  try {
    const users: User[] | null = await userModel.find();
    if (users.length < 1) return non_existent;
    else return users;
  } catch (error: any) {
    console.log({ errorName: error.name, errorDescription: error.message });
  }
}

/**
 * funzione che ritorna un utente
 * @param id id dell'utente
 * @returns Error | User
 */
export async function getUser(id: Id) {
  const user: User | null = await userModel.findOne({ _id: id });
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
//TODO add created at and followers fields
export async function createDefaultUser(
  name: string,
  username: string,
  mail: string,
  password: string
) {
  try {
    const doc = await userModel.create({
      name: name,
      username: username,
      mail: mail,
      password: password,
    });
    if (!doc) return cannot_create;
    else return doc;
  } catch (error: any) {
    console.log({ errorName: error.name, errorDescription: error.message });
  }
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
  try {
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
  } catch (error: any) {
    console.log({ errorName: error.name, errorDescription: error.message });
  }
}

/**
 * Aggiorna i dettagli di un utente
 * @param user oggetto contenente i dettagli di un utente
 */
//TODO aggiungere campi aggiornabili
export async function updateUser(id: Id, user: User) {
  const update = await userModel.updateOne(
    { _id: user._id },
    {
      name: user.name,
      username: user.username,
    }
  );
  if (update.modifiedCount < 1) return cannot_update;
  else {
    return updated;
  }
}

//TODO update password

/**
 * funzione che aggiorna il path all'immagine profilo dell'utente
 * @param id id dell'utente
 * @param filename nome del file
 * @returns Errore o Successo
 */
export async function updateProfilePicture(id: string, filename: string) {
  try {
    const user = await userModel.updateOne(
      { _id: id },
      { profilepicture: filename }
    );
    if (user.modifiedCount < 1) return cannot_update;
    else return updated;
  } catch (error: any) {
    console.log({ errorName: error.name, errorDescription: error.message });
  }
}

/**
 * funzione che elimina la foto profilo dell'utente
 * @param id id dell'utente
 */
export async function deleteProfilePicture(id: string) {
  try {
    const user = await userModel.findById({ _id: id });
    fs.unlink(publicUploadPath + user?.profilePicture, async (err) => {
      if (err) return cannot_delete;
      else {
        const result = await user?.updateOne(
          { profilePicture: "default.png" },
          { returnDocument: "after" }
        );
        console.log(result);
      }
    });
  } catch (error: any) {
    console.log({ errorName: error.name, errorDescription: error.message });
  }
}

/**
 * cancella l'account dell'utente
 * @param mail mail dell'utente
 * @param password password dell'utente (cifrata)
 */
export async function deleteAccount(
  mail: string,
  password: string,
  isAdmin: boolean
) {
  try {
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
  } catch (error: any) {
    console.log({ errorName: error.name, errorDescription: error.message });
  }
}

/**
 * aggiorna il reset token al valore del token generato dal server
 * @param mail mail dell'utente
 * @param token token di conferma
 */
export async function updateResetToken(mail: string, token: string) {
  try {
    const result = await userModel.updateOne(
      { mail: mail },
      { resetToken: token }
    );
    if (result.modifiedCount < 1) return cannot_update;
    else return updated;
  } catch (error: any) {
    console.log({ errorName: error.name, errorDescription: error.message });
  }
}

/**
 * aggiorna la password di un utente e resetta il token
 * @param mail mail dell'utente
 * @param password nuova password dell'utente
 */
export async function updatePassword(mail: string, password: string) {
  try {
    const newDoc = await userModel
      .findOneAndUpdate({ mail: mail }, { password: password, resetToken: "" })
      .lean();
    if (!newDoc) return non_existent;
    else {
      if (newDoc.password !== password) return updated;
      else return cannot_update;
    }
  } catch (error: any) {
    console.log({ errorName: error.name, errorDescription: error.message });
  }
}

/**
 * funzione che fornisce i permessi da admin ad un utente
 * @param userId {Id} id dell'utente
 * @returns Error | Success
 */
export async function grantPermissions(userId: Id) {
  const update = await userModel.updateOne({ _id: userId }, { plan: "admin" });
  if (update.modifiedCount < 1) return cannot_update;
  else return updated;
}

/**
 * funzione che revoca i permessi da admin ad un utente
 * @param userId {Id} id dell'utente
 * @returns Error | Success
 */
export async function revokePermissions(userId: Id) {
  const update = await userModel.updateOne({ _id: userId }, { plan: "base" });
  if (update.modifiedCount < 1) return cannot_update;
  else return updated;
}

//TODO test
export async function ban(id: Id) {
  const update = await userModel.updateOne({ _id: id }, { status: "ban" });
  if (update.modifiedCount < 1) return cannot_update;
  else return updated;
}

//TODO test
export async function b1ock(id: Id, time: number) {
  const update = await userModel.updateOne(
    { _id: id },
    { status: "block", blockedFor: time }
  );
  if (update.modifiedCount < 1) return cannot_update;
  else {
    setTimeout(async () => {
      const update = await userModel.updateOne(
        { _id: id },
        { status: "normal", blockedFor: 0 }
      );
      if (update.modifiedCount < 1) return cannot_update;
      else return updated;
    }, time);
  }
}
