import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Account } from 'app/interfaces/account.interface';
import { SquealService } from 'app/services/squeal.service';
import { Squeal } from 'app/interfaces/squeal.interface';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
})
export class UserPageComponent implements OnInit {
  account!: Account;
  recentPosts!: Squeal[];
  taggedPosts!: Squeal[];

  constructor(
    private squealService: SquealService,
    private datePipe: DatePipe) {}

  ngOnInit() {
    // Simulate API or data retrieval
    this.getAccountData();
    this.getRecentPosts();
    this.getTaggedAnswers();
  }

  formatDate(date: Date): string | null{
    return this.datePipe.transform(date, 'dd-MM-yyyy'); // Change the format pattern as per your requirement
  }

  getAccountData() {
    // Replace this with your API or data retrieval logic
    // Example: Fetch account data from an API
    // this.accountService.getAccountData().subscribe((data) => {
    //   this.account = data;
    // });

    // Mock data for demonstration purposes
    this.account = {
      id: 1,
      name: 'John Doe',
      username: 'johndoe',
      profileImage: null,
      followerCount: 100,
      followingCount: 50,
      createdAt: new Date('2023-06-17')
    };
  }

  getRecentPosts() {
    // Replace this with your API or data retrieval logic for recent posts
    // this.postService.getRecentPosts().subscribe((data) => {
    //   this.recentPosts = data;
    // });

    // Mock data for demonstration purposes
    this.recentPosts = [
      {
        id: 1,
        username: this.account.username,
        timestamp: new Date(),
        content: 'This is the content of the first post'
      },
      {
        id: 2,
        username: this.account.username,
        timestamp: new Date(),
        content: 'This is the content of the second post'
      }
    ];
  }

  getTaggedAnswers() {
    // Replace this with your API or data retrieval logic for tagged answers
    // this.answerService.getTaggedAnswers().subscribe((data) => {
    //   this.taggedAnswers = data;
    // });

    // Mock data for demonstration purposes
    this.taggedPosts = [
      {
        id: 1,
        username: this.account.username,
        timestamp: new Date(),
        content: 'This is the content of the first post'
      },
      {
        id: 2,
        username: this.account.username,
        timestamp: new Date(),
        content: 'This is the content of the second post'
      }
    ];
  }
}
