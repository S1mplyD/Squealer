import automatedSquealModel from "../models/automatedSqueal.model";
import { cannot_create, no_characters, non_existent } from "../../util/errors";
import {
  AutomatedSqueal,
  Id,
  Success,
  TimedSqueal,
  Error,
  TimedSquealGeo,
  AutomatedGeoSqueal,
} from "../../util/types";
import { updateCount } from "./timedSqueal";
import { getUserCharacter, updateDailyCharacters } from "../../util/characters";
import { geoCharacters } from "../../util/constants";
import automatedSquealGeoModel from "../models/automatedSquealGeo";

/**
 * funzione che ritorna tutti gli squeal automatizzati
 * @returns Error | (...AutomatedSqueal,...AutomatedGeoSqueal)[]
 */
export async function getAllAutomatedSqueals() {
  const squealstext: AutomatedSqueal[] = await automatedSquealModel.find();
  const squealsgeo: AutomatedGeoSqueal[] = await automatedSquealGeoModel.find();
  const squeals = [...squealsgeo, ...squealstext];
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
  squeal: TimedSqueal | TimedSquealGeo,
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
          const updateCharacter: Error | Success = await updateDailyCharacters(
            userId,
            geoCharacters,
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
}
