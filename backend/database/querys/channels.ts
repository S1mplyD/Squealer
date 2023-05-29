import { Error, ErrorCodes, ErrorDescriptions } from "../../util/errors";
import { Success, SuccessCode, SuccessDescription } from "../../util/success";
import { channelsModel } from "../models/channels.model";

/**
 * funzione che crea un canale
 * @param channelName nome del canale da creare
 */
export async function createChannel(channelName: string) {
  await channelsModel.create({ name: channelName }).then((newChannel) => {
    if (!newChannel)
      return new Error(
        ErrorDescriptions.cannot_create,
        ErrorCodes.cannot_create
      );
    else return new Success(SuccessDescription.created, SuccessCode.created);
  });
}
