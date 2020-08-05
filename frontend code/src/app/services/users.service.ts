import { UserUpdate } from './../models/user-update.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private usersUrl = environment.apiUrl;

  private users = [];
  private usersUpdated = new Subject<any[]>();
  private usersUpdatedData = new Subject<boolean>();
  getUserUpdateListener() {
    return this.usersUpdated.asObservable();
  }
  getUserUpdateDataListener() {
    return this.usersUpdatedData.asObservable();
  }
  constructor(private http: HttpClient, private router: Router) {}

  getAllUsers(): Observable<any> {
    return this.http.get<any>(this.usersUrl);
  }

  getUserById(userId): Observable<any> {
    return this.http.get<any>(this.usersUrl + '/' + userId);
  }
  deleteUser(userId) {
    this.http
      .delete<any>(this.usersUrl + '/' + userId)

      .subscribe(() => {
        const updatedUsers = this.users.filter((user) => user.id !== userId);
        this.users = updatedUsers;
        this.usersUpdated.next([...this.users]);
      });
  }

  getMe() {
    return this.http.get<any>(this.usersUrl + '/me');
  }

  delMe() {
    this.http.delete<any>(this.usersUrl + '/deleteMe').subscribe(() => {
      this.router.navigate(['/']);
    });
  }
  updateMe(
    firstname?: string,
    lastname?: string,
    email?: string,
    image?: string
  ) {
    const updateData = new FormData();
    updateData.append('firstname', firstname);
    updateData.append('lastname', lastname);
    updateData.append('email', email);
    updateData.append('image', image);

    console.log(updateData);
    this.http
      .patch<{ userUpdatReq: UserUpdate }>(
        this.usersUrl + '/updateMe',
        updateData
      )
      .subscribe(
        (updatedUserData) => {
          this.router.navigate(['/auth/profile']);
        },
        (error) => {
          console.log(error);
          this.usersUpdatedData.next(false);
        }
      );
  }
  updateUser(
    userId,
    firstname?: string,
    lastname?: string,
    role?: string,
    email?: string,
    image?: string
  ) {
    const updateData = new FormData();
    updateData.append('firstname', firstname);
    updateData.append('lastname', lastname);
    updateData.append('role', role);
    updateData.append('email', email);
    updateData.append('image', image);

    this.http
      .patch<{ userUpdatReq: UserUpdate }>(
        this.usersUrl + '/updateUser/' + userId,
        updateData
      )
      .subscribe(
        (updatedUserData) => {
          this.router.navigate(['/auth/admin']);
        },
        (error) => {
          this.usersUpdatedData.next(false);
        }
      );
  }
}
