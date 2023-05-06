import { userModel } from "../models/users.model";

/**
 * Ritorna tutti gli utenti
 */
export async function getAllUsers() {
  try {
    const users = await userModel.find();
    return users;
  } catch (error) {
    return error;
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
    await userModel.create({
      name: name,
      username: username,
      mail: mail,
      password: password,
    });
  } catch (error) {
    return error;
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
    await userModel.create({
      name: name,
      username: username,
      mail: mail,
      serviceId: serviceId,
      profilePicture: profilePicture,
    });
  } catch (error) {
    return error;
  }
}

/**
 * Aggiorna i dettagli di un utente
 * @param user oggetto contenente i dettagli di un utente
 */
export async function updateUser(user: any) {
  try {
    await userModel.findByIdAndUpdate(user.id, user);
  } catch (error) {
    return error;
  }
}

/**
 * cancella l'account dell'utente
 * @param mail mail dell'utente
 * @param password password dell'utente (cifrata)
 */
export async function deleteAccount(mail: string, password: string) {
  try {
    await userModel.deleteOne({
      $and: [{ mail: mail }, { password: password }],
    });
  } catch (error) {
    return error;
  }
}
