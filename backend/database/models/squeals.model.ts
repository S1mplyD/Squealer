import { Schema, model, Document } from "mongoose";

interface Squeal {
  body: string;
  lng?: string;
  lat?: string;
  recipients: string[];
  date: Date;
  positiveReactions?: string[];
  negativeReactions?: string[];
  category: string;
  channels: string[];
  author: string;
  criticalMass?: number;
  visual?: number;
  type: string;
  time?: number;
  count?: number;
  originalSqueal?: string;
  responses?: string[];
}

interface SquealDocument extends Squeal, Document {}

const squealSchema = new Schema<SquealDocument>({
  //Visualizzabili
  body: { type: String, required: true }, //Corpo del messaggio (testo o url)
  lat: { type: String },
  lng: { type: String },
  recipients: { type: [String], required: true }, //Destinatari (individuo, canale o keyword)
  date: { type: Date, required: true }, //Data e ora messaggio
  positiveReactions: { type: [String] },
  negativeReactions: { type: [String] },
  category: { type: String, required: true }, //Categorie (privato, pubblico, popolare, impopolare, controverso)
  channels: { type: [String] }, //Canali a cui è stato aggiunto dalla redazione
  author: { type: String, required: true },
  //Non visualizzabili
  criticalMass: { type: Number, default: 0 }, //Massa critica (0,25 x visual)
  visual: { type: Number, default: 0 }, //Visualizzazioni di account registrati e non
  type: { type: String, required: true }, //text, media, geo, timed, auto
  time: { type: Number },
  count: { type: Number },
  originalSqueal: { type: String },
  responses: { type: [String] }, //id degli squeal in risposta a questo squeal
});

const squealModel = model<SquealDocument>("squealData", squealSchema);

export default squealModel;
