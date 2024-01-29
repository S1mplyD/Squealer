export interface User {
  _id: string;
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
