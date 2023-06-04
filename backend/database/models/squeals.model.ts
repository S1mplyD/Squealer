import { Schema, model } from "mongoose";

const squealSchema = new Schema(
  {
    //Visualizzabili
    body: { type: String, required: true }, //Corpo del messaggio (testo, immagine (path), video (path), geolocazione (coordinate per open street map api))
    recipients: { type: [String], required: true }, //Destinatari (individuo, canale o keyword)
    date: { type: Date, required: true }, //Data e ora messaggio
    positiveReactions: { type: Number, default: 0 },
    negativeReactions: { type: Number, default: 0 },
    category: { type: String, required: true }, //Categorie (privato, pubblico, popolare, impopolare, controverso)
    channels: { type: [String] }, //Canali a cui è stato aggiunto dalla redazione
    //Non visualizzabili
    criticalMass: { type: Number, default: 0 }, //Massa critica (0,25 x visual)
    visual: { type: Number, default: 0, required: true }, //Visualizzazioni di account registrati e non
  },
  { collection: "squealData" }
);

export const squealModel = model("squealData", squealSchema);
