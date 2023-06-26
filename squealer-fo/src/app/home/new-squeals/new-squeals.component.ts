import { Component, OnInit } from '@angular/core';
import { Squeal } from 'app/interfaces/squeal.interface';
import { SquealService } from 'app/services/squeal.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-new-squeal',
  templateUrl: './new-squeals.component.html',
  styleUrls: ['./new-squeals.component.scss'],
})
export class NewSquealsComponent implements OnInit {
  squeals: Squeal[] = [];

  newSqueal: Squeal = { id: 0, username: '', content: '', timestamp: new Date() };

  isLoggedIn: boolean = false;

  isPostFormOpen: boolean = false;

  constructor(
    private squealService: SquealService,
    private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.squeals = this.squealService.getTweets();
  }

  formatDate(date: Date): string | null{
    return this.datePipe.transform(date, 'dd-MM-yyyy'); // Change the format pattern as per your requirement
  }

  openPostForm() {
    this.isPostFormOpen = true;
  }

  closePostForm() {
    this.isPostFormOpen = false;
    this.newSqueal = { id: 0, username: '', content: '', timestamp: new Date() };
  }

  login() {
    // Simulating login logic
    this.isLoggedIn = true;
  }

  addPost(): void {
    const newId = this.squeals.length + 1;
    const newSqueal: Squeal = {
      id: newId,
      username: 'delusional_990',
      content: this.newSqueal.content,
      timestamp: new Date()
    };

    this.squeals.unshift(newSqueal); // Add the new post at the beginning of the array
    this.newSqueal.content = ''; // Clear the form field
    this.isPostFormOpen = false;
  }
}
