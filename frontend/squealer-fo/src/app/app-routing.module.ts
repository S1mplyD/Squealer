import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccountListComponent } from './followed-accounts/account-list.component';
import { UserPageComponent } from './user-page/user-page.component';
import { AuthComponent } from './authentication/auth.component';
import { Best3SquealsComponent } from './best-3-squeals/best-3-squeals.component';
AccountListComponent
const routes: Routes = [
  { path: 'authentication', component: AuthComponent},
  { path: '', component: HomeComponent },
  { path: 'best3Squeals', component: Best3SquealsComponent},
  { path: 'following', component: AccountListComponent },
  { path: 'following/:username', component: UserPageComponent},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
