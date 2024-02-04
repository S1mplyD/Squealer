import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'app/interfaces/account.interface';
import { Analytics } from 'app/interfaces/analytics.interface';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private apiUrl = '/api/analytics'; // Replace with your authentication API URL

  constructor(private http: HttpClient) {}

  getUserSquealAnalytic(id: string): Observable<Analytics> {
    return this.http.get<Analytics>(`${this.apiUrl}`);
  }

  getSquealAnalytic(id: string): Observable<Analytics> {
    const params = {
      id: id + '',
    };
    return this.http.get<Analytics>(`${this.apiUrl}/analytic`, {
      params: params,
    });
  }
}
