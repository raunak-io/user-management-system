import { UsersService } from './../../../services/users.service';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
 
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
})
export class DisplayComponent implements OnInit {
  oneUser;
  oneUserData = [];
 

  constructor(
    private service:UsersService,
    private route: ActivatedRoute
  ) {}
 
  
  userId: string;

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.userId = paramMap.get('id');
        this.service.getUserById(this.userId).subscribe((userData) => {
         
          let singleUser;
          singleUser = userData.data['data'];
          this.oneUser = singleUser;
          this.oneUserData = singleUser;

         
        });
      } else {
        this.userId = null;
      }
    });
  }

 
}
