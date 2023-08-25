import { Component, OnInit } from '@angular/core';
import { Squeal } from 'app/interfaces/squeal.interface';
import { SquealService } from 'app/services/squeal.service';
import { DatePipe } from '@angular/common';
import { User } from 'app/interfaces/account.interface';
import { AccountService } from 'app/services/account.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-new-squeal',
  templateUrl: './new-squeals.component.html',
  styleUrls: ['./new-squeals.component.scss'],
})
export class NewSquealsComponent implements OnInit {
  squeals: Squeal[] = [];
  accounts: User[] = [];

  newSqueal: Squeal = {
    author: '', body: '',
    date: new Date(),
    recipients: [],
    category: ''
  };

  isLoggedIn: boolean = false;
  username: string = '';
  plan: string | null = '';
  isPostFormOpen: boolean = false;
  isPopupOpen = false;

  constructor(
    private squealService: SquealService,
    private datePipe: DatePipe,
    private accountService: AccountService) {}

  ngOnInit(): void {
    this.squealService.getAllTextSqueals().subscribe(res=> this.squeals = res);
    this.accounts = this.accountService.getAccounts();
    this.plan = localStorage.getItem('plan');
    if (localStorage.getItem('isLoggedIn') === 'false') {
      this.isLoggedIn = false;
    } else if (localStorage.getItem('isLoggedIn') === 'true') {
      this.isLoggedIn = true;
    }
    if (localStorage.getItem('username')) {
      this.username = localStorage.getItem('username') + '';
    }

  }



  openPopup(): void {
    this.isPopupOpen = true;
  }

  closePopup(): void {
    this.isPopupOpen = false;
  }

  formatDate(date: Date): string | null{
    return this.datePipe.transform(date, 'dd-MM-yyyy'); // Change the format pattern as per your requirement
  }

  openPostForm() {
    this.isPostFormOpen = true;
  }

  closePostForm() {
    this.isPostFormOpen = false;
    this.newSqueal = {  author: '', body: '', date: new Date(),  recipients: [], category: '' };
  }

  addPost(): void {
    const newId = this.squeals.length + 1;
    const newSqueal: Squeal = {
      author: this.username,
      body: this.newSqueal.body,
      date: new Date(),
      recipients: [],
      category: ''
    };

    this.squeals.unshift(newSqueal); // Add the new post at the beginning of the array
    this.newSqueal.body = ''; // Clear the form field
    this.isPostFormOpen = false;

  }
}
