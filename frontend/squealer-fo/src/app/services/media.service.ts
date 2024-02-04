// tweet.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  private apiUrl = '/api/media'; // Replace with your authentication API URL

  constructor(private http: HttpClient) {}

  postMediaFile(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    const headers = new HttpHeaders({ Accept: 'text/plain' });
    return this.http.post(this.apiUrl, formData, {
      headers,
      responseType: 'text',
    });
  }
}
