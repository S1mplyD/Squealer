import { SquealerError } from "../../util/errors";
import { Channel, Notification, User } from "../../util/types";
import notificationModel from "../models/notification.model";
import userModel from "../models/users.model";
import { getChannel } from "./channels";
import { getUserByUsername } from "./users";

/**
 * funzione che crea una notifica e la inserisce in un utente
 * @param notification testo della notifica
 * @param channelName nome del canale
 * @param recipient nome del destinatario
 */
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

/**
 * funzione che ritorna tutte le notifiche di un utente
 * @param user
 * @returns Notification[]
 */
export async function getNotifications(user: User) {
  const notification: Notification[] = await notificationModel.find({
    _id: { $in: user.notification },
  });

  return notification;
}

/**
 * funzione che imposta una notifica come già letta
 * @param id id della notifica
 */
export async function setNotificationRead(id: string) {
  await notificationModel.updateOne({ _id: id }, { status: "read" });
}
