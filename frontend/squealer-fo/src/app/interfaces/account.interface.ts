export interface User {
  id: number;
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
  createdAt: Date;
  followersCount: number;
  followingCount: number;
}
