import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'app/interfaces/account.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = '/api/auth'; // Replace with your authentication API URL
  private authUrl = '/api/users';

  constructor(private http: HttpClient) {}

  loginWithGoogle(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/google`, {});
  }

  loginWithEmail(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password });
  }

  signUp(
    mail: string,
    password: string,
    name: string,
    username: string,
  ): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, {
      mail,
      password,
      name,
      username,
    });
  }

  tokenRecoverPassword(email: string) {
    return this.http.get(`${this.apiUrl}/forgotPassword/${email}`);
  }

  recoverPassword(email: string, token: string, password: string) {
    const body = {
      token: token,
      password: password,
    };
    return this.http.post(`${this.apiUrl}/forgotPassword/${email}`, body, {
      responseType: 'text',
    });
  }

  logout(): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/logout`);
  }

  isAuthenticated(): Observable<any> {
    return this.http.get<any>(`${this.authUrl}/me`);
  }
}
