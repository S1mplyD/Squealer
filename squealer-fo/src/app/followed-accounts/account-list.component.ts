// account-list.component.ts
import { Component } from '@angular/core';
import { Account } from './account.interface';
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
      profileImage: 'path/to/johndoe-profile-image.jpg'
    },
    {
      id: 2,
      name: 'Jane Smith',
      username: 'janesmith',
      profileImage: 'path/to/janesmith-profile-image.jpg'
    },
    // Add more account objects as needed
  ];
  constructor(private router: Router) {

  }
}
