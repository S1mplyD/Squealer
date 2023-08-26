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
    return this.http.get<Squeal[]>(`${this.apiUrl}/text`);
  }

  getSquealsForUsers(username: string): Observable<Squeal[]> {
    return this.http.get<Squeal[]>(`${this.apiUrl}/text/${username}`);
  }

  addTextSqueal(squeal: Squeal): void {
    this.http.post(`${this.apiUrl}/text`, { squeal });
  }
  deleteTextSqueal(id: string): void {
    this.http.delete(`${this.apiUrl}/text`, {params: {'id': id + ''}});
  }

  getAllMediaSqueals(): Observable<SquealMedia[]> {
    // Sort tweets by timestamp in descending order
    return this.http.get<SquealMedia[]>(`${this.apiUrl}/media`);
  }
  getMediaSquealsForUsers(username: string): Observable<SquealMedia[]> {
    return this.http.get<SquealMedia[]>(`${this.apiUrl}/media/${username}`);
  }

  addMediaSqueal(squeal: SquealMedia): void {
    this.http.post(`${this.apiUrl}/media`, { squeal });
  }
  deleteMediaSqueal(id: string): void {
    this.http.delete(`${this.apiUrl}/media`, {params: {'id': id + ''}});
  }

  getAllGeoSqueals(): Observable<SquealGeo[]> {
    // Sort tweets by timestamp in descending order
    return this.http.get<SquealGeo[]>(`${this.apiUrl}/geo`);
  }

  getGeoSquealsForUsers(username: string): Observable<SquealGeo[]> {
    return this.http.get<SquealGeo[]>(`${this.apiUrl}/geo/${username}`);
  }

  addGeoSqueal(squeal: SquealGeo): void {
    this.http.post(`${this.apiUrl}/geo`, { squeal });
  }

  deleteGeoSqueal(id: string): void {
    this.http.delete(`${this.apiUrl}/geo`, {params: {'id': id + ''}});
  }

  getAllTimedSqueals(): Observable<any[]>  {
    return this.http.get<any[]>(`${this.apiUrl}/timed`);
  }

  createTimedSqueals(squeal: any): void {
    this.http.post(`${this.apiUrl}/timed`, { squeal });
  }

  deleteTimedSqueals(id: string): void {
    this.http.delete(`${this.apiUrl}/timed`, {params: {'id': id + ''}});
  }

 }
