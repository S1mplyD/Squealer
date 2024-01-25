import { updateAnalyticTime } from "../../util/constants";
import { Squeal } from "../../util/types";
import squealModel from "../models/squeals.model";
import {
  getAllSqueals,
  getAllUserSqueals,
  getSquealResponses,
} from "./squeals";

/**
 * funzione che aggiorna tutte le analitiche
 * (NON ESEGUIRE, IL SERVER LA ESEGUE IN AUTOMATICO)
 * @returns SquealerError | Success
 */
export async function updateAnalyticForEverySqueal() {
  try {
    const squeals: Squeal[] = await getAllSqueals();
    for (let i of squeals) {
      if (i.category === "public") {
        let cm: number = 0;
        cm += i.positiveReactions ? i.positiveReactions.length : 0;
        cm += i.negativeReactions ? i.negativeReactions.length : 0;
        cm += i.visual ? i.visual : 0;
        cm = cm * 0.25;
        if (
          i.positiveReactions &&
          i.positiveReactions.length > cm &&
          i.negativeReactions &&
          !(i.negativeReactions.length > cm)
        ) {
          await squealModel.updateOne({ _id: i._id }, { category: "popular" });
        } else if (
          i.positiveReactions &&
          !(i.positiveReactions.length > cm) &&
          i.negativeReactions &&
          i.negativeReactions.length > cm
        ) {
          await squealModel.updateOne(
            { _id: i._id },
            { category: "unpopular" },
          );
        } else if (
          i.positiveReactions &&
          i.positiveReactions.length > cm &&
          i.negativeReactions &&
          i.negativeReactions.length > cm
        ) {
          await squealModel.updateOne(
            { _id: i._id },
            { category: "controversial" },
          );
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
}

/**
 * funzione che esegue l'aggiornamento delle analytics ogni tot. ore
 */
export async function updateAnalyticTimer() {
  setInterval(async () => {
    console.log("[UPDATING ANALYTICS...]");
    await updateAnalyticForEverySqueal();
  }, updateAnalyticTime);
}

export const getAllUserSquealsResponses = async (username: string) => {
  try {
    const userSqueals: Squeal[] = await getAllUserSqueals(username);
    let completeSqueals: { originalSqueal: Squeal; responses: Squeal[] }[] = [];
    let responses: Squeal[] = [];
    for (let i of userSqueals) {
      const squealResponses: Squeal[] = await getSquealResponses(i._id);
      for (let j of squealResponses) {
        responses.push(j);
      }
      completeSqueals.push({ originalSqueal: i, responses: responses });
    }
    return completeSqueals;
  } catch (e) {
    console.error(e);
  }
};

export const getPopularPosts = async (username: string) => {
  const squeals: Squeal[] = await squealModel
    .find({ $and: [{ category: "popular" }, { author: username }] })
    .sort({ positiveReactions: 1 });
  return squeals;
};

export const getUnpopularPosts = async (username: string) => {
  const squeals: Squeal[] = await squealModel
    .find({ $and: [{ category: "unpopular" }, { author: username }] })
    .sort({ negativeReactions: 1 });
  return squeals;
};

export const getControversialPosts = async (username: string) => {
  const squeals: Squeal[] = await squealModel.find({
    $and: [{ category: "controversial" }, { author: username }],
  });
  return squeals;
};
