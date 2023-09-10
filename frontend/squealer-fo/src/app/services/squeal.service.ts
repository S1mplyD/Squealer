// tweet.service.ts
import { Injectable } from '@angular/core';
import { Squeal, SquealGeo, SquealMedia, TimedSqueal } from 'app/interfaces/squeal.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'app/interfaces/account.interface';

@Injectable({
  providedIn: 'root'
})
export class SquealService {

  private apiUrl = 'http://localhost:3000/api/squeals'; // Replace with your authentication API URL
  private newApiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {
  }

  getAllSqueals(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  getAllSquealsRecipients(username: string): Observable<User[]> {
    const params = {
      'username': username + ''
    }
    return this.http.get<User[]>(`${this.apiUrl}/recipients`, {params: params});
  }

  getAllTextSqueals(): Observable<Squeal[]> {
    // Sort tweets by timestamp in descending order
    return this.http.get<Squeal[]>(`${this.newApiUrl}/text`);
  }

  getSquealsForUsers(username: string): Observable<Squeal[]> {
    return this.http.get<Squeal[]>(`${this.newApiUrl}/text/${username}`);
  }

  addTextSqueal(squeal: Squeal): Observable<any> {
    return this.http.post<any>(`${this.newApiUrl}/text`, squeal);
  }
  deleteTextSqueal(id: string): Observable<any> {
    return this.http.delete<any>(`${this.newApiUrl}/text`, {params: {'id': id + ''}});
  }

  getAllMediaSqueals(): Observable<SquealMedia[]> {
    // Sort tweets by timestamp in descending order
    return this.http.get<SquealMedia[]>(`${this.newApiUrl}/media`);
  }
  getMediaSquealsForUsers(username: string): Observable<SquealMedia[]> {
    return this.http.get<SquealMedia[]>(`${this.newApiUrl}/media/${username}`);
  }

  addMediaSqueal(squeal: SquealMedia): Observable<any> {
    return this.http.post<any>(`${this.newApiUrl}/media`, squeal);
  }
  deleteMediaSqueal(id: string): Observable<any> {
    return this.http.delete<any>(`${this.newApiUrl}/media`, {params: {'id': id + ''}});
  }

  getAllGeoSqueals(): Observable<SquealGeo[]> {
    // Sort tweets by timestamp in descending order
    return this.http.get<SquealGeo[]>(`${this.newApiUrl}/geo`);
  }

  getGeoSquealsForUsers(username: string): Observable<SquealGeo[]> {
    return this.http.get<SquealGeo[]>(`${this.newApiUrl}/geo/${username}`);
  }

  addGeoSqueal(squeal: SquealGeo): Observable<any> {
    return this.http.post<any>(`${this.newApiUrl}/geo`, squeal);
  }

  deleteGeoSqueal(id: string): Observable<any> {
    return this.http.delete<any>(`${this.newApiUrl}/geo`, {params: {'id': id + ''}});
  }

  getAllTimedSqueals(): Observable<TimedSqueal[]>  {
    return this.http.get<TimedSqueal[]>(`${this.newApiUrl}/timed`);
  }

  createTimedSqueals(squeal: TimedSqueal): Observable<any> {
    return this.http.post<any>(`${this.newApiUrl}/timed`, squeal);
  }

  deleteTimedSqueals(id: string): Observable<any> {
    return this.http.delete<string>(`${this.newApiUrl}/timed`, {params: {'id': id + ''}});
  }

 }
