import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { User } from 'app/interfaces/account.interface';
import { SquealService } from 'app/services/squeal.service';
import { Squeal } from 'app/interfaces/squeal.interface';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from 'app/services/users.service';
import { Subject, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LatLng, TileLayer } from 'leaflet';
import * as L from 'leaflet';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
})
export class UserPageComponent implements OnInit {
  account: User | undefined;
  loggedUser: User | undefined;
  users!: User[];
  fileName = '';
  recentPosts!: Squeal[];
  taggedPosts!: Squeal[];
  userName!: string;
  isFollowed: boolean = false;
  mapOpened: string[] = [];
  isChangePasswordOpened: boolean = false;
  changePasswordForm: FormGroup;
  oldPassword: string = '';
  newPassword: string = '';
  un = sessionStorage.getItem('username');
  private _unsubscribeAll: Subject<void> = new Subject<void>();
  constructor(
    private squealService: SquealService,
    private datePipe: DatePipe,
    public activeRoute: ActivatedRoute,
    private usersService: UsersService,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
  ) {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.usersService
      .getUserByUsername(
        String(this.activeRoute.snapshot.paramMap.get('username')),
      )
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        this.account = res;
        this.usersService.getUserByUsername(this.un || '').subscribe((res2) => {
          console.log(res2);
          console.log(this.account);
          if (this.account?.followers?.includes(res2._id)) {
            console.log('followed');
            this.isFollowed = true;
          }
        });
      });
    this.squealService
      .getSquealsForUsers(
        String(this.activeRoute.snapshot.paramMap.get('username')),
      )
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        this.recentPosts = res;
      });
    this.userName = String(this.activeRoute.snapshot.paramMap.get('username'));
    this.squealService
      .getAllSqueals()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        this.taggedPosts = res;
      });
    this.usersService
      .getAllUsers()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response) => {
        this.users = response;
      });
    this.userName = String(this.activeRoute.snapshot.paramMap.get('username'));
  }

  formatDate(date: Date | undefined): string | null {
    return this.datePipe.transform(date, 'dd/MM/yyyy'); // Change the format pattern as per your requirement
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.fileName = file.name;

      const formData = new FormData();

      formData.append('file', file);

      this.usersService
        .changeProfilePicture(formData)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((res) => {
          console.log(res);
          if (this.account) {
            this.usersService
              .updateProfilePicture(this.account.username, res)
              .pipe(takeUntil(this._unsubscribeAll))
              .subscribe((res) => console.log(res));
          }
        });
    }
  }

  reloadPage() {
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }

  follow() {
    this.usersService
      .follow(String(this.activeRoute.snapshot.paramMap.get('username')))
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        this.isFollowed = true;
        this._snackBar.open('You followed this user.', 'Close', {
          duration: 3000,
        });
      });
    this.reloadPage();
  }

  unfollow() {
    this.usersService
      .unfollow(String(this.activeRoute.snapshot.paramMap.get('username')))
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        if (res === 'OK') this.isFollowed = false;
        this._snackBar.open('You unfollowed this user.', 'Close', {
          duration: 3000,
        });
      });
    this.reloadPage();
  }

  createOptions(
    lat: string,
    lng: string,
  ): { center: LatLng; layers: TileLayer[]; zoom: number } {
    return {
      layers: [
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: '...',
        }),
      ],
      zoom: 13,
      center: L.latLng(+lat, +lng),
    };
  }

  checkMapOpened(id: string): boolean {
    return this.mapOpened.includes(id);
  }

  generateSquealMap(id: string) {
    if (!this.mapOpened.includes(id)) {
      this.mapOpened.push(id);
    }
  }

  closeMap(id: string) {
    if (this.mapOpened.includes(id)) {
      this.mapOpened = this.mapOpened.filter((el) => el !== id);
    }
  }

  addMarker(map: L.Map, lat: string, lng: string) {
    L.marker([+lat, +lng], {
      icon: L.icon({
        ...L.Icon.Default.prototype.options,
        iconUrl: 'assets/marker-icon.png',
        iconRetinaUrl: 'assets/marker-icon-2x.png',
        shadowUrl: 'assets/marker-shadow.png',
      }),
    }).addTo(map);
  }

  toggleChangePassword() {
    this.isChangePasswordOpened = !this.isChangePasswordOpened;
  }

  changePassword() {
    this.usersService
      .changePassword(this.oldPassword, this.newPassword)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        if (res === 'OK') this.isChangePasswordOpened = false;
        this._snackBar.open('Password updated correctly', 'Close', {
          duration: 3000,
        });
      });
    this.reloadPage();
  }
}
