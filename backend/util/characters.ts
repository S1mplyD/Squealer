import userModel from "../database/models/users.model";
import { getUser } from "../database/querys/users";
import {
  defaultCharactersBase,
  defaultCharactersJournalist,
  defaultCharactersProfessional,
  defaultCharactersVerified,
} from "./constants";
import { cannot_update, non_existent } from "./errors";
import { updated } from "./success";
import { Error, User } from "./types";

/**
 * funzione che ritorna i caratteri di un utente
 * @param id id utente
 * @returns Error | characters
 */
export async function getUserCharacter(id: string) {
  const user: User | Error = await getUser(id);
  if (user instanceof Error) return non_existent;
  else {
    const characters: [number, number, number] = [
      (user as User).dailyCharacters,
      (user as User).weeklyCharacters,
      (user as User).monthlyCharacters,
    ];
    return characters;
  }
}

/**
 * funzione che aggiorna i caratteri giornalieri
 * @param id id utente
 * @param usedCharacters caratteri utilizzati in uno squeal
 * @returns Error | Success
 */
export async function updateDailyCharacters(
  id: string,
  usedCharacters: number
) {
  const update = await userModel.updateOne(
    { _id: id },
    {
      $inc: {
        dailyCharacters: -usedCharacters,
      },
    }
  );
  if (update.modifiedCount < 1) return cannot_update;
  else return updated;
}

/**
 * funzione che resetta i caratteri giornalieri, settimanali e mensili dell'utente
 * @param id id utente
 * @returns Success | Error
 */
export async function resetCharactersDaily(id: string) {
  const characters: Error | [number, number, number] = await getUserCharacter(
    id
  );
  if (characters instanceof Error) {
    return characters;
  }
  const [daily, weekly, monthly] = characters as [number, number, number];
  const user: User | Error = await getUser(id);
  const defaultCharacters: number[] | undefined = await getDefaultCharacters(
    (user as User).plan
  );
  if (defaultCharacters !== undefined) {
    const update = await userModel.updateOne(
      { _id: id },
      {
        dailyCharacters: defaultCharacters[0],
        weeklyCharacters: weekly - daily,
        monthlyCharacters: monthly - daily,
      }
    );
  }
}

//TODO return values
export async function resetCharactersWeekly(id: string) {
  const characters: Error | [number, number, number] = await getUserCharacter(
    id
  );
  if (characters instanceof Error) {
    return characters;
  }
  const [daily, weekly, monthly] = characters as [number, number, number];
  const user: User | Error = await getUser(id);
  const defaultCharacters: number[] | undefined = await getDefaultCharacters(
    (user as User).plan
  );
  if (defaultCharacters !== undefined) {
    const update = await userModel.updateOne(
      { _id: id },
      {
        weeklyCharacters: defaultCharacters[1],
        monthlyCharacters: monthly - weekly,
      }
    );
  }
}

//TODO return values
export async function resetCharactersMonthly(id: string) {
  const characters: Error | [number, number, number] = await getUserCharacter(
    id
  );
  if (characters instanceof Error) {
    return characters;
  }
  const user: User | Error = await getUser(id);
  const defaultCharacters: number[] | undefined = await getDefaultCharacters(
    (user as User).plan
  );
  if (defaultCharacters !== undefined) {
    const update = await userModel.updateOne(
      { _id: id },
      {
        monthlyCharacters: defaultCharacters[2],
      }
    );
  }
}

export async function getDefaultCharacters(plan: string) {
  switch (plan) {
    case "base":
      return defaultCharactersBase;
    case "verified":
      return defaultCharactersVerified;
    case "professional":
      return defaultCharactersProfessional;
    case "journalist":
      return defaultCharactersJournalist;
    default:
      break;
  }
}

export async function updateCharacter(id: string, usedCharacters: number) {
  const update = await userModel.updateOne({ _id: id }, {});
}

export async function addCharacters() {}
