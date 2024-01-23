import { getDefaultCharacters } from "../../API/characters";
import {
  cannot_create,
  cannot_delete,
  cannot_update,
  non_existent,
  SquealerError,
} from "../../util/errors";
import { removed, updated } from "../../util/success";
import { Timeout, User } from "../../util/types";
import userModel from "../models/users.model";
import fs from "fs";
import { join, resolve } from "path";

const publicUploadPath = resolve(__dirname, "../../..", "public/uploads/");

let intervals: Array<Timeout> = [];

/**
 * Ritorna tutti gli utenti
 */
export async function getAllUsers() {
  const users: User[] | null = await userModel.find();
  if (users.length < 1) throw non_existent;
  else return users;
}

export async function getManagedUsers(username: string): Promise<User[]> {
  let managedUsers: User[] = [];
  const user: User = await getUserByUsername(username);
  for (let i of user.managedAccounts) {
    const managedUser: User = await getUser(i);
    managedUsers.push(managedUser);
  }
  return managedUsers;
}

/**
 * funzione che ritorna un utente
 * @param id id dell'utente
 * @returns SquealerError | User
 */
export async function getUser(id: string) {
  const user: User | null = await userModel.findOne({ _id: id });
  if (!user) throw non_existent;
  else return user;
}

/**
 * funzione che ritorna un utente
 * @param username username dell'utente
 * @returns SquealerError | User
 */
export async function getUserByUsername(username: string) {
  const user: User | null = await userModel.findOne({ username: username });
  if (!user) throw non_existent;
  else return user;
}

export async function getProfessionalUsers() {
  const users: User[] | null = await userModel.find({ plan: "professional" });
  if (!users) throw non_existent;
  else return users;
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
  password: string,
) {
  const doc = await userModel.create({
    name: name,
    username: username.replaceAll(" ", "_"),
    mail: mail,
    password: password,
    createdAt: new Date(),
    profilePicture: "/public/default.png",
  });
  if (!doc) throw cannot_create;
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
  createdAt: Date,
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
  if (!newUser) throw cannot_create;
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
    { returnDocument: "after" },
  );
  if (update.modifiedCount < 1) throw cannot_update;
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
export async function updateProfilePicture(username: string, filename: string) {
  const user = await userModel.updateOne(
    { username: username },
    { profilePicture: filename },
  );
  if (user.modifiedCount < 1) throw cannot_update;
  else return updated;
}

/**
 * funzione che elimina la foto profilo dell'utente
 * @param username username dell'utente
 */
export async function deleteProfilePicture(username: string) {
  const user: User | null = await userModel.findOne({ username: username });

  if (!user) throw non_existent;
  else {
    if (user.profilePicture !== undefined) {
      fs.unlink(join(publicUploadPath, user.profilePicture), async (err) => {
        if (err) throw cannot_delete;
        else {
          await userModel.updateOne(
            { _id: user._id },
            { profilePicture: "default.png" },
          );
        }
      });
    }
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
  isAdmin: boolean,
) {
  const user: User | null = await userModel.findOne({ mail: mail });
  if (!user) throw non_existent;
  if (user.profilePicture !== "default.png") {
    fs.unlink(publicUploadPath + user.profilePicture, (err) => {
      if (err) {
        console.log(err);
        throw cannot_delete;
      }
    });
  }

  if (isAdmin) {
    const user = await userModel.deleteOne({ mail: mail });
    if (user.deletedCount < 1) throw cannot_delete;
    else return removed;
  } else {
    const user = await userModel.deleteOne({
      $and: [{ mail: mail }, { password: password }],
    });
    if (user.deletedCount < 1) throw cannot_delete;
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
    { resetToken: token },
  );
  if (result.modifiedCount < 1) throw cannot_update;
  else return updated;
}

/**
 * aggiorna la password di un utente e resetta il token
 * @param mail mail dell'utente
 * @param password nuova password dell'utente
 */
export async function updatePassword(mail: string, password: string) {
  const newDoc: User | null = await userModel
    .findOneAndUpdate({ mail: mail }, { password: password, resetToken: "" })
    .lean();
  if (!newDoc) throw non_existent;
  else {
    if (newDoc.password !== password) return updated;
    else throw cannot_update;
  }
}

/**
 * funzione che fornisce i permessi da admin ad un utente
 * @param userId id dell'utente
 * @returns Success
 */
export async function grantPermissions(userId: string) {
  const update = await userModel.updateOne({ _id: userId }, { plan: "admin" });
  if (update.modifiedCount < 1) throw cannot_update;
  else return updated;
}

/**
 * funzione che revoca i permessi da admin ad un utente
 * @param userId id dell'utente
 * @returns SquealerError | Success
 */
export async function revokePermissions(userId: string) {
  const update = await userModel.updateOne({ _id: userId }, { plan: "base" });
  if (update.modifiedCount < 1) throw cannot_update;
  else return updated;
}

/**
 * funzione che banna un utente e rimuove gli account gestiti o l'SMM che gestisce l'account
 * @param id id dell'utente da bannare
 * @returns non_existent | cannot_update | updated
 */
export async function ban(id: string) {
  const user: User = await getUser(id);
  const update = await userModel.updateOne({ _id: id }, { status: "ban" });
  if (update.modifiedCount < 1) throw cannot_update;
  //Rimuovo l'smm o un account managed
  else {
    if (user.SMM !== "" || user.SMM === undefined) {
      //Rimuovo l'SMM all'utente bannato
      const updateUser = await userModel.updateOne({ _id: id }, { SMM: "" });
      if (updateUser.modifiedCount < 1) throw cannot_update;
      // Rimuovo all'smm dell'utente bannato l'account gestito

      const updateSMM = await userModel.updateOne(
        { _id: user.SMM },
        { $pull: { managedAccounts: user._id } },
      );
      if (updateSMM.modifiedCount < 1) throw cannot_update;
      else return updated;
    } else if (user.managedAccounts.length > 0) {
      const len = user.managedAccounts.length;
      let count = 0;
      for (let i of user.managedAccounts) {
        const updateUser = await userModel.updateOne({ _id: i }, { SMM: "" });
        if (updateUser.modifiedCount > 0) count++;
      }
      if (count === len) return updated;
      else throw cannot_update;
    } else return updated;
  }
}

/**
 * funzione che rimuove il ban ad un utente
 * @param id id utente
 * @returns cannot_update | Success
 */
export async function unbanUser(id: string) {
  const update = await userModel.updateOne({ _id: id }, { status: "normal" });
  if (update.modifiedCount < 1) throw cannot_update;
  else return updated;
}

/**
 * funzione che blocca un utente
 * @param username utente da bloccare
 * @param time tempo di blocco
 * @returns cannot_update | Success
 */
export async function blockUser(username: string, time: number) {
  const update = await userModel.updateOne(
    { username: username },
    { status: "block", blockedFor: time },
  );
  let timeout: NodeJS.Timeout;
  if (update.modifiedCount < 1) throw cannot_update;
  else {
    timeout = setTimeout(async () => {
      await userModel.updateOne(
        { username: username },
        { status: "normal", blockedFor: 0 },
      );
    }, time);
    const newTimeout: Timeout = {
      timeout: timeout,
      username: username,
    };
    intervals.push(newTimeout);
    return updated;
  }
}

export async function unblockUser(username: string) {
  const update = await userModel.updateOne(
    { username: username },
    { status: "normal", blockedFor: 0 },
  );
  if (update.modifiedCount < 1) throw cannot_update;
  else {
    await stopTimer(username);
    return updated;
  }
}

async function findInterval(username: string) {
  const ret: Timeout | undefined = intervals.find(
    (el) => el.username === username,
  );
  return ret?.timeout as NodeJS.Timeout;
}

async function stopTimer(username: string) {
  clearInterval(await findInterval(username));
  intervals = intervals.filter((interval) => interval.username !== username);
}

/**
 * funzione che aggiunge un social media manager all'account
 * @param username username del smm
 * @param id id dell'utente che aggiunge un smm
 * @returns non_existent | cannot_update | updated
 */
//TODO managed accounts
//TODO controllo che smm sia vuoto
export async function addSMM(username: string, id: string) {
  const user: User = await getUserByUsername(username);
  const updateUser = await userModel.updateOne(
    { _id: id },
    { SMM: user.username },
  );
  const updateSMM = await userModel.updateOne(
    {
      _id: user._id,
    },
    { $push: { managedAccounts: id } },
  );
  if (updateUser.modifiedCount > 0 && updateSMM.modifiedCount > 0)
    return updated;
}

/**
 * funzione che rimuove l'smm di un account
 * @param id id dell'utente che deve rimuovere l'smm
 * @param username username dell'smm
 * @returns cannot_update | updated
 */
export async function removeSMM(id: string, username: string) {
  const user: User = await getUserByUsername(username);
  const updateUser = await userModel.updateOne({ _id: id }, { SMM: "" });
  const updateSMM = await userModel.updateOne(
    {
      _id: user._id,
    },
    { $pull: { managedAccounts: id } },
  );
  if (updateUser.modifiedCount > 0 && updateSMM.modifiedCount > 0)
    return updated;
}

export async function changeUserPlan(username: string, plan: string) {
  const characters = await getDefaultCharacters(plan);
  if (characters) {
    const update = await userModel.updateOne(
      { username: username },
      {
        plan: plan,
        dailyCharacters: characters[0],
        weeklyCharacters: characters[1],
        monthlyCharacters: characters[2],
      },
    );
    if (update.modifiedCount > 0) return updated;
    else throw cannot_update;
  }
}

export async function getUserProfilePictureByUsername(username: string) {
  const user: User = await getUserByUsername(username);
  return user.profilePicture;
}

export async function addCharactersToUser(
  username: string,
  dailyCharacters: number,
  weeklyCharacters: number,
  monthlyCharacters: number,
) {
  const update = await userModel.updateOne(
    { username },
    {
      $inc: {
        dailyCharacters: dailyCharacters,
        weeklyCharacters: weeklyCharacters,
        monthlyCharacters: monthlyCharacters,
      },
    },
  );

  if (update.modifiedCount > 0) {
    return updated;
  } else throw cannot_update;
}

export async function getUsersByNameAsc() {
  const users: User[] = await userModel.find().sort({ username: 1 }).lean();
  return users;
}

export const getUsersByNameDesc = async () => {
  const users: User[] = await userModel.find().sort({ username: -1 }).lean();
  return users;
};

export const getUsersByTypeAsc = async () => {
  const users: User[] = await userModel.find().sort({ plan: 1 }).lean();
  return users;
};

export const getUsersByTypeDesc = async () => {
  const users: User[] = await userModel.find().sort({ plan: -1 }).lean();
  return users;
};
export const getUsersByPopularityAsc = async () => {
  const users: User[] = await userModel.find().sort({ popularity: 1 }).lean();
  return users;
};

export const getUsersByPopularityDesc = async () => {
  const users: User[] = await userModel.find().sort({ popularity: -1 }).lean();
  return users;
};
