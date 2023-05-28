import { Error, ErrorCodes, ErrorDescriptions } from "../../util/errors";
import { channelsModel } from "../models/channels.model";

export async function createChannel(channelName: string) {
  await channelsModel.create({ name: channelName }).then((newChannel) => {
    if (!newChannel)
      return new Error(
        ErrorDescriptions.cannot_create,
        ErrorCodes.cannot_create
      );
  });
}
