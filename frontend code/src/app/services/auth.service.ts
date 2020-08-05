import { environment } from './../../environments/environment.prod';

import { UserChangePassword } from './../models/user-change-password.model';

import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Router } from '@angular/router';
import { CreateUserDat } from '../models/createuser.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUrl = environment.apiUrl;
  private token: string;

  private role;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }
  getRole() {
    return this.role;
  }
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  getIsAuth() {
    return this.isAuthenticated;
  }

  createUser(
    firstname: string,
    lastname: string,
    email: string,
    role: string,
    password: string,
    confirmPassword: string,
    image?: string
  ) {
    const createUserData = new FormData();
    createUserData.append('firstname', firstname);
    createUserData.append('lastname', lastname);
    createUserData.append('email', email);
    createUserData.append('role', role);
    createUserData.append('password', password);
    createUserData.append('confirmPassword', confirmPassword);
    createUserData.append('image', image);

    this.http
      .post<{ userSignUp: CreateUserDat }>(
        this.authUrl + '/createUser',
        createUserData
      )
      .subscribe(
        (userSignData) => {
          console.log(userSignData);
          this.router.navigate(['/auth/admin']);
        },
        (error) => {
          this.authStatusListener.next(false);
        }
      );
  }

  login(email: string, password: string) {
    const data = {
      email: email,
      password: password,
    };
    console.log(data);

    this.http
      .post<any>(this.authUrl + '/login', data)

      .subscribe(
        (userLog) => {
          console.log(userLog);
          const token = userLog.token;

          const role = userLog.data['user']['role'];

          this.role = role;

          this.token = token;

          if (token && role) {
            const expiresInToken = userLog.tokenExpiresIn;

            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInToken * 1000
            );

            this.saveAuthData(token, expirationDate, role);

            this.router.navigate(['/auth/profile']);
          }
        },
        (error) => {
          console.log(error);
          this.authStatusListener.next(false);
        }
      );
  }

  autoAuthUser() {
    const autoAuthInformation = this.getAutoAuth();
    if (!autoAuthInformation) {
      return;
    }
    const now = new Date();
    const expiresIn =
      autoAuthInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = autoAuthInformation.token;
      this.role = autoAuthInformation.role;
      this.isAuthenticated = true;

      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.role = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  updatePassword(
    passwordCurrent: string,
    password: string,
    confirmPassword: string
  ) {
    const updatePasswordData = {
      passwordCurrent,
      password,
      confirmPassword,
    };

    this.http
      .patch<{ updatePassword: UserChangePassword }>(
        this.authUrl + '/updateMyPassword',
        updatePasswordData
      )
      .subscribe(
        (updatedPassData) => {
          this.isAuthenticated = false;
          this.authStatusListener.next(false);
          this.clearAuthData();
          this.router.navigate(['/']);
        },
        (error) => {
          this.authStatusListener.next(false);
        }
      );
  }

  private saveAuthData(token: string, expirationDate: Date, role?: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('role', role);
  }
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('role');
  }

  private getAutoAuth() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const role = localStorage.getItem('role');
    if (!token || !expirationDate || !role) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      role: role,
    };
  }
}
