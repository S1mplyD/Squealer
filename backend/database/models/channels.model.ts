import { Schema, model, Document } from "mongoose";

interface Channel {
  name: string;
  squeals?: string[];
  type: string;
  allowedRead: string[];
  allowedWrite: string[];
  channelAdmins: string[];
}

interface ChannelDocument extends Channel, Document {}

const channelsSchema = new Schema<ChannelDocument>({
  name: { type: String, required: true, unique: true }, //Nome del canale (§canale, §CANALE, #keyword)
  squeals: { type: [String] }, //id dei messaggi con destinatario il canale
  //​@user, §userchannel, §ADMINCHANNEL, #keyword
  type: { type: String, required: true },
  allowedRead: { type: [String] }, //id degli utenti che possono accedere al canale
  allowedWrite: { type: [String] },
  channelAdmins: { type: [String], required: true }, //id degli admin del canale
});

const channelsModel = model<ChannelDocument>("channelsData", channelsSchema);

export default channelsModel;
