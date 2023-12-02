import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{

  title = 'Squealer Front Office';
  showFiller = false;
  isLoggedIn: boolean = false;
  localLogged: string | null = localStorage.getItem('isLoggedIn');
  httpError!: HttpErrorResponse;
  mobileQuery: MediaQueryList;
  screenWidth!: number;
  username: string = '';
  plan: string | null = '';
  private _unsubscribeAll: Subject<void> = new Subject<void>();
  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private authService: AuthService, private router: Router) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    localStorage.setItem('isLoggedIn', 'false');
  }
  ngOnInit(): void {
    this.authService.isAuthenticated()
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((res) => {
      localStorage.setItem('isLoggedIn', 'true');
      if (res.status !== '404') {
        this.isLoggedIn = true;
        this.username = res.username + '';
        this.plan = res.plan + '';
      }
    });
  }

logout(): void {
  this.authService.logout()
  .pipe(takeUntil(this._unsubscribeAll))
  .subscribe((res) => {
    this.isLoggedIn = false;
  });
  location.reload();
}

ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
