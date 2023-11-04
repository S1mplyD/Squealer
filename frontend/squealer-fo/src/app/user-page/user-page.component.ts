import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { User } from 'app/interfaces/account.interface';
import { SquealService } from 'app/services/squeal.service';
import { Squeal } from 'app/interfaces/squeal.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'app/services/users.service';
import { Subject, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
})
export class UserPageComponent implements OnInit {
  account: User | undefined;
  loggedUser: User | undefined;
  answerers!: User[];
  recentPosts!: Squeal[];
  taggedPosts!: Squeal[];
  userName!: string;
  isFollowed: boolean = false;
  un = localStorage.getItem('username');
  private _unsubscribeAll: Subject<void> = new Subject<void>();
  constructor(
    private squealService: SquealService,
    private datePipe: DatePipe,
    public activeRoute: ActivatedRoute,
    private usersService: UsersService,
    private router: Router,
    private _snackBar: MatSnackBar) {
    }

  ngOnInit() {
    this.usersService.getUserByUsername(String(this.activeRoute.snapshot.paramMap.get("username")))
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((res) => {
      this.account = res;
    });
    this.squealService.getSquealsForUsers(String(this.activeRoute.snapshot.paramMap.get("username")))
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((res) => {
      this.recentPosts = res;
    });
    console.log(String(this.activeRoute.snapshot.paramMap.get("username")));
    this.userName = String(this.activeRoute.snapshot.paramMap.get("username"));
    const loggedUser = localStorage.getItem('username');
    this.usersService.following(loggedUser ? loggedUser: '')
    .pipe(takeUntil(this._unsubscribeAll)).subscribe((res) => {
      for (const foll of res) {
        if (this.userName === foll.username) {
          this.isFollowed = true;
        }
      }
    });
  }

  formatDate(date: Date | undefined): string | null{
    return this.datePipe.transform(date, 'dd/MM/yyyy'); // Change the format pattern as per your requirement
  }

  follow() {
    this.usersService.follow(this.userName)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(res => {
      this._snackBar.open('You followed this user.', 'Close');
      let currentUrl = this.router.url;
      console.log(currentUrl);
      this.router.navigateByUrl('/following/' + res.username);
    });

  }

  unfollow() {
    this.usersService.unfollow(this.userName)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(res => {
      if (res === 'OK') this.isFollowed = false;
      this._snackBar.open('You unfollowed this user.', 'Close');
    });
    let currentUrl = this.router.url;
    this.router.navigateByUrl(currentUrl);
  }

}
