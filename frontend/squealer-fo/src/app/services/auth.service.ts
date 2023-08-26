import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'app/interfaces/account.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api/auth'; // Replace with your authentication API URL


  constructor(private http: HttpClient) {}

  loginWithGoogle(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/google`, {});
  }

  loginWithEmail(username: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, { username, password });
  }

  signUp(mail: string, password: string, name: string, username: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, { mail, password, name, username });
  }

  tokenRecoverPassword(email: string): void {
    const params = {
      'mail': email + ''
    }
    this.http.get(`${this.apiUrl}/forgotPassword`, { params: params });
  }

  recoverPassword(email: string): Observable<number> {
    const params = {
      'mail': email + ''
    }
    return this.http.post<number>(`${this.apiUrl}/forgotPassword`, { params: params });
  }

  logout(): void {
    this.http.get(`${this.apiUrl}/logout`);
  }

}
