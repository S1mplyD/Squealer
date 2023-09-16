import userModel from "../database/models/users.model";
import { getChannel } from "../database/querys/channels";
import { getUserByUsername } from "../database/querys/users";
import { SquealerError } from "../util/errors";
import { Channel, User } from "../util/types";

export async function createNotification(
  notification: string,
  channelName?: string,
  recipient?: string
) {
  if (channelName) {
    const channel: Channel | SquealerError = await getChannel(channelName);
    if (!(channel instanceof SquealerError)) {
      for (let i of channel.allowedRead) {
        await userModel.updateOne(
          { _id: i },
          { $push: { notification: notification } }
        );
      }
    }
  }
  if (recipient) {
    const user: User | SquealerError = await getUserByUsername(recipient);
    if (!(user instanceof SquealerError))
      await userModel.updateOne(
        { _id: user._id },
        { $push: { notification: notification } }
      );
  }
}
