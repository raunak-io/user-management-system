import { AuthService } from './../services/auth.service';

import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
@Injectable()
export class ManagerGuard implements CanActivate {
  constructor(private service: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    const role = this.service.getRole();
    console.log(role);
    const isAuth = this.service.getIsAuth();
    const managerRole = 'manager';
    const adminRole = 'admin';
    if (isAuth && managerRole === role ) {
      return isAuth;
    } else if (isAuth && adminRole === role) {
      return isAuth;
      
    }else {
      this.router.navigate(['/']);
    }
  }
}
