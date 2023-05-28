// nuovo tipo Squeal
export type Squeal = {
  body: string; //Corpo del messaggio (testo, immagine (path), video (path), geolocazione (coordinate per open street map api))
  recipients: string[]; //Destinatari (individuo, canale o keyword)
  date: Date; //Data e ora messaggio
  positiveReactions: number | undefined;
  negativeReactions: number | undefined;
  category: string; //Categorie (privato, pubblico, popolare, impopolare, controverso)
  channels: string[] | undefined; //Canali a cui è stato aggiunto dalla redazione
  //Non visualizzabili
  criticalMass: number | undefined; //Massa critica (0,25 x visual)
  visual: number | undefined; //Visualizzazioni di account registrati e non
  _id: string;
};

// nuovo tipo per squeal temporizzati
export type TimedSqueal = {
  body: string; //Corpo del messaggio (testo, immagine (path), video (path), geolocazione (coordinate per open street map api))
  recipients: string[]; //Destinatari (individuo, canale o keyword)
  date: Date; //Data e ora messaggio
  positiveReactions: number | undefined;
  negativeReactions: number | undefined;
  category: string; //Categorie (privato, pubblico, popolare, impopolare, controverso)
  channels: string[] | undefined; //Canali a cui è stato aggiunto dalla redazione
  //Non visualizzabili
  criticalMass: number | undefined; //Massa critica (0,25 x visual)
  visual: number | undefined; //Visualizzazioni di account registrati e non
  time: number | undefined; //tempo per i messaggi automatici (in ms)
  intervalId: number | undefined; // id dell'intervallo
  count: number | undefined;
  _id: string;
};

// nuovo tipo per gli errori
export type Errors = {
  message: string;
  code: Error;
};

// enum per il codice degli errori
export enum Error {
  cannot_create = 1,
  non_existent = 2,
}
