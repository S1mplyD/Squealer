import { SuccessCode, SuccessDescription } from "./success";

// nuovo tipo Squeal
export type Squeal = {
  body: string; //Corpo del messaggio (testo, immagine (path), video (path), geolocazione (coordinate per open street map api))
  recipients: string[]; //Destinatari (individuo, canale o keyword)
  date: Date; //Data e ora messaggio (creata in automatico)
  positiveReactions: number | undefined;
  negativeReactions: number | undefined;
  category: string; //Categorie (privato, pubblico, popolare, impopolare, controverso)
  channels: string[] | undefined; //Canali a cui è stato aggiunto dalla redazione
  author: string;
  //Non visualizzabili
  criticalMass: number | undefined; //Massa critica (0,25 x visual)
  visual: number | undefined; //Visualizzazioni di account registrati e non
  _id: string;
};

export type SquealGeo = {
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
  visual?: number;
  _id: string;
};

export type SquealMedia = {
  body: string;
  type: string;
  recipients: string[];
  date: Date;
  positiveReactions?: number;
  negativeReactions?: number;
  category: string;
  channels?: string[];
  author: string;
  criticalMass?: number;
  visual?: number;
  _id: string;
};

// nuovo tipo per squeal temporizzati
export type TimedSqueal = {
  body: string; //Corpo del messaggio (testo)
  recipients: string[]; //Destinatari (individuo, canale o keyword)
  date: Date; //Data e ora messaggio
  positiveReactions: number | undefined;
  negativeReactions: number | undefined;
  category: string; //Categorie (privato, pubblico, popolare, impopolare, controverso)
  channels: string[] | undefined; //Canali a cui è stato aggiunto dalla redazione
  author: string;
  //Non visualizzabili
  criticalMass: number | undefined; //Massa critica (0,25 x visual)
  visual: number | undefined; //Visualizzazioni di account registrati e non
  time: number | undefined; //tempo per i messaggi automatici (in ms)
  count: number | undefined;
  _id: string;
};

export type TimedSquealGeo = {
  //visualizzabili
  lat: string;
  lng: string;
  recipients: string[];
  date: Date;
  positiveReactions?: number;
  negativeReactions?: number;
  category: string;
  channels?: string[];
  author: string;
  //non visualizzabili
  criticalMass?: number;
  visual?: number;
  time?: number;
  count?: number;
  _id: string;
};

//tipo per squeal di testo automatico
export type AutomatedSqueal = {
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
  _id: string;
};

// tipo per squeal geo automatici
export type AutomatedGeoSqueal = {
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
  originalSqueal: string;
  _id: string;
};

// nuovo tipo utente
export type User = {
  _id: string; // mongodb id
  name: string; //Nome completo (nome e cognome)
  username: string; // Username dell'utente
  mail: string; // Mail dell'utente
  serviceId: number | undefined; // id del servizio di login usato (E.s.: Google)
  password: string | undefined;
  profilePicture: string | undefined; // Immagine profilo
  dailyCharacters: number; //Caratteri giornalieri
  weeklyCharacters: number; //Caratteri settimanali
  monthlyCharacters: number; //Caratteri mensili
  plan: string; //Tipo di account (base, [verificato], professional, journalist, moderatore)
  SMM: string | undefined; // SMM dell´account, modificabile solo se l'account è professional
  managedAccounts: string[]; //Account gestiti da un SMM, modificabile se il plan è pro (username)
  resetToken: string;
  followers?: string[];
  following?: string[];
  createdAt: Date;
  status: string;
  blockedFor: number;
};

// nuovo tipo canali
export type Channel = {
  _id: string; // mongodb id
  name: string; // nome del canale
  squeals: string[]; // id degli squeals appartenenti al canale
  allowedRead: string[];
  allowedWrite: string[];
  type: string;
  channelAdmins: string[];
};

// export type Error = {
//   message: ErrorDescriptions;
//   code: ErrorCodes;
// };

export type Success = {
  message: SuccessDescription;
  code: SuccessCode;
};

// nuovo tipo per intervalli
export type Interval = {
  timeout: NodeJS.Timeout;
  id: string; //id squeal
};

export type Analytic = {
  _id: string;
  squealId: string;
  dates: Date[];
  visuals: number[];
  positiveReactions: number[];
  negativeReactions: number[];
  author: string;
};
