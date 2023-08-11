import { Injectable } from '@angular/core';
import { User } from 'app/interfaces/account.interface';
@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private accounts: User[] = [
    // Example tweets
    {
      id: 1,
      name: 'John Doe',
      username: 'johndoe',
      mail: '',
      dailyCharacters: 1000,
      weeklyCharacters: 10000,
      plan: 'base',
      monthlyCharacters: 1000,
      resetToken: '',
      profilePicture: undefined,
      followersCount: 1,
      followingCount: 10,
      createdAt: new Date()
    },
    {
      id: 2,
      name: 'Jane Smith',
      username: 'janesmith',
      mail: '',
      dailyCharacters: 1000,
      weeklyCharacters: 10000,
      plan: 'base',
      monthlyCharacters: 1000,
      resetToken: '',
      profilePicture: undefined,
      followersCount: 1,
      followingCount: 10,
      createdAt: new Date()
    },
    {
      id: 3,
      name: 'Lorenzo De Luise',
      username: 'delusional',
      mail: '',
      dailyCharacters: 1000,
      weeklyCharacters: 10000,
      plan: 'admin',
      monthlyCharacters: 1000,
      resetToken: '',
      profilePicture: '../../assets/delusional.jpg',
      followersCount: 1,
      followingCount: 10,
      createdAt: new Date()
    },
    {
      id: 4,
      name: 'Luca Bennati',
      username: 'simplyd',
      mail: '',
      dailyCharacters: 1000,
      weeklyCharacters: 10000,
      plan: 'admin',
      monthlyCharacters: 1000,
      resetToken: '',
      profilePicture: undefined,
      followersCount: 1,
      followingCount: 10,
      createdAt: new Date()
    },
    {
      id: 5,
      name: 'Fabio Vitali',
      username: 'fabiovitali',
      mail: '',
      dailyCharacters: 1000,
      weeklyCharacters: 10000,
      plan: 'base',
      monthlyCharacters: 1000,
      resetToken: '',
      profilePicture: '../../assets/vitali.jpg',
      followersCount: 1,
      followingCount: 10,
      createdAt: new Date()
    },
    {
      id: 6,
      name: 'Carcarlo Pravettoni',
      username: 'gialappas',
      mail: '',
      dailyCharacters: 1000,
      weeklyCharacters: 10000,
      plan: 'base',
      monthlyCharacters: 1000,
      resetToken: '',
      profilePicture: '../../assets/gialappas.jpg',
      followersCount: 1,
      followingCount: 10,
      createdAt: new Date()
    },
    {
      id: 7,
      name: 'Adrian LaSerieEvento',
      username: 'adrian',
      mail: '',
      dailyCharacters: 1000,
      weeklyCharacters: 10000,
      plan: 'base',
      monthlyCharacters: 1000,
      resetToken: '',
      profilePicture: '../../assets/trasferimento.jpg',
      followersCount: 1,
      followingCount: 10,
      createdAt: new Date()
    },
    {
      id: 8,
      name: 'Darian Befana',
      username: 'darian',
      mail: '',
      dailyCharacters: 1000,
      weeklyCharacters: 10000,
      plan: 'base',
      monthlyCharacters: 1000,
      resetToken: '',
      profilePicture: '../../assets/darian.webp',
      followersCount: 1,
      followingCount: 10,
      createdAt: new Date()
    },
    // Add more tweets as needed
  ];

  getAccounts(): User[] {
    // Sort tweets by timestamp in descending order
    return this.accounts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getSpecificAccount(username: string): User | undefined{
    let account: User | undefined;
    account = this.accounts.find(element => element.username == username);
    return account;
  }
}

