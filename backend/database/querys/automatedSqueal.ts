import automatedSquealModel from "../models/automatedSqueal.model";
import {
  Error,
  ErrorCodes,
  ErrorDescriptions,
  cannot_create,
  non_existent,
} from "../../util/errors";
import { AutomatedSqueal, TimedSqueal } from "../../util/types";
import mongoose from "mongoose";

export async function getAllAutomatedSqueals() {
  const squeals: AutomatedSqueal[] = await automatedSquealModel.find();
  if (squeals.length < 1) return non_existent;
  else return squeals;
}

export async function postAutomatedSqueal(
  squeal: TimedSqueal,
  originalSqueal: mongoose.Types.ObjectId
) {
  console.log("automated post");
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
  else return newSqueal;
}
