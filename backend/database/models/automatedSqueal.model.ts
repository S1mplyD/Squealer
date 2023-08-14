import { Schema, model, Document } from "mongoose";

// squeal temporizzati pubblicati
interface AutomatedSqueal {
  body: string;
  recipients: string[];
  date: Date;
  positiveReactions?: number;
  negativeReactions?: number;
  category: string;
  channels?: string[];
  author: string;
  criticalMass?: number;
  visual: number;
  originalSqueal: string;
}

interface AutomatedSquealDocument extends Document, AutomatedSqueal {}

const automatedSquealSchema = new Schema<AutomatedSquealDocument>({
  //Visualizzabili
  body: { type: String, required: true }, //Corpo del messaggio (testo)
  recipients: { type: [String], required: true }, //Destinatari (individuo, canale o keyword)
  date: { type: Date, required: true }, //Data e ora messaggio
  positiveReactions: { type: Number },
  negativeReactions: { type: Number },
  category: { type: String, required: true }, //Categorie (privato, pubblico, popolare, impopolare, controverso)
  channels: { type: [String] }, //Canali a cui è stato aggiunto dalla redazione
  author: { type: String }, // id dell'autore
  //Non visualizzabili
  criticalMass: { type: Number }, //Massa critica (0,25 x visual)
  visual: { type: Number, default: 0, required: true }, //Visualizzazioni di account registrati e non
  // valori temporizzazione
  originalSqueal: { type: String, required: true },
});

const automatedSquealModel = model<AutomatedSquealDocument>(
  "automatedSquealData",
  automatedSquealSchema,
);

export default automatedSquealModel;
