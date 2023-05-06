import { Schema, model } from "mongoose";

const channelsSchema = new Schema(
  {
    name: { type: String, required: true, unique: true }, //Nome del canale (§canale, §CANALE, #keyword)
    squeals: { type: [String] }, //id dei messaggi con destinatario il canale
  },
  { collection: "channelsData" }
);

export const channelsModel = model("channelsData", channelsSchema);
