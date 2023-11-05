import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from 'app/interfaces/account.interface';
import { SquealService } from 'app/services/squeal.service';
import { Squeal } from 'app/interfaces/squeal.interface';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { UsersService } from 'app/services/users.service';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
})
export class UserPageComponent implements OnInit, OnDestroy {
  account: User | undefined;
  loggedUser: User | undefined;
  answerers!: User[];
  recentPosts!: Squeal[];
  taggedPosts!: Squeal[];
   _reloadSubscription: Subscription = new Subscription;
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
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this._reloadSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
         // Trick the Router into believing it's last link wasn't previously loaded
         this.router.navigated = false;
      }
    });
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

  reloadPage(){
    this.router.navigate([this.router.url]);
 }


  follow() {
    this.usersService.follow(this.userName)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(res => {
      this._snackBar.open('You followed this user.', 'Close');
    });
    this.reloadPage();
  }


  unfollow() {
    this.usersService.unfollow(this.userName)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(res => {
      if (res === 'OK') this.isFollowed = false;
      this._snackBar.open('You unfollowed this user.', 'Close');
    });
    this.reloadPage();
  }

  ngOnDestroy(): void {
    if (this._reloadSubscription) {
      this._reloadSubscription.unsubscribe();
    }
  }
}
