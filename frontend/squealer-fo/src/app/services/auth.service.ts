import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api/auth'; // Replace with your authentication API URL


  constructor(private http: HttpClient) {}

  loginWithGoogle(): Observable<any> {
    return this.http.post(`${this.apiUrl}/google`, {});
  }

  loginWithEmail(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password });
  }

  signUp(mail: string, password: string, name: string, username: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { mail, password, name, username });
  }


  recoverPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgotPassword`, { email });

  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {});
  }
}
