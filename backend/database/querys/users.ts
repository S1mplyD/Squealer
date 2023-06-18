import { Error, ErrorCodes, ErrorDescriptions } from "../../util/errors";
import { Success, SuccessCode, SuccessDescription } from "../../util/success";
import { User } from "../../util/types";
import userModel from "../models/users.model";

/**
 * Ritorna tutti gli utenti
 */
export async function getAllUsers() {
  try {
    const users: any = await userModel.find();
    if (users.length < 1)
      return new Error(ErrorDescriptions.non_existent, ErrorCodes.non_existent);
    else return users;
  } catch (error) {
    console.log(error);
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
    await userModel
      .create({
        name: name,
        username: username,
        mail: mail,
        password: password,
      })
      .then((doc) => {
        if (!doc)
          return new Error(
            ErrorDescriptions.cannot_create,
            ErrorCodes.cannot_create
          );
        else
          return new Success(SuccessDescription.created, SuccessCode.created);
      });
  } catch (error) {
    console.log(error);
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
        if (!doc)
          return new Error(
            ErrorDescriptions.cannot_create,
            ErrorCodes.cannot_create
          );
        else
          return new Success(SuccessDescription.created, SuccessCode.created);
      });
  } catch (error) {
    console.log(error);
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
        if (!doc)
          return new Error(
            ErrorDescriptions.non_existent,
            ErrorCodes.non_existent
          );
        else {
          //TODO utente non modificato e utente modificato
        }
      });
  } catch (error) {
    console.log(error);
  }
}

/**
 * cancella l'account dell'utente
 * @param mail mail dell'utente
 * @param password password dell'utente (cifrata)
 */
export async function deleteAccount(mail: string, password: string) {
  try {
    // TODO errori e successi
    await userModel.deleteOne({
      $and: [{ mail: mail }, { password: password }],
    });
  } catch (error) {
    console.log(error);
  }
}

/**
 * aggiorna il reset token al valore del token generato dal server
 * @param mail mail dell'utente
 * @param token token di conferma
 */
export async function updateResetToken(mail: string, token: string) {
  try {
    // TODO errori e successi
    await userModel.updateOne({ mail: mail }, { resetToken: token });
  } catch (error) {
    console.log(error);
  }
}

/**
 * aggiorna la password di un utente e resetta il token
 * @param mail mail dell'utente
 * @param password nuova password dell'utente
 */
export async function updatePassword(mail: string, password: string) {
  try {
    userModel
      .findOneAndUpdate(
        { mail: mail },
        { password: password, resetToken: "" },
        { returnDocument: "after" }
      )
      .then((newDoc) => {
        if (!newDoc)
          return new Error(
            ErrorDescriptions.non_existent,
            ErrorCodes.non_existent
          );
        else {
          if (newDoc.password !== password)
            return new Success(SuccessDescription.updated, SuccessCode.updated);
          else
            return new Error(
              ErrorDescriptions.cannot_update,
              ErrorCodes.cannot_update
            );
        }
      });
  } catch (error) {
    console.log(error);
  }
}
