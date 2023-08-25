// tweet.service.ts
import { Injectable } from '@angular/core';
import { Squeal } from 'app/interfaces/squeal.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SquealService {


  constructor(private http: HttpClient) {

  }
  getAllTextSqueals(): Observable<Squeal[]> {
    // Sort tweets by timestamp in descending order
    return this.http.get<Squeal[]>('/squeals/text');
  }
  getSquealsForUsers(username: string): Observable<Squeal[]> {
    return this.http.get<Squeal[]>('/squeals/text' + username);
  }
  addTextSqueal(squeal: Squeal): void {
    this.http.post(
      '/squeals/text', {
      squeal
    });
  }

 }
