// account-list.component.ts
import { Component, OnInit } from '@angular/core';
import { User } from 'app/interfaces/account.interface';
import { Router } from '@angular/router';
import { FollowService } from 'app/services/follow.service';
import { Subject, takeUntil } from 'rxjs';
import { UsersService } from 'app/services/users.service';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss'],
})
export class AccountListComponent implements OnInit{
  accounts: User[] = [];
  username: string = '';
  private _unsubscribeAll: Subject<void> = new Subject<void>();
  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UsersService) {}
    ngOnInit(): void {
      this.authService.isAuthenticated()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        this.userService.following(res.username)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(resp => this.accounts = resp)
      })
    }
}
