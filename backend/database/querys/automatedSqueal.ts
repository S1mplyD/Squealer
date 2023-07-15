import automatedSquealModel from "../models/automatedSqueal.model";
import { Error, ErrorCodes, ErrorDescriptions } from "../../util/errors";
import { Success, SuccessCode, SuccessDescription } from "../../util/success";
import { AutomatedSqueal, TimedSqueal } from "../../util/types";

export async function getAllAutomatedSqueals() {
  const squeals: AutomatedSqueal[] = await automatedSquealModel.find();
  if (squeals.length < 1)
    return new Error(ErrorDescriptions.non_existent, ErrorCodes.non_existent);
  else return squeals;
}

export async function postAutomatedSqueal(
  squeal: TimedSqueal,
  originalSqueal: string,
) {
  const newSqueal: AutomatedSqueal = await automatedSquealModel.create({
    body: squeal.body,
    recipients: squeal.recipients,
    date: new Date(),
    category: squeal.category,
    author: squeal.author,
    originalSqueal: originalSqueal,
    channels: squeal.channels,
  });
  if (!newSqueal)
    return new Error(ErrorDescriptions.cannot_create, ErrorCodes.cannot_create);
  else return newSqueal;
}
