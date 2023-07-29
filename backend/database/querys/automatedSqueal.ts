import automatedSquealModel from "../models/automatedSqueal.model";
import { cannot_create, no_characters, non_existent } from "../../util/errors";
import {
  AutomatedSqueal,
  Id,
  Success,
  TimedSqueal,
  Error,
} from "../../util/types";
import { updateCount } from "./timedSqueal";
import { getUserCharacter, updateDailyCharacters } from "../../util/characters";

export async function getAllAutomatedSqueals() {
  const squeals: AutomatedSqueal[] = await automatedSquealModel.find();
  if (squeals.length < 1) return non_existent;
  else return squeals;
}

/**
 * funzione che posta uno squeal automatico
 * @param squeal TimedSqueal da postare in automatico
 * @param originalSqueal Id dello squeal originale
 * @param userId id utente
 * @returns Error | AutomatedSqueal
 */
export async function postAutomatedSqueal(
  squeal: TimedSqueal,
  originalSqueal: Id,
  userId: Id,
) {
  const result: [number, number, number] | Error = await getUserCharacter(
    userId,
  );

  if (result instanceof Error) return result;
  else {
    const [dailyCharacters, weeklyCharacters, monthlyCharacters] = result as [
      number,
      number,
      number,
    ];
    if (dailyCharacters > squeal.body.length) {
      const newSqueal: AutomatedSqueal = await automatedSquealModel.create({
        body: squeal.body,
        recipients: squeal.recipients,
        date: new Date(),
        category: squeal.category,
        author: squeal.author,
        originalSqueal: originalSqueal,
        channels: squeal.channels,
      });
      if (!newSqueal) return cannot_create;
      else {
        const updateCharacter: Error | Success = await updateDailyCharacters(
          userId,
          newSqueal.body.length,
        );
        if (updateCharacter instanceof Error) return updateCharacter;
        const count: Error | Success = await updateCount(squeal._id);
        if (count instanceof Error) {
          return count;
        } else {
          return newSqueal;
        }
      }
    } else return no_characters;
  }
}
