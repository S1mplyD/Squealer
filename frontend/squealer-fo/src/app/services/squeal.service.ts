// tweet.service.ts
import { Injectable } from '@angular/core';
import { Squeal } from 'app/interfaces/squeal.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'app/interfaces/account.interface';

@Injectable({
  providedIn: 'root',
})
export class SquealService {
  private apiUrl = '/api/squeals/type'; // Replace with your authentication API URL
  private newApiUrl = '/api/squeals';

  constructor(private http: HttpClient) {}

  getAllSqueals(): Observable<Squeal[]> {
    return this.http.get<Squeal[]>(`${this.newApiUrl}`);
  }

  getAllSquealsRecipients(username: string): Observable<User[]> {
    const params = {
      recipient: username + '',
    };
    return this.http.get<User[]>(`${this.newApiUrl}/recipients`, {
      params: params,
    });
  }

  getAllTextSqueals(): Observable<Squeal[]> {
    // Sort tweets by timestamp in descending order
    return this.http.get<Squeal[]>(`${this.apiUrl}/text`);
  }

  getSquealsForUsers(username: string): Observable<Squeal[]> {
    return this.http.get<Squeal[]>(`${this.newApiUrl}/user/${username}`);
  }

  getAllMediaSqueals(): Observable<Squeal[]> {
    // Sort tweets by timestamp in descending order
    return this.http.get<Squeal[]>(`${this.apiUrl}/media`);
  }
  getMediaSquealsForUsers(username: string): Observable<Squeal[]> {
    return this.http.get<Squeal[]>(`${this.newApiUrl}/user/${username}`);
  }

  getAllGeoSqueals(): Observable<Squeal[]> {
    // Sort tweets by timestamp in descending order
    return this.http.get<Squeal[]>(`${this.apiUrl}/geo`);
  }

  getGeoSquealsForUsers(username: string): Observable<Squeal[]> {
    return this.http.get<Squeal[]>(`${this.apiUrl}/user/${username}`);
  }

  getAllTimedSqueals(): Observable<Squeal[]> {
    return this.http.get<Squeal[]>(`${this.apiUrl}/timed`);
  }

  getResponses(squealId: string): Observable<Squeal[]> {
    return this.http.get<Squeal[]>(`${this.newApiUrl}/response/${squealId}`);
  }

  addUpvote(squealId: string): Observable<string> {
    const params = {
      squealId: squealId + '',
    };
    return this.http.post<string>(
      `${this.newApiUrl}/positiveReactions?squealId=${squealId}`,
      { params: params },
    );
  }

  addDownvote(squealId: string): Observable<string> {
    const params = {
      squealId: squealId + '',
    };
    return this.http.post<string>(
      `${this.newApiUrl}/negativeReactions?squealId=${squealId}`,
      { params: params },
    );
  }

  addSqueal(squeal: Squeal): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, squeal);
  }

  addResponse(squeal: Squeal, originalId: string): Observable<any> {
    return this.http.post<any>(
      `${this.newApiUrl}/response/${originalId}`,
      squeal,
    );
  }

  deleteSqueal(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}`, { params: { id: id + '' } });
  }

  getSquealsNoLogin(): Observable<Squeal[]> {
    return this.http.get<Squeal[]>(`${this.newApiUrl}/nologin`);
  }

  getSquealsLogin(): Observable<Squeal[]> {
    return this.http.get<Squeal[]>(`${this.newApiUrl}/login`);
  }

  getSquealsNoLogin3Best(): Observable<Squeal[]> {
    return this.http.get<Squeal[]>(`${this.newApiUrl}/nologin3best`);
  }

  getSquealsLogin3Best(): Observable<Squeal[]> {
    return this.http.get<Squeal[]>(`${this.newApiUrl}/login3best`);
  }
}
