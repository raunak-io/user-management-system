import { UserLogin } from './components/login/user-login.component';

import { NotFoundComponent } from './components/not-found/not-found.component';
import { UsersModule } from './users.module';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularMaterialModule } from './angular-material.module';
import { UsersService } from './services/users.service';
import { AuthService } from './services/auth.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './utils/auth-interceptor';
import { ErrorInterceptor } from './utils/error-interceptor';
import { ErrorComponent } from './components/error/error.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent,NotFoundComponent,UserLogin
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularMaterialModule,
    
    ReactiveFormsModule,
   
    HttpClientModule,
    BrowserAnimationsModule,

   
  ],
  providers: [  UsersService,
    AuthService,
  
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent],
})
export class AppModule { }
