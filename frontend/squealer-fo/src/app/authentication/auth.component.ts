import { Component } from '@angular/core';
import { AuthService } from 'app/services/auth.service'; // Your authentication service
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  isLoggedIn = false;
  userName: string = '';
  loginForm: FormGroup;
  signupForm: FormGroup;
  recoverPasswordForm: FormGroup;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.signupForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      username: ['', Validators.required],
      name: ['', Validators.required],
    });

    this.recoverPasswordForm = this.formBuilder.group({
      email: ['', Validators.required],
    });
  }

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

  loginWithEmail() {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.authService.loginWithEmail(email, password).subscribe(
      (user) => {
        // Successful login
        this.isLoggedIn = true;
        this.userName = user.name;
      },
      (error) => {
        // Handle login error
        console.error('Error logging in with email and password:', error);
      }
    );
  }

  signup() {
    const email = this.signupForm.value.email;
    const password = this.signupForm.value.password;
    const username = this.signupForm.value.username;
    const name = this.signupForm.value.name;

    this.authService.signUp(email, password, username, name).subscribe(
      (user) => {
        // Successful signup
        console.log('User signed up:', user);
      },
      (error) => {
        // Handle signup error
        console.error('Error signing up:', error);
      }
    );
  }

  recoverPassword() {
    const email = this.recoverPasswordForm.value.email;

    this.authService.recoverPassword(email).subscribe(
      () => {
        // Successful password recovery
        console.log('Password recovery email sent');
      },
      (error) => {
        // Handle password recovery error
        console.error('Error recovering password:', error);
      }
    );
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.userName = '';
  }
}
