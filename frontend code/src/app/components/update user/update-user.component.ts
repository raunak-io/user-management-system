import { UserUpdate } from '../../models/user-update.model';

import { mimeType } from '../../utils/mime-type.validator';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/services/users.service';

@Component({
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css'],
})
export class UpdateUserComponent implements OnInit, OnDestroy {
  constructor(private service: UsersService, private route: ActivatedRoute) {}
  imagePreview: string;
  userId: string;
  userUpdation: FormGroup;
  user: UserUpdate;
  isLoading = false;
  private userUpdateSub: Subscription;

  ngOnInit(): void {
    this.userUpdateSub = this.service
      .getUserUpdateDataListener()
      .subscribe((listen) => {
        this.isLoading = false;
      });

    this.userUpdation = new FormGroup({
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      image: new FormControl('', Validators.required, [mimeType]),
      email: new FormControl('', [Validators.required, Validators.email]),
      role: new FormControl('', Validators.required),
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.userId = paramMap.get('id');

        this.service.getUserById(this.userId).subscribe((userData) => {
          let singleUser;
          singleUser = userData.data['data'];

          this.user = {
            firstname: singleUser.firstname,
            lastname: singleUser.lastname,
            email: singleUser.email,
            role: singleUser.role,
            image: singleUser.image,
          };
          this.userUpdation.patchValue({
            firstname: this.user.firstname,
            lastname: this.user.lastname,
            email: this.user.email,
            role: this.user.role,
            image: this.user.image,
          });
        });
      } else {
        this.userId = null;
      }
    });
  }

  pickImage(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.userUpdation.patchValue({ image: file });
    this.userUpdation.get('image').updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  updateUserData() {
    console.log(this.userUpdation.value);

    if (this.userUpdation.invalid) {
      return;
    }
    this.isLoading = true;
    this.service.updateUser(
      this.userId,
      this.userUpdation.value.firstname,
      this.userUpdation.value.lastname,
      this.userUpdation.value.role,
      this.userUpdation.value.email,
      this.userUpdation.value.image
    );

    this.userUpdation.reset();
  }
  ngOnDestroy() {
    this.userUpdateSub.unsubscribe();
  }
}
