import { AuthService } from './../../services/auth.service';

import { UsersService } from './../../services/users.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
})
export class AdminPanelComponent implements OnInit, OnDestroy {
  constructor(
    private service: UsersService,
    private authService: AuthService
  ) {}
  usersData = [];
  productsStatistics = [];
  private userSub: Subscription;

  adminRole = 'admin';
  managerRole = 'manager';

  userRole = null;
  // isLoading = false;
  ngOnInit(): void {
    this.service.getAllUsers().subscribe((users) => {
      console.log(users);
      let userArr;
      // this.isLoading = true;
      userArr = users.data['data'];
      // this.isLoading = false;
      this.usersData = userArr;
    });
    this.userSub = this.service
      .getUserUpdateListener()
      .subscribe((users: any[]) => {
        // this.isLoading = false;
        this.usersData = users;
      });
    this.userRole = this.authService.getRole();
  }
  deltheuser(userId) {
    this.service.deleteUser(userId);
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
