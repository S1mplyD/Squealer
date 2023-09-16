// tweet.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  private apiUrl = 'http://localhost:3000/api/media'; // Replace with your authentication API URL

  constructor(private http: HttpClient) {
  }

  postMediaFile(file: File): Observable<string> {
    return this.http.post<string>(this.apiUrl, file);
  }

 }
