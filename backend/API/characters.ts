import userModel from "../database/models/users.model";
import { getUser } from "../database/querys/users";
import {
  defaultCharactersBase,
  defaultCharactersJournalist,
  defaultCharactersProfessional,
  defaultCharactersVerified,
} from "../util/constants";
import { SquealerError, cannot_update, non_existent } from "../util/errors";
import { updated } from "../util/success";
import { User } from "../util/types";

/**
 * funzione che ritorna i caratteri di un utente
 * @param id id utente
 * @returns SquealerError | characters
 */
export async function getUserCharacter(id: string) {
  const user: User | SquealerError = await getUser(id);
  if (user instanceof SquealerError) return non_existent;
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
 * @returns SquealerError | Success
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
 * funzione che resetta i caratteri giornalieri
 * @param id id utente
 * @returns Success | SquealerError
 */
export async function resetCharactersDaily(id: string) {
  const characters: SquealerError | [number, number, number] =
    await getUserCharacter(id);
  if (characters instanceof SquealerError) {
    return characters;
  }
  const [daily, weekly, monthly] = characters as [number, number, number];
  const user: User | SquealerError = await getUser(id);
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

/**
 * funzione che aggiorna i caratteri settimanali di un utente
 * @param id id utente
 * @returns SquealerError | Success
 */
export async function resetCharactersWeekly(id: string) {
  const characters: SquealerError | [number, number, number] =
    await getUserCharacter(id);
  if (characters instanceof SquealerError) {
    return non_existent;
  }
  const [daily, weekly, monthly] = characters as [number, number, number];
  const user: User | SquealerError = await getUser(id);
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
    if (update.modifiedCount < 1) return cannot_update;
    else return updated;
  }
}

/**
 * funzione che aggiora i caratteri mensili di un utente
 * @param id id utente
 * @returns SquealerError | Success
 */
export async function resetCharactersMonthly(id: string) {
  const characters: SquealerError | [number, number, number] =
    await getUserCharacter(id);
  if (characters instanceof SquealerError) {
    return non_existent;
  }
  const user: User | SquealerError = await getUser(id);
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
    if (update.modifiedCount < 1) return cannot_update;
    else return updated;
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
