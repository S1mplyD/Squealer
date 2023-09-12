import { Component, OnInit } from '@angular/core';
import { Squeal } from 'app/interfaces/squeal.interface';
import { SquealService } from 'app/services/squeal.service';
import { DatePipe } from '@angular/common';
import { User } from 'app/interfaces/account.interface';
import { UsersService } from 'app/services/users.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-new-squeal',
  templateUrl: './new-squeals.component.html',
  styleUrls: ['./new-squeals.component.scss'],
})
export class NewSquealsComponent implements OnInit {
  squeals: Squeal[] = [];
  accounts: User[] = [];

  newSqueal: Squeal = {
    author: '',
    body: '',
    date: new Date(),
    recipients: [],
    category: ''
  };

  isLoggedIn: boolean = false;
  username: string = '';
  plan: string | null = '';
  isPostFormOpen: boolean = false;
  isPopupOpen = false;
  private _unsubscribeAll: Subject<void> = new Subject<void>();
  constructor(
    private squealService: SquealService,
    private datePipe: DatePipe,
    private userService: UsersService) {}

  ngOnInit(): void {
    this.loadSqueals();
    this.userService.getAllUsers()
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((res) => {
      this.accounts = res;
    });
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

  loadSqueals(): void {
    this.squealService.getAllTextSqueals()
    .pipe(takeUntil(this._unsubscribeAll)).
    subscribe((res) => {
      this.squeals = res;
    });
  }

  closePostForm() {
    this.isPostFormOpen = false;
    this.newSqueal = {  author: '', body: '', date: new Date(),  recipients: [], category: '' };
  }

  addPost(): void {
    const squeal: Squeal = {
      author: this.username,
      body: this.newSqueal.body,
      date: new Date(),
      recipients: [],
      channels: [],
      category: 'public'
    };
    this.squealService.addTextSqueal(squeal)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((res) => {
      if (res) {
        this.loadSqueals();
      }
    });
    this.closePopup();
  }
}
