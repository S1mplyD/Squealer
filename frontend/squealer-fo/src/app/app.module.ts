import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { HomeComponent } from './home/home.component';
import { MatCardModule } from '@angular/material/card';
import { NewSquealsComponent } from './home/new-squeals/new-squeals.component';
import { DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { AccountListComponent } from './followed-accounts/account-list.component';
import { UserPageComponent } from './user-page/user-page.component';
import { AuthComponent } from './authentication/auth.component';
import { HttpClientModule } from '@angular/common/http'
import { MatDialogModule } from '@angular/material/dialog';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSliderModule} from '@angular/material/slider';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSnackBarModule, MatSnackBar} from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NewSquealsComponent,
    AccountListComponent,
    UserPageComponent,
    AuthComponent
  ],
  imports: [
    MatTabsModule,
    MatCardModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatExpansionModule,
    MatSnackBarModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDialogModule,
    HttpClientModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSliderModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
