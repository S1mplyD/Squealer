import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { AuthService } from 'app/services/auth.service'; // Your authentication service
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'app/interfaces/account.interface';
import { Subject, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComponentCacheService } from 'app/services/component-cache.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  userName: string = '';
  user: User = {
    _id: '',
    name: '',
    username: '',
    mail: '',
    dailyCharacters: 0,
    weeklyCharacters: 0,
    monthlyCharacters: 0,
    plan: '',
    resetToken: '',
    createdAt: new Date(),
    status: '',
    blockedFor: 0,
  };
  parameters = {
    dataSource: [],
  };
  loginForm: FormGroup;
  signupForm: FormGroup;
  recoverPasswordForm: FormGroup;
  private _unsubscribeAll: Subject<void> = new Subject<void>();
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private _snackBar: MatSnackBar,
    private componentCacheService: ComponentCacheService,
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
  ngOnDestroy(): void {
    this.componentCacheService.set(AuthComponent.name, this.parameters);
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  loginWithGoogle() {
    this.authService
      .loginWithGoogle()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((acc) => {
        this.user = acc;
        sessionStorage.setItem('username', this.user.username);
      });
    this.router.navigateByUrl('');
  }

  loginWithEmail() {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    this.authService
      .loginWithEmail(email, password)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (acc) => {
          this.user = acc;
          this.authService
            .isAuthenticated()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
              if (res.status !== '404') {
                this.isLoggedIn = true;
                this.user = res;
                sessionStorage.setItem('username', this.user.username);
                sessionStorage.setItem('isLoggedIn', 'true');
                this.router.navigateByUrl('');
              }
            });
        },
        (error) => {
          this._snackBar.open(
            'Email or password are not correct! Retry.',
            'Close',
            {
              duration: 3000,
            },
          );
        },
      );
  }

  signup() {
    const email = this.signupForm.value.email;
    const password = this.signupForm.value.password;
    const username = this.signupForm.value.username.Replace(' ', '_');
    const name = this.signupForm.value.name;
    this.authService
      .signUp(email, password, username, name)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((acc) => {
        this.user = acc;
        sessionStorage.setItem('username', this.user.username);
        sessionStorage.setItem('isLoggedIn', 'true');
        this.router.navigateByUrl('');
      });
  }

  recoverPassword() {
    const email = this.recoverPasswordForm.value.email;
    this.authService.recoverPassword(email);
  }

  logout() {
    this.authService.logout();
    sessionStorage.setItem('isLoggedIn', 'false');
    this.isLoggedIn = false;
    this.userName = '';
  }
}
