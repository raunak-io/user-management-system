import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './utils/auth.guard';
import { ManagerGuard } from './utils/manager.guard';


import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { CreateUserComponent } from './components/create user/create-user.component';
import { UpdateUserComponent } from './components/update user/update-user.component';

import { UserPortalComponent } from './components/profile/user portal/user-portal.component';
import { UserSettingsComponent } from './components/profile/user settings/user-settings.component';
import { UserUpdateMeComponent } from './components/profile/user-update-me/user-update-me.component';
import { UserChangePasswordComponent } from './components/profile/user-change-password/user-change-password.component';
import { DisplayComponent } from './components/profile/user details page/user-detail.component';

const router: Routes = [
  {
    path: 'edit/:id',
    component: UpdateUserComponent,
    canActivate: [AuthGuard, ManagerGuard], 
  },
  {
    path: 'user/:id',
    component: DisplayComponent,
    canActivate: [AuthGuard, ManagerGuard], 
  },
  {
    path: 'admin',
    component: AdminPanelComponent,
    canActivate: [AuthGuard, ManagerGuard], 
  },
  {
    path: 'create-user',
    component: CreateUserComponent,
    canActivate: [AuthGuard, ManagerGuard], 
  },
  {
    path: 'user-change-password',
    component: UserChangePasswordComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'user-update-me',
    component: UserUpdateMeComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'user-settings',
    component: UserSettingsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    component: UserPortalComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(router)],
  exports: [RouterModule],
  providers: [AuthGuard, ManagerGuard],
})
export class UserRoutingModule {}
