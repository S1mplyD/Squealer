import { Component, OnInit } from '@angular/core';
import { Squeal } from 'app/interfaces/squeal.interface';
import { SquealService } from 'app/services/squeal.service';
import { DatePipe } from '@angular/common';
import { User } from 'app/interfaces/account.interface';
import { UsersService } from 'app/services/users.service';
import { Subject, takeUntil } from 'rxjs';
import { MediaService } from 'app/services/media.service';
import { AuthService } from 'app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as L from 'leaflet';
import { LatLng, TileLayer } from 'leaflet';
import axios from 'axios';

@Component({
  selector: 'app-new-squeal',
  templateUrl: './new-squeals.component.html',
  styleUrls: ['./new-squeals.component.scss'],
})
export class NewSquealsComponent implements OnInit {
  squeals: Squeal[] = [];
  fileNameSqueal = '';
  fileNameAnswer = '';
  accounts: User[] = [];
  squealType: string = 'text';
  dailyChars: number = 9999;
  squealSubType: boolean = false;
  selectedFile?: File = undefined;
  upvote: number = 0;
  downvote: number = 0;
  mapOpened: string[] = [];
  selectedRef: string = '';
  selectedFileName: string = '';
  responses: Squeal[] = [];
  recipients: string = '';
  answeredId: string = '';
  initialMarker = {
    position: { lat: 44.35527821160296, lng: 11.260986328125 },
    draggable: true,
  };
  loc = {
    lat: 44.35527821160296,
    lng: 11.260986328125,
  };
  newSqueal: Squeal = {
    author: '',
    body: '',
    date: new Date(),
    recipients: [],
    category: '',
    channels: [],
    type: '',
    _id: '',
    originalSqueal: '',
    lat: this.initialMarker.position.lat + '',
    lng: this.initialMarker.position.lng + '',
    locationName: 'Marzabotto, Bologna, Emilia-Romagna, Italy',
    time: 0,
  };

  newAnswer: Squeal = {
    author: '',
    body: '',
    date: new Date(),
    recipients: [],
    category: '',
    channels: [],
    type: '',
    _id: '',
    originalSqueal: '',
    lat: this.initialMarker.position.lat + '',
    lng: this.initialMarker.position.lng + '',
    locationName: '',
    time: 0,
  };

  isLoggedIn: boolean = false;
  username: string = '';
  plan: string | null = '';
  isPostFormOpen: boolean = false;
  isPopupOpen = false;
  isAnswerOpen = false;
  map!: L.Map;
  map2!: L.Map;
  markers: L.Marker[] = [];
  options = {
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '...',
      }),
    ],
    zoom: 5,
    center: L.latLng(44.35527821160296, 11.260986328125),
  };
  options2 = {
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '...',
      }),
    ],
    zoom: 5,
  };

  private _unsubscribeAll: Subject<void> = new Subject<void>();

  constructor(
    private squealService: SquealService,
    private datePipe: DatePipe,
    private userService: UsersService,
    private mediaService: MediaService,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
  ) {}

  createOptions(
    lat: string,
    lng: string,
    id: string,
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

  ngOnInit(): void {
    if (sessionStorage.getItem('isLoggedIn') == 'true') {
      this.isLoggedIn = true;
    } else if (sessionStorage.getItem('isLoggedIn') == 'false') {
      this.isLoggedIn = false;
    }
    this.userService
      .getAllUsers()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        this.accounts = res;
        for (const acc of this.accounts) {
          this.userService
            .getProfilePicture(acc.username)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
              acc.profilePicture = res;
            });
        }
      });
    this.authService
      .isAuthenticated()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        if (res && res !== 'Not authenticated') {
          this.isLoggedIn = true;
          this.username = res.username + '';
          this.plan = res.plan + '';
          this.dailyChars = res.dailyCharacters;
        } else if (res && res === 'Not authenticated') {
          this.isLoggedIn = false;
        }
      });
    console.log(this.isLoggedIn);
    this.loadSqueals();
    this.getPosition();
  }

  onFileSelectedSqueal(event: any) {
    console.log(event);
    const file: File = event.target.files[0];

    if (file) {
      this.fileNameSqueal = file.name;

      const formData = new FormData();

      formData.append('file', file);

      this.userService
        .changeProfilePicture(formData)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((res) => {
          this.newSqueal.body = res;
        });
    }
  }

  onFileSelectedAnswer(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.fileNameAnswer = file.name;

      const formData = new FormData();

      formData.append('file', file);

      this.userService
        .changeProfilePicture(formData)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((res) => {
          this.newAnswer.body = res;
        });
    }
  }

  initMarkers() {
    const data = this.initialMarker;
    if ('geolocation' in navigator) {
      //geolocazione disponibile
      navigator.geolocation.getCurrentPosition(async (pos) => {
        data.position = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        this.loc.lat = pos.coords.latitude;
        this.loc.lng = pos.coords.longitude;
        let reverseGeocodeResult = await this.reverseGeocode(
          pos.coords.latitude,
          pos.coords.longitude,
        );
        this.newSqueal.locationName =
          reverseGeocodeResult.features[0].properties.geocoding.city +
          ', ' +
          reverseGeocodeResult.features[0].properties.geocoding.county +
          ', ' +
          reverseGeocodeResult.features[0].properties.geocoding.state +
          ', ' +
          reverseGeocodeResult.features[0].properties.geocoding.country;
      });
    }
    const marker = this.generateMarker(data, 0);
    marker
      .addTo(this.map)
      .bindPopup(`<b>${data.position.lat},  ${data.position.lng}</b>`);
    this.map.panTo(data.position);
    this.markers.push(marker);
  }

  generateSquealMap(lat: string, long: string, id: string) {
    if (!this.mapOpened.includes(id)) {
      this.mapOpened.push(id);
    }
  }

  addMarker(map: L.Map, lat: string, lng: string, id: string) {
    L.marker([+lat, +lng], {
      icon: L.icon({
        ...L.Icon.Default.prototype.options,
        iconUrl: 'assets/marker-icon.png',
        iconRetinaUrl: 'assets/marker-icon-2x.png',
        shadowUrl: 'assets/marker-shadow.png',
      }),
    }).addTo(map);
  }

  getCoords() {
    console.log(this.loc);
    return this.loc;
  }

  getPosition() {
    console.log('here');
    if ('geolocation' in navigator) {
      //geolocazione disponibile
      navigator.geolocation.getCurrentPosition(async (pos) => {
        this.loc.lat = pos.coords.latitude;
        this.loc.lng = pos.coords.longitude;
        this.newSqueal.lat = pos.coords.latitude + '';
        this.newSqueal.lng = pos.coords.longitude + '';
        let reverseGeocodeResult = await this.reverseGeocode(
          pos.coords.latitude,
          pos.coords.longitude,
        );
        this.newSqueal.locationName =
          reverseGeocodeResult.features[0].properties.geocoding.city +
          ', ' +
          reverseGeocodeResult.features[0].properties.geocoding.county +
          ', ' +
          reverseGeocodeResult.features[0].properties.geocoding.state +
          ', ' +
          reverseGeocodeResult.features[0].properties.geocoding.country;
      });
    }
  }
  closeMap(id: string) {
    if (this.mapOpened.includes(id)) {
      this.mapOpened = this.mapOpened.filter((el) => el !== id);
    }
  }

  checkMapOpened(id: string): boolean {
    return this.mapOpened.includes(id);
  }

  generateMarker(data: any, index: number) {
    return L.marker(data.position, {
      icon: L.icon({
        ...L.Icon.Default.prototype.options,
        iconUrl: 'assets/marker-icon.png',
        iconRetinaUrl: 'assets/marker-icon-2x.png',
        shadowUrl: 'assets/marker-shadow.png',
      }),
      draggable: data.draggable,
    })
      .on('click', (event) => this.markerClicked(event, index))
      .on('dragend', (event) => this.markerDragEnd(event, index));
  }

  onMapReady($event: L.Map) {
    this.map = $event;
    this.initMarkers();
  }

  async reverseGeocode(lat: number, lng: number) {
    console.log('reverse');
    console.log(lat, lng);
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=geocodejson&lat=${lat}&lon=${lng}`,
    );
    console.log(response);
    return response.data;
  }

  mapClicked($event: any) {
    this.initialMarker.position.lat = $event.latlng.lat;
    this.initialMarker.position.lng = $event.latlng.lng;
    this.newSqueal.lat = $event.latlng.lat;
    this.newSqueal.lng = $event.latlng.lng;
    console.log($event.latlng.lat, $event.latlng.lng);
  }

  markerClicked($event: any, index: number) {
    console.log($event.latlng.lat, $event.latlng.lng);
  }

  markerDragEnd($event: any, index: number) {
    console.log($event.target.getLatLng());
  }

  openPopup(): void {
    this.newSqueal.time = 0;
    this.squealSubType = false;
    this.newSqueal.body = '';
    this.isPopupOpen = true;
  }

  closePopup(): void {
    this.isPopupOpen = false;
  }

  openAnswer(id: string): void {
    this.answeredId = id;
    this.isAnswerOpen = true;
  }

  closeAnswer(): void {
    this.answeredId = '';
    this.isAnswerOpen = false;
  }

  formatDate(date: Date): string | null {
    return this.datePipe.transform(date, 'dd-MM-yyyy'); // Change the format pattern as per your requirement
  }

  formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return `${value}`;
  }

  openPostForm() {
    this.isPostFormOpen = true;
  }

  openAnswerForm() {
    this.isPostFormOpen = true;
  }

  loadSqueals(): void {
    console.log(this.isLoggedIn);
    if (this.isLoggedIn) {
      this.squealService
        .getSquealsLogin()
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((res) => {
          this.squeals = res;
          for (const squeal of this.squeals) {
            if (this.responses.length === 0) {
              this.loadAnswers(squeal._id);
            }
          }
        });
    } else {
      this.squealService
        .getSquealsNoLogin()
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((res) => {
          this.squeals = res;
          for (const squeal of this.squeals) {
            if (this.responses.length === 0) {
              this.loadAnswers(squeal._id);
            }
          }
        });
    }
  }

  loadAnswers(id: string): void {
    this.responses = [];
    this.squealService
      .getResponses(id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((resp) => {
        for (const answer of resp) {
          this.responses.push(answer);
        }
      });
  }

  closePostForm() {
    this.isPostFormOpen = false;
    this.newSqueal = {
      _id: '',
      author: '',
      body: '',
      date: new Date(),
      recipients: [],
      category: '',
      type: '',
      channels: [],
      originalSqueal: '',
    };
  }

  closeAnswerForm() {
    this.isPostFormOpen = false;
    this.newAnswer = {
      _id: '',
      author: '',
      body: '',
      date: new Date(),
      recipients: [],
      category: '',
      type: '',
      channels: [],
      originalSqueal: '',
    };
  }

  uploadFiles(): void {
    if (this.selectedFile) {
      this.upload(this.selectedFile);
    }
    this.newSqueal.body = this.selectedFileName;
  }

  upload(file: File): void {
    if (file) {
      this.mediaService
        .postMediaFile(file)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((res) => (this.selectedFileName = res));
    }
  }

  selectFiles(event: any): void {
    this.selectedFileName = '';
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFile);
      this.selectedFileName = this.selectedFile.name;
    }
  }

  getChannels(body: string): string[] {
    const channels: string[] = [];
    body = body.replace('.', ' ');
    body = body.replace(',', ' ');
    body = body.replace(':', ' ');
    body = body.replace(';', ' ');
    const words: string[] = body.split(' ');
    for (const word of words) {
      if (word[0] === '@') channels.push(word);
      if (word[0] === '§') channels.push(word);
      if (word[0] === '#') channels.push(word);
    }
    return channels;
  }

  getRecipients(rec: string): string[] {
    rec.replace('/s+/g', '');
    return rec.split(',');
  }

  addUpvote(squealId: string): void {
    console.log(squealId);
    this.squealService
      .addUpvote(squealId)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        console.log(res);
      });
    window.location.reload();
  }

  answer(): void {
    if (this.squealType === 'text') {
      let numChar = this.newAnswer.body.length;
      if (this.dailyChars - numChar >= 0) {
        const answer: Squeal = {
          _id: '',
          author: this.username,
          body: this.newAnswer.body,
          date: new Date(),
          lat: this.newAnswer.lat,
          lng: this.newAnswer.lng,
          time: this.newAnswer.time,
          recipients: this.getRecipients(this.recipients),
          channels: this.getChannels(this.newAnswer.body),
          positiveReactions: this.newAnswer.positiveReactions,
          negativeReactions: this.newAnswer.negativeReactions,
          category: 'public',
          type: this.squealType,
          originalSqueal: '',
          locationName: this.newAnswer.locationName,
        };
        this.squealService
          .addResponse(answer, this.answeredId)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((res) => {
            if (res) {
              this.loadSqueals();
            }
          });
        this.closeAnswer();
        window.location.reload();
      } else {
        this._snackBar.open(
          'You finished your daily chars! Try again tomorrow, loser!',
          'Close',
          {
            duration: 3000,
          },
        );
      }
    }
  }

  addDownvote(squealId: string): void {
    console.log(squealId);
    this.squealService
      .addDownvote(squealId)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        console.log(res);
      });
    window.location.reload();
  }

  disableScroll(): void {
    document
      .getElementsByClassName('posts')
      .item(0)!
      .classList.add('stop-scrolling');
  }

  enableScroll(): void {
    document
      .getElementsByClassName('posts')
      .item(0)!
      .classList.remove('stop-scrolling');
  }

  addPost(): void {
    console.log(this.dailyChars);
    let numChar = this.newSqueal.body.length;
    if (this.squealType === 'text') {
      if (this.dailyChars - numChar >= 0) {
        const squeal: Squeal = {
          _id: '',
          author: this.username,
          body: this.newSqueal.body,
          date: new Date(),
          lat: this.newSqueal.lat,
          lng: this.newSqueal.lng,
          time: this.newSqueal.time,
          recipients: this.getRecipients(this.recipients),
          channels: this.getChannels(this.newSqueal.body),
          positiveReactions: this.newSqueal.positiveReactions,
          negativeReactions: this.newSqueal.negativeReactions,
          category: 'public',
          type: this.squealType,
          originalSqueal: '',
          locationName: this.newSqueal.locationName,
        };
        this.squealService
          .addSqueal(squeal)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((res) => {
            if (res) {
              this.loadSqueals();
            }
          });
        this.closePopup();
      } else {
        this._snackBar.open(
          'You finished your daily chars! Try again tomorrow, loser!',
          'Close',
          {
            duration: 3000,
          },
        );
      }
    } else {
      if (this.dailyChars - 125 >= 0) {
        if (this.squealType === 'media') {
          if (this.selectedFile) {
            // const newFileName = this.mediaService.postMediaFile(
            //   this.selectedFile,
            // );
            this.mediaService
              .postMediaFile(this.selectedFile)
              .pipe(takeUntil(this._unsubscribeAll))
              .subscribe((res) => {
                this.selectedFileName = res;

                const squeal: Squeal = {
                  _id: '',
                  author: this.username,
                  body: this.selectedFileName + '',
                  date: new Date(),
                  lat: this.newSqueal.lat,
                  lng: this.newSqueal.lng,
                  time: this.newSqueal.time,
                  recipients: this.getRecipients(this.recipients),
                  channels: this.getChannels(this.newSqueal.body),
                  positiveReactions: this.newSqueal.positiveReactions,
                  negativeReactions: this.newSqueal.negativeReactions,
                  category: 'public',
                  type: this.squealType,
                  originalSqueal: '',
                  locationName: this.newSqueal.locationName,
                };
                this.squealService
                  .addSqueal(squeal)
                  .pipe(takeUntil(this._unsubscribeAll))
                  .subscribe((res) => {
                    if (res) {
                      this.loadSqueals();
                    }
                  });
                this.closePopup();
              });
          }
        } else {
          const squeal: Squeal = {
            _id: '',
            author: this.username,
            body: this.newSqueal.body,
            date: new Date(),
            lat: this.newSqueal.lat,
            lng: this.newSqueal.lng,
            time: this.newSqueal.time,
            recipients: this.getRecipients(this.recipients),
            channels: this.getChannels(this.newSqueal.body),
            positiveReactions: this.newSqueal.positiveReactions,
            negativeReactions: this.newSqueal.negativeReactions,
            category: 'public',
            type: this.squealType,
            originalSqueal: '',
            locationName: this.newSqueal.locationName,
          };
          this.squealService
            .addSqueal(squeal)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
              if (res) {
                this.loadSqueals();
              }
            });
          this.closePopup();
        }
      } else {
        this._snackBar.open(
          'You finished your daily chars! Try again tomorrow, loser!',
          'Close',
          {
            duration: 3000,
          },
        );
      }
    }
  }
}
