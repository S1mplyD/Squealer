import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from 'app/services/auth.service'; // Your authentication service
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
    private formBuilder: FormBuilder,
    private router: Router
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
    this.authService.loginWithGoogle();
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username','');
    this.router.navigateByUrl('');
  }

  loginWithEmail() {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    this.authService.loginWithEmail(email, password);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username','');
    this.router.navigateByUrl('');
  }

  signup() {
    const email = this.signupForm.value.email;
    const password = this.signupForm.value.password;
    const username = this.signupForm.value.username;
    const name = this.signupForm.value.name;
    this.authService.signUp(email, password, username, name);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', username);
    this.router.navigateByUrl('');
  }

  recoverPassword() {
    const email = this.recoverPasswordForm.value.email;
    this.authService.recoverPassword(email);
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    localStorage.setItem('isLoggedIn', 'false');
    this.userName = '';
  }
}
