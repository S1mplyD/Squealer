import { SquealerError } from "../../util/errors";
import { updated } from "../../util/success";
import { Channel, Notification, User } from "../../util/types";
import notificationModel from "../models/notification.model";
import userModel from "../models/users.model";
import { checkChannelType, getChannel } from "./channels";
import { getUserByUsername } from "./users";

// TODO funzione per checkare se recipients è canale o utente
/**
 * funzione che crea una notifica e la inserisce in un utente
 * @param notification testo della notifica
 * @param channelName nome del canale
 * @param recipient nome del destinatario
 */
export async function createNotification(
  notification: string,
  recipient: string,
) {
  if (recipient) {
    const type = await checkChannelType(recipient);
    //Recipient è un utente
    if (type === "mention") {
      const user: User = await getUserByUsername(recipient);
      await userModel.updateOne(
        { _id: user._id },
        { $push: { notification: notification } },
      );
      return updated;
    } else {
      //recipient è un canale
      const channel: Channel = await getChannel(recipient);
      for (let i of channel.allowedRead) {
        await userModel.updateOne(
          { _id: i },
          { $push: { notification: notification } },
        );
      }
      return updated;
    }
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
