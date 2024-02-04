import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Channel } from 'app/interfaces/channels.interface';

@Injectable({
  providedIn: 'root',
})
export class ChannelsService {
  private apiUrl = '/api/channels'; // Replace with your authentication API URL

  constructor(private http: HttpClient) {}

  getAllChannels(): Observable<Channel[]> {
    return this.http.get<Channel[]>(this.apiUrl);
  }

  createChannel(name: string, type: string): Observable<any> {
    const params = {
      name: name + '',
      type: type + '',
    };
    return this.http.post<any>(this.apiUrl, { params: params });
  }

  deleteChannel(name: string): Observable<any> {
    const params = {
      name: name + '',
    };
    return this.http.delete<any>(this.apiUrl, { params: params });
  }

  getChannel(name: string): Observable<Channel> {
    return this.http.get<Channel>(`${this.apiUrl}/${name}`);
  }

  getSquealsInAChannel(name: string): Observable<any[]> {
    const params = {
      name: name + '',
    };
    return this.http.get<any[]>(`${this.apiUrl}/squeals`, { params: params });
  }

  followChannel(name: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/channel/${name}`, {});
  }

  unfollowChannel(name: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/channel/${name}`, {});
  }

  getUserChannels(): Observable<Channel[]> {
    return this.http.get<Channel[]>(`${this.apiUrl}/userchannel`);
  }

  getKeywordsChannels(): Observable<Channel[]> {
    return this.http.get<Channel[]>(`${this.apiUrl}/keyword`);
  }

  getOfficialChannels(): Observable<Channel[]> {
    return this.http.get<Channel[]>(`${this.apiUrl}/official`);
  }
}
