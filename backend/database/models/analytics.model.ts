import { Schema, model, Document } from "mongoose";

// analitiche
interface Analytics {
  squealId: string; //id dello squeal
  body: string;
  lat?: string;
  lng?: string;
  type: string;
  //Data di creazione dell'analitica (ogni giorno)
  date: Date;
  // numero di visualizzazione in una determinata data
  visuals: number;
  // numero di reazioni positive in una determinata data
  positiveReactions: number;
  // numero di reazioni negative in una determinata data
  negativeReactions: number;
  author: string; //username dell'autore dello squeal
}

interface AnalyticsDocument extends Document, Analytics {}

const analyticsSchema = new Schema<AnalyticsDocument>({
  squealId: { type: String, required: true, unique: true },
  body: { type: String },
  lat: { type: String },
  lng: { type: String },
  type: { type: String },
  date: { type: Date },
  visuals: { type: Number },
  positiveReactions: { type: Number },
  negativeReactions: { type: Number },
  author: { type: String, required: true },
});

const analyticsDataModel = model<AnalyticsDocument>(
  "analyticsData",
  analyticsSchema,
);

export default analyticsDataModel;
