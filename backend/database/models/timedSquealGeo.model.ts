import { Schema, model, Document } from "mongoose";
// squeal temporizzato di partenza
interface TimedSquealGeo {
  lat: string;
  lng: string;
  recipients: string[];
  date: Date;
  positiveReactions?: number;
  negativeReactions?: number;
  category: string;
  channels?: string[];
  author: string;
  criticalMass?: number;
  visual: number;
  time?: number;
  count?: number;
}

interface TimedSquealGeoDocument extends TimedSquealGeo, Document {}

const timedSquealGeoSchema = new Schema<TimedSquealGeoDocument>({
  //Visualizzabili
  lat: { type: String, required: true },
  lng: { type: String, required: true },
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
  time: { type: Number, default: 0 }, //tempo per i messaggi automatici (in ms)
  count: { type: Number }, // contatore di quante volte questo squeal è stato pubblicato
});

const timedSquealGeoModel = model<TimedSquealGeoDocument>(
  "timedSquealGeoData",
  timedSquealGeoSchema,
);

export default timedSquealGeoModel;
