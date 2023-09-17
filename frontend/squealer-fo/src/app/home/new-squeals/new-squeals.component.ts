import { Component, OnInit } from '@angular/core';
import { Squeal } from 'app/interfaces/squeal.interface';
import { SquealService } from 'app/services/squeal.service';
import { DatePipe } from '@angular/common';
import { User } from 'app/interfaces/account.interface';
import { UsersService } from 'app/services/users.service';
import { Subject, takeUntil } from 'rxjs';
import { MediaService } from 'app/services/media.service';

@Component({
  selector: 'app-new-squeal',
  templateUrl: './new-squeals.component.html',
  styleUrls: ['./new-squeals.component.scss'],
})
export class NewSquealsComponent implements OnInit {
  squeals: Squeal[] = [];
  accounts: User[] = [];
  squealType: string = 'text';
  squealSubType: boolean = false;
  selectedFile?: File = undefined;
  selectedRef: string = '';
  selectedFileName: string = '';
  recipients: string = '';
  newSqueal: Squeal = {
    author: '',
    body: '',
    date: new Date(),
    recipients: [],
    category: '',
    channels: [],
    type: ''
  };

  isLoggedIn: boolean = false;
  username: string = '';
  plan: string | null = '';
  isPostFormOpen: boolean = false;
  isPopupOpen = false;
  private _unsubscribeAll: Subject<void> = new Subject<void>();
  constructor(
    private squealService: SquealService,
    private datePipe: DatePipe,
    private userService: UsersService,
    private mediaService: MediaService) {}

  ngOnInit(): void {
    this.loadSqueals();
    this.userService.getAllUsers()
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((res) => {
      this.accounts = res;
    });
    this.plan = localStorage.getItem('plan');
    if (localStorage.getItem('isLoggedIn') === 'false') {
      this.isLoggedIn = false;
    } else if (localStorage.getItem('isLoggedIn') === 'true') {
      this.isLoggedIn = true;
    }
    if (localStorage.getItem('username')) {
      this.username = localStorage.getItem('username') + '';
    }

  }

  openPopup(): void {
    this.isPopupOpen = true;
  }

  closePopup(): void {
    this.isPopupOpen = false;
  }

  formatDate(date: Date): string | null{
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

  loadSqueals(): void {
    this.squealService.getAllTextSqueals()
    .pipe(takeUntil(this._unsubscribeAll)).
    subscribe((res) => {
      this.squeals = res;
    });
  }

  closePostForm() {
    this.isPostFormOpen = false;
    this.newSqueal = {  author: '', body: '', date: new Date(),  recipients: [], category: '', type: '', channels: [] };
  }

  uploadFiles(): void {
    if (this.selectedFile) {
      this.upload(this.selectedFile);
    }
    this.newSqueal.body = this.selectedFileName;
  }

  upload(file: File): void {
    if (file) {
      this.mediaService.postMediaFile(file)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(res => this.selectedFileName = res);
    }
  }

  selectFiles(event: any): void {
    this.selectedFileName = '';
    this.selectedFile = event.target.file;
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
    rec.replace('/\s+/g', '');
    return rec.split(',');
  }

  addPost(): void {
    const squeal: Squeal = {
      author: this.username,
      body: this.newSqueal.body,
      date: new Date(),
      lat: this.newSqueal.lat,
      lng: this.newSqueal.lng,
      time: this.newSqueal.time,
      recipients: this.getRecipients(this.recipients),
      channels: this.getChannels(this.newSqueal.body),
      category: 'public',
      type: this.squealType
    };
    this.squealService.addSqueal(squeal)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((res) => {
      if (res) {
        this.loadSqueals();
      }
    });
    this.closePopup();
  }
}
