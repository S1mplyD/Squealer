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
    // Implement your login with Google logic here
    // You can make a POST request to your authentication API to initiate the Google login process
    // Example:
    return this.http.post(`${this.apiUrl}/google`, {});
  }

  loginWithEmail(email: string, password: string): Observable<any> {
    // Implement your login with email and password logic here
    // You can make a POST request to your authentication API with the email and password
    // Example:
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  signUp(email: string, password: string, name: string, username: string): Observable<any> {
    // Implement your sign up logic here
    // You can make a POST request to your authentication API with the new user's email and password
    // Example:
    return this.http.post(`${this.apiUrl}/register`, { email, password, name, username });
  }

  recoverPassword(email: string): Observable<any> {
    // Implement your password recovery logic here
    // You can make a POST request to your authentication API to send a password reset email
    // Example:
    return this.http.post(`${this.apiUrl}/forgotPassword`, { email });
  }

  logout(): Observable<any> {
    // Implement your logout logic here
    // You can make a POST request to your authentication API to invalidate the user's session
    // Example:
    return this.http.post(`${this.apiUrl}/logout`, {});
  }
}
