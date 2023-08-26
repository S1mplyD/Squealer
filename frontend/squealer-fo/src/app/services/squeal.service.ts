// tweet.service.ts
import { Injectable } from '@angular/core';
import { Squeal, SquealGeo, SquealMedia } from 'app/interfaces/squeal.interface';
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

  addTextSqueal(squeal: Squeal): void {
    this.http.post(`${this.newApiUrl}/text`, { squeal });
  }
  deleteTextSqueal(id: string): void {
    this.http.delete(`${this.newApiUrl}/text`, {params: {'id': id + ''}});
  }

  getAllMediaSqueals(): Observable<SquealMedia[]> {
    // Sort tweets by timestamp in descending order
    return this.http.get<SquealMedia[]>(`${this.newApiUrl}/media`);
  }
  getMediaSquealsForUsers(username: string): Observable<SquealMedia[]> {
    return this.http.get<SquealMedia[]>(`${this.newApiUrl}/media/${username}`);
  }

  addMediaSqueal(squeal: SquealMedia): void {
    this.http.post(`${this.newApiUrl}/media`, { squeal });
  }
  deleteMediaSqueal(id: string): void {
    this.http.delete(`${this.newApiUrl}/media`, {params: {'id': id + ''}});
  }

  getAllGeoSqueals(): Observable<SquealGeo[]> {
    // Sort tweets by timestamp in descending order
    return this.http.get<SquealGeo[]>(`${this.newApiUrl}/geo`);
  }

  getGeoSquealsForUsers(username: string): Observable<SquealGeo[]> {
    return this.http.get<SquealGeo[]>(`${this.newApiUrl}/geo/${username}`);
  }

  addGeoSqueal(squeal: SquealGeo): void {
    this.http.post(`${this.newApiUrl}/geo`, { squeal });
  }

  deleteGeoSqueal(id: string): void {
    this.http.delete(`${this.newApiUrl}/geo`, {params: {'id': id + ''}});
  }

  getAllTimedSqueals(): Observable<any[]>  {
    return this.http.get<any[]>(`${this.newApiUrl}/timed`);
  }

  createTimedSqueals(squeal: any): void {
    this.http.post(`${this.newApiUrl}/timed`, { squeal });
  }

  deleteTimedSqueals(id: string): void {
    this.http.delete(`${this.newApiUrl}/timed`, {params: {'id': id + ''}});
  }

 }
