import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MediaMatcher } from '@angular/cdk/layout';
import { NavItem } from './nav-item';

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
  menu: NavItem [] = [
    {
      displayName: 'Home',
      iconName: 'desktop_windows',
      route: 'home',
      children: [
        {
          displayName: 'Browse Squeals',
          iconName: 'whatshot',
          route: '/browse'
        },
        {
          displayName: 'Write a new Squeal',
          iconName: 'share',
          route: '/new'
        }
      ]
    },
    {
      displayName: 'My Account',
      iconName: 'account_circle',
      children: [
          {
            displayName: 'Infos',
            iconName: 'search',
            route: '/infos'
          },
          {
            displayName: 'Settings',
            iconName: 'settings',
            route: '/settings'
          },
          {
            displayName: 'Notifications',
            iconName: 'notifications',
            route: '/notifications'
          },
          {
            displayName: 'Followed Accounts',
            iconName: 'people',
            route: '/following'
          },
        ]
      }
  ];

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
