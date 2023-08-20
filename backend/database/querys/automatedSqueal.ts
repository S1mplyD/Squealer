import automatedSquealModel from "../models/automatedSqueal.model";
import {
  SquealerError,
  cannot_create,
  no_characters,
  non_existent,
} from "../../util/errors";
import {
  AutomatedSqueal,
  Success,
  TimedSqueal,
  TimedSquealGeo,
  AutomatedGeoSqueal,
} from "../../util/types";
import { updateCount } from "./timedSqueal";
import { getUserCharacter, updateDailyCharacters } from "../../API/characters";
import { geoCharacters } from "../../util/constants";
import automatedSquealGeoModel from "../models/automatedSquealGeo";

/**
 * funzione che ritorna tutti gli squeal automatizzati
 * @returns SquealerError | (...AutomatedSqueal,...AutomatedGeoSqueal)[]
 */
export async function getAllAutomatedSqueals() {
  const squealstext: AutomatedSqueal[] = await automatedSquealModel.find();
  const squealsgeo: AutomatedGeoSqueal[] = await automatedSquealGeoModel.find();
  const squeals = [...squealsgeo, ...squealstext];
  if (squeals.length < 1) return non_existent;
  else return squeals;
}

export async function getAutomatedSqueal(id: string) {
  const squeal: AutomatedSqueal | null = await automatedSquealModel.findById(
    id
  );
  if (!squeal) return non_existent;
  else return squeal;
}

export async function getAutomatedGeoSqueal(id: string) {
  const squeal: AutomatedGeoSqueal | null =
    await automatedSquealGeoModel.findById(id);
  if (!squeal) return non_existent;
  else return squeal;
}

/**
 * funzione che posta uno squeal automatico
 * @param squeal TimedSqueal da postare in automatico
 * @param originalSqueal Id dello squeal originale
 * @param userId id utente
 * @returns SquealerError | AutomatedSqueal
 */
export async function postAutomatedSqueal(
  squeal: TimedSqueal | TimedSquealGeo,
  originalSqueal: string,
  userId: string
) {
  const result: [number, number, number] | SquealerError =
    await getUserCharacter(userId);

  if (result instanceof SquealerError) return result;
  else {
    const [dailyCharacters, weeklyCharacters, monthlyCharacters] = result as [
      number,
      number,
      number,
    ];
    if ("body" in squeal) {
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
          const updateCharacter: SquealerError | Success =
            await updateDailyCharacters(userId, newSqueal.body.length);
          if (updateCharacter instanceof SquealerError) return updateCharacter;
          const count: SquealerError | Success = await updateCount(squeal._id);
          if (count instanceof SquealerError) {
            return count;
          } else {
            return newSqueal;
          }
        }
      } else return no_characters;
    } else if ("lat" in squeal) {
      if (dailyCharacters > geoCharacters) {
        const newSqueal: AutomatedGeoSqueal =
          await automatedSquealGeoModel.create({
            lat: squeal.lat,
            lng: squeal.lng,
            recipients: squeal.recipients,
            date: new Date(),
            category: squeal.category,
            author: squeal.author,
            originalSqueal: originalSqueal,
            channels: squeal.channels,
          });
        if (!newSqueal) return cannot_create;
        else {
          const updateCharacter: SquealerError | Success =
            await updateDailyCharacters(userId, geoCharacters);
          if (updateCharacter instanceof SquealerError) return updateCharacter;
          const count: SquealerError | Success = await updateCount(squeal._id);
          if (count instanceof SquealerError) {
            return count;
          } else {
            return newSqueal;
          }
        }
      } else return no_characters;
    }
  }
}
