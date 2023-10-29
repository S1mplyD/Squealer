import { SuccessCode, SuccessDescription } from "./success";

// nuovo tipo Squeal
export type Squeal = {
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
    notification: string[];
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

export type Success = {
    message: SuccessDescription;
    code: SuccessCode;
};

// nuovo tipo per intervalli
export type Interval = {
    timeout: NodeJS.Timeout;
    id: string; //id squeal o utente
};

// nuovo tipo per intervalli
export type Timeout = {
    timeout: NodeJS.Timeout;
    username: string; //id squeal o utente
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

export type Notification = {
    text: string;
    status: string;
    _id: string;
};
