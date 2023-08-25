import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { User } from 'app/interfaces/account.interface';
import { SquealService } from 'app/services/squeal.service';
import { Squeal } from 'app/interfaces/squeal.interface';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from 'app/services/account.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
})
export class UserPageComponent implements OnInit {
  account: User | undefined;
  answerers!: User[];
  recentPosts!: Squeal[];
  taggedPosts!: Squeal[];
  userName!: string;

  constructor(
    private squealService: SquealService,
    private datePipe: DatePipe,
    public activeRoute: ActivatedRoute,
    private accountService: AccountService) {}

  ngOnInit() {
    this.userName = String(this.activeRoute.snapshot.paramMap.get("username"));
    this.getAccountData();
    this.getRecentPosts();
    this.getTaggedAnswers();
  }

  formatDate(date: Date | undefined): string | null{
    return this.datePipe.transform(date, 'dd/MM/yyyy'); // Change the format pattern as per your requirement
  }

  getAccountData() {
    this.account = this.accountService.getSpecificAccount(this.userName);
  }

  getRecentPosts() {
    this.squealService.getSquealsForUsers(this.userName).subscribe(res => this.recentPosts = res);
  }

  getTaggedAnswers() {
   // Da implementare
  }
}
