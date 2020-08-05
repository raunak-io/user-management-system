import { mimeType } from './../../../utils/mime-type.validator';
import { Subscription } from 'rxjs';
import { UsersService } from './../../../services/users.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-user-update-me',
  templateUrl: './user-update-me.component.html',
  styleUrls: ['./user-update-me.component.css'],
})
export class UserUpdateMeComponent implements OnInit, OnDestroy {
  private userUpdateSub: Subscription;
  userUpdate: FormGroup;
  isLoading = false;
  userId: string;
  user;

  constructor(private service: UsersService) {}
  imagePreview: string;

  ngOnInit(): void {
    this.userUpdateSub = this.service
      .getUserUpdateDataListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });

    this.userUpdate = new FormGroup({
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      image: new FormControl('', Validators.required, [mimeType]),
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  pickImage(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.userUpdate.patchValue({ image: file });
    this.userUpdate.get('image').updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
  updateMe() {
    this.isLoading = true;
    console.log(this.userUpdate.value);
    this.service.updateMe(
      this.userUpdate.value.firstname,
      this.userUpdate.value.lastname,
      this.userUpdate.value.email,
      this.userUpdate.value.image
    );

    this.userUpdate.reset();
  }
  ngOnDestroy(): void {
    this.userUpdateSub.unsubscribe();
  }
}
