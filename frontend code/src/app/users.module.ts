import { UpdateUserComponent } from './components/update user/update-user.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { CreateUserComponent } from './components/create user/create-user.component';

import { NgModule } from '@angular/core';

import { UserChangePasswordComponent } from './components/profile/user-change-password/user-change-password.component';
import { UserUpdateMeComponent } from './components/profile/user-update-me/user-update-me.component';
import { UserPortalComponent } from './components/profile/user portal/user-portal.component';
import { UserSettingsComponent } from './components/profile/user settings/user-settings.component';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularMaterialModule } from './angular-material.module';
import { RouterModule } from '@angular/router';

import { DisplayComponent } from './components/profile/user details page/user-detail.component';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  declarations: [
    UserChangePasswordComponent,
    UserUpdateMeComponent,
    UserPortalComponent,
    UserSettingsComponent,
    CreateUserComponent,
    AdminPanelComponent,
    DisplayComponent,
    UpdateUserComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AngularMaterialModule,
    RouterModule,
    UserRoutingModule,
  ],
})
export class UsersModule {}
