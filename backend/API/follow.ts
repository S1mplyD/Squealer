import userModel from "../database/models/users.model";
import { getUser } from "../database/querys/users";
import { SquealerError, cannot_update, non_existent } from "../util/errors";
import { updated } from "../util/success";
import { User } from "../util/types";

/**
 * funzione che ritorna i followers di un utente
 * @param userId id dell'utente
 * @returns followersCount | SquealerError
 */
export async function getAllFollowers(userId: string) {
  const user: User | SquealerError = await getUser(userId);
  if (user instanceof SquealerError) return non_existent;
  else {
    return (user as User).followersCount;
  }
}

/**
 * funzione che ritorna i seguiti di un utente
 * @param userId id dell'utente
 * @returns followingCount | SquealerError
 */
export async function getAllFollowing(userId: string) {
  const user: User | SquealerError = await getUser(userId);
  if (user instanceof SquealerError) return non_existent;
  else {
    return (user as User).followingCount;
  }
}

/**
 * funzione che aggiorna il numero di followers di un utente e il numero di followed del seguito
 * @param userId id dell'utente che segue
 * @param followId id dell'utente seguito
 * @returns SquealerError | Success
 */
export async function followUser(userId: string, followId: string) {
  const update = await userModel.updateOne(
    { _id: userId },
    { $inc: { followingCount: 1 } }
  );
  if (update.modifiedCount < 1) return cannot_update;
  else {
    const updateUser = await userModel.updateOne(
      { _id: followId },
      { $inc: { followersCount: 1 } }
    );
    if (updateUser.modifiedCount < 1) return cannot_update;
    else return updated;
  }
}

/**
 * funzione che elimina il follow ad un utente
 * @param userId id dell'utente che toglie il follow
 * @param followId id dell'utente che viene unfollowato
 * @returns SquealerError | Success
 */
export async function unfollowUser(userId: string, followId: string) {
  const update = await userModel.updateOne(
    { _id: userId },
    { $inc: { followingCount: -1 } }
  );
  if (update.modifiedCount < 1) return cannot_update;
  else {
    const updateUser = await userModel.updateOne(
      { _id: followId },
      { $inc: { followersCount: -1 } }
    );
    if (updateUser.modifiedCount < 1) return cannot_update;
    else return updated;
  }
}
