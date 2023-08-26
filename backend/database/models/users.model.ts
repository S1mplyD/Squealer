import { Schema, model, Document } from "mongoose";

interface User {
  name: string;
  username: string;
  mail: string;
  serviceId?: number;
  password?: string;
  profilePicture?: string;
  dailyCharacters: number;
  weeklyCharacters: number;
  monthlyCharacters: number;
  plan: string;
  SMM?: string;
  managedAccounts?: string[];
  resetToken: string;
  followers?: string[];
  following?: string[];
  createdAt: Date;
  status: string;
  blockedFor: number;
}

interface UserDocument extends User, Document {}

const userSchema = new Schema<UserDocument>({
  name: { type: String, required: true }, //Nome completo (nome e cognome)
  username: { type: String, required: true, unique: true }, // Username dell'utente
  mail: { type: String, required: true, unique: true }, // Mail dell'utente
  serviceId: { type: Number }, //Id del servizio di login usato (E.s.: Google)
  password: { type: String },
  profilePicture: { type: String }, // Immagine profilo
  dailyCharacters: { type: Number, required: true, default: 300 }, //Caratteri giornalieri
  weeklyCharacters: { type: Number, required: true, default: 2000 }, //Caratteri settimanali
  monthlyCharacters: { type: Number, required: true, default: 7500 }, //Caratteri mensili
  plan: { type: String, default: "base", required: true }, //Tipo di account (base, [verificato], professional, journalist, admin)
  SMM: { type: String }, // SMM dell´account, modificabile solo se l'account è professional
  managedAccounts: { type: [String] }, //Account gestiti da un SMM, modificabile se il plan è pro (usermane)
  resetToken: { type: String, default: "" },
  followers: { type: [String] },
  following: { type: [String] },
  createdAt: { type: Date, required: true },
  status: { type: String, default: "normal" }, //normal, ban, block
  blockedFor: { type: Number },
  // dailyExtraCharacters: { type: Number, required: true, default: 300 }, //Caratteri giornalieri
  // weeklyExtraCharacters: { type: Number, required: true, default: 2000 }, //Caratteri settimanali
  // monthlyExtraCharacters: { type: Number, required: true, default: 7500 }, //Caratteri mensili
});

const userModel = model<UserDocument>("userData", userSchema);

export default userModel;
