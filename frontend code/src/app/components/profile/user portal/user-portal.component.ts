import { AuthService } from 'src/app/services/auth.service';

import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../services/users.service';


@Component({
  selector: 'user-portal',
  templateUrl: './user-portal.component.html',
  styleUrls: ['./user-portal.component.css'],
})
export class UserPortalComponent implements OnInit {
  userInformation;

  adminRole = 'admin';
  managerRole = 'manager';
 userRole = null;

  constructor(private userService: UsersService, private authService:AuthService) {}
  ngOnInit(): void {
    this.userService.getMe().subscribe((userDat) => {
      if(!userDat){
        return;
      }
      let userData = userDat.data.data;
      this.userInformation = userData;
     
    });
    this.userRole = this.authService.getRole();
  }
onClick(){
  this.userService.delMe()
}

}
