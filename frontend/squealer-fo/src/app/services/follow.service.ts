import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Channel } from 'app/interfaces/channels.interface';
import { Squeal } from 'app/interfaces/squeal.interface';
import { User } from 'app/interfaces/account.interface';

@Injectable({
  providedIn: 'root',
})
export class FollowService {

  private apiUrl = 'http://localhost:3000/api/follow'; // Replace with your authentication API URL


  constructor(private http: HttpClient) {}

  getAllFollowers(username: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/${username}/followers`);
  }

  getAllFollowing(username: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/${username}/following`);
  }

  follow(username: string): Observable<any> {
    const params = {
      'username': username + '',
    }
    return this.http.post<any>(`${this.apiUrl}/${username}/follow`, {params: params});
  }

  unfollow(username: string): Observable<any> {
    const params = {
      'username': username + '',
    }
    return this.http.post<any>(`${this.apiUrl}/${username}/unfollow`, {params: params});
  }

}
