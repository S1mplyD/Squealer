import userModel from "../database/models/users.model";
import { getAllUserSqueals } from "../database/queries/squeals";
import { getAllUsers } from "../database/queries/users";
import { Squeal, User } from "../util/types";

const updateTime: number = 86400000; //1 day

export const updateUsersPopularity = async () => {
  try {
    setInterval(async () => {
      const users: User[] = await getAllUsers();
      for (let i of users) {
        updateUserPopularity(i);
      }
    }, updateTime);
  } catch (e) {
    console.error(e);
  }
};

export const updateUserPopularity = async (user: User) => {
  const usersSqueals: Squeal[] = await getAllUserSqueals(user.username);
  let allPositive: number = 0;
  let allNegative: number = 0;
  let allVisuals: number = 0;
  for (let i of usersSqueals) {
    allPositive += i.positiveReactions ? i.positiveReactions.length : 0;
    allNegative += i.negativeReactions ? i.negativeReactions.length : 0;
    allVisuals += i.visual ? i.visual : 0;
  }
  let popularity: number = user.followers
    ? allPositive + allVisuals - allNegative + user.followers.length
    : allPositive + allVisuals - allNegative;
  const update = await userModel.updateOne(
    { _id: user._id },
    { popularity: popularity },
  );
  if (update.modifiedCount < 1)
    throw new Error(`Cannot update popularity of user ${user.username}`);
};
