import { AuthService } from './../../../services/auth.service';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-change-password',
  templateUrl: './user-change-password.component.html',
  styleUrls: ['./user-change-password.component.css'],
})
export class UserChangePasswordComponent implements OnInit, OnDestroy {
  constructor(private service: AuthService) {}
  hide = true;
  isLoading = false;

  private authStatusSub: Subscription;

  ngOnInit(): void {
    this.authStatusSub = this.service
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });
  }

  changePassword = new FormGroup({
    oldPassword: new FormControl('', Validators.required),
    newPassword: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required),
  });

  changeUserPass() {
   
    if (this.changePassword.invalid) {
      return;
    }
    this.isLoading = true;
    this.service.updatePassword(
      this.changePassword.value.oldPassword,
      this.changePassword.value.newPassword,
      this.changePassword.value.confirmPassword
    );
    this.changePassword.reset();
  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
