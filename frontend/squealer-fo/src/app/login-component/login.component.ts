import { Component } from '@angular/core';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  isLoggedIn = false;
  userName: string = '';

  constructor(private authService: AuthService) {}

  loginWithGoogle() {
    this.authService.loginWithGoogle().subscribe(
      (user) => {
        // Successful login
        this.isLoggedIn = true;
        this.userName = user.name;
      },
      (error) => {
        // Handle login error
        console.error('Error logging in with Google:', error);
      }
    );
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.userName = '';
  }
}
