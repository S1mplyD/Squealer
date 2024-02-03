import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthService } from './services/auth.service';
import { BreakpointObserver,Breakpoints, BreakpointState } from '@angular/cdk/layout';
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
  localLogged: string | null = sessionStorage.getItem('isLoggedIn');
  httpError!: HttpErrorResponse;
  mobileQuery: MediaQueryList;
  screenWidth!: number;
  username: string = '';
  plan: string | null = '';
  private _unsubscribeAll: Subject<void> = new Subject<void>();
  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private authService: AuthService,
    public responsive: BreakpointObserver) {
      this.mobileQuery = media.matchMedia('(max-width: 600px)');
      this._mobileQueryListener = () => changeDetectorRef.detectChanges();
      this.mobileQuery.addListener(this._mobileQueryListener);
  }

ngOnInit(): void {
  this.responsive
  .observe([Breakpoints.HandsetPortrait])
  .subscribe((state: BreakpointState) => {
    if (state.matches) {
      console.log('This is the Handset Portrait point at max-width: 599.98 px and portrait orientation.');
    }
  });
  this.authService.isAuthenticated()
  .pipe(takeUntil(this._unsubscribeAll))
  .subscribe((res) => {
    if (res.status !== '404') {
      this.isLoggedIn = true;
      this.username = res.username + '';
      sessionStorage.setItem('username', this.username)
      this.plan = res.plan + '';
    }
  });
}

clearSession(): void {
  sessionStorage.clear();
}

ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
