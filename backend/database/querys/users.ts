import {
  Error,
  ErrorCodes,
  ErrorDescriptions,
  cannot_create,
  cannot_delete,
  cannot_update,
  non_existent,
} from "../../util/errors";
import {
  Success,
  SuccessCode,
  SuccessDescription,
  created,
  removed,
  updated,
} from "../../util/success";
import { User } from "../../util/types";
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
 */
export async function createUserUsingGoogle(
  name: string,
  username: string,
  mail: string,
  serviceId: number,
  profilePicture: string
) {
  try {
    await userModel
      .create({
        name: name,
        username: username,
        mail: mail,
        serviceId: serviceId,
        profilePicture: profilePicture,
      })
      .then((doc) => {
        if (!doc) return cannot_create;
        else return created;
      });
  } catch (error: any) {
    console.log({ errorName: error.name, errorDescription: error.message });
  }
}

/**
 * Aggiorna i dettagli di un utente
 * @param user oggetto contenente i dettagli di un utente
 */
export async function updateUser(user: User) {
  try {
    await userModel
      .findByIdAndUpdate(user._id, user, {
        returnDocument: "after",
      })
      .then((doc) => {
        if (!doc) return non_existent;
        else {
          return updated;
        }
      });
  } catch (error: any) {
    console.log({ errorName: error.name, errorDescription: error.message });
  }
}

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
export async function deleteAccount(mail: string, password: string) {
  try {
    const profilepicture = await userModel.findOne({ mail: mail });
    fs.unlink(publicUploadPath + profilepicture?.profilePicture, (err) => {
      if (err) console.log(err);
    });
    const user = await userModel.deleteOne({
      $and: [{ mail: mail }, { password: password }],
    });
    if (user.deletedCount < 1) return cannot_delete;
    else return removed;
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
