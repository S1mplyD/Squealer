import { Schema, model, Document } from "mongoose";

interface Notification {
  text: string;
  status: string;
}

interface NotificationDocument extends Notification, Document {}

const notificationSchema = new Schema<NotificationDocument>({
  text: { type: String, required: true },
  status: { type: String, required: true, default: "unread" },
});

const notificationModel = model<NotificationDocument>(
  "notificationData",
  notificationSchema
);

export default notificationModel;
