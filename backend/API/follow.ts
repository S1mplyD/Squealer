import userModel from "../database/models/users.model";
import { getUser, getUserByUsername } from "../database/querys/users";
import { SquealerError, cannot_update, non_existent } from "../util/errors";
import { updated } from "../util/success";
import { User } from "../util/types";

/**
 * funzione che ritorna i followers di un utente
 * @param username username dell'utente
 * @returns followersCount | SquealerError
 */
//TODO ritornare lista di followers
export async function getAllFollowers(username: string) {
  const user: User | SquealerError = await getUserByUsername(username);

  if (user instanceof SquealerError) return non_existent;
  else {
    let followers: User[] = [];
    if (user.followers === undefined) return non_existent;
    else if (user.followers?.length < 1) return non_existent;
    else {
      for (let i of user.followers) {
        const user: User | SquealerError = await getUserByUsername(username);
        if (!(user instanceof SquealerError)) followers.push(user as User);
      }
    }
    return followers;
  }
}

/**
 * funzione che ritorna i seguiti di un utente
 * @param username username dell'utente
 * @returns followingCount | SquealerError
 */
//TODO ritornare lista di seguiti
export async function getAllFollowing(username: string) {
  const user: User | SquealerError = await getUserByUsername(username);

  if (user instanceof SquealerError) return non_existent;
  else {
    let following: User[] = [];
    if (user.following === undefined) return non_existent;
    else if (user.following?.length < 1) return non_existent;
    else {
      for (let i of user.following) {
        const user: User | SquealerError = await getUserByUsername(username);
        if (!(user instanceof SquealerError)) following.push(user as User);
      }
    }
    return following;
  }
}

/**
 * funzione che aggiorna il numero di followers di un utente e il numero di followed del seguito
 * @param userId id dell'utente che segue
 * @param username username dell'utente seguito
 * @returns SquealerError | Success
 */
export async function followUser(userId: string, username: string) {
  const update = await userModel.updateOne(
    { _id: userId },
    { $inc: { followingCount: 1 } }
  );
  if (update.modifiedCount < 1) return cannot_update;
  else {
    const updateUser = await userModel.updateOne(
      { _id: username },
      { $inc: { followersCount: 1 } }
    );
    if (updateUser.modifiedCount < 1) return cannot_update;
    else return updated;
  }
}

/**
 * funzione che elimina il follow ad un utente
 * @param userId id dell'utente che toglie il follow
 * @param username username dell'utente che viene unfollowato
 * @returns SquealerError | Success
 */
export async function unfollowUser(userId: string, username: string) {
  const update = await userModel.updateOne(
    { _id: userId },
    { $inc: { followingCount: -1 } }
  );
  if (update.modifiedCount < 1) return cannot_update;
  else {
    const updateUser = await userModel.updateOne(
      { _id: username },
      { $inc: { followersCount: -1 } }
    );
    if (updateUser.modifiedCount < 1) return cannot_update;
    else return updated;
  }
}
