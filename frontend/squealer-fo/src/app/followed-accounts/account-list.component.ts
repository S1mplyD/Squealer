// account-list.component.ts
import { Component, OnInit } from '@angular/core';
import { User } from 'app/interfaces/account.interface';
import { Router } from '@angular/router';
import { FollowService } from 'app/services/follow.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss'],
})
export class AccountListComponent implements OnInit{
  accounts: User[] = [];
  username: string = '';
  private _unsubscribeAll: Subject<void> = new Subject<void>();
  constructor(private router: Router,
    private followService: FollowService) {}
    ngOnInit(): void {
        this.followService.getAllFollowers(this.username)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((res) => {
          this.accounts = res;
        });
    }
}
