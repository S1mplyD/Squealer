// account-list.component.ts
import { Component } from '@angular/core';
import { Account } from 'app/interfaces/account.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss'],
})
export class AccountListComponent {
  accounts: Account[] = [
    {
      id: 1,
      name: 'John Doe',
      username: 'johndoe',
      profileImage: null,
      followerCount: 1,
      followingCount: 10,
      createdAt: new Date()
    },
    {
      id: 2,
      name: 'Jane Smith',
      username: 'janesmith',
      profileImage: null,
      followerCount: 1,
      followingCount: 10,
      createdAt: new Date()
    },
    {
      id: 3,
      name: 'Lorenzo De Luise',
      username: 'delusional',
      profileImage: '../../assets/delusional.jpg',
      followerCount: 1,
      followingCount: 10,
      createdAt: new Date()
    },
    {
      id: 4,
      name: 'Luca Bennati',
      username: 'simplyd',
      profileImage: null,
      followerCount: 1,
      followingCount: 10,
      createdAt: new Date()
    },
    {
      id: 5,
      name: 'Fabio Vitali',
      username: 'fabiovitali',
      profileImage: '../../assets/vitali.jpg',
      followerCount: 1,
      followingCount: 10,
      createdAt: new Date()
    },
    {
      id: 6,
      name: 'Carcarlo Pravettoni',
      username: 'gialappas',
      profileImage: '../../assets/gialappas.jpg',
      followerCount: 1,
      followingCount: 10,
      createdAt: new Date()
    },
    {
      id: 7,
      name: 'Adrian LaSerieEvento',
      username: 'adrian',
      profileImage: '../../assets/trasferimento.jpg',
      followerCount: 1,
      followingCount: 10,
      createdAt: new Date()
    },
    {
      id: 8,
      name: 'Darian Befana',
      username: 'darian',
      profileImage: '../../assets/darian.webp',
      followerCount: 1,
      followingCount: 10,
      createdAt: new Date()
    },
    // Add more account objects as needed
  ];
  constructor(private router: Router) {

  }
}
