import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy{

  title = 'Squealer Front Office';
  showFiller = false;
  httpError!: HttpErrorResponse;
  mobileQuery: MediaQueryList;
  screenWidth!: number;
  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private authService: AuthService, private router: Router) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

logout(): void {
  this.authService.logout();
  localStorage.setItem('isLoggedIn', 'false');
  location.reload();

}

ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
