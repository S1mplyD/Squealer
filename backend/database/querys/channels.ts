import { channelsModel } from "../models/channels.model";

export async function createChannel(channelName: string) {
  await channelsModel.create({ name: channelName });
}
