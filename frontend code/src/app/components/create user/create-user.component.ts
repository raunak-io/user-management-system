import { AuthService } from './../../services/auth.service';
import { Subscription } from 'rxjs';

import { mimeType } from './../../utils/mime-type.validator';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({

  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css'],
})
export class CreateUserComponent implements OnInit, OnDestroy {
  constructor(private service: AuthService) {}
  imagePreview: string;
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

  createUserForm = new FormGroup({
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    image: new FormControl('', Validators.required, [mimeType]),
    email: new FormControl('', [Validators.required, Validators.email]),
    role: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required),
  });

  pickImage(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.createUserForm.patchValue({ image: file });
    this.createUserForm.get('image').updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  get firstname() {
    return this.createUserForm.get('firstname');
  }
  get lastname() {
    return this.createUserForm.get('lastname');
  }
  get email() {
    return this.createUserForm.get('email');
  }
  get role() {
    return this.createUserForm.get('role');
  }
  get password() {
    return this.createUserForm.get('password');
  }
  get confirmPassword() {
    return this.createUserForm.get('confirmPassword');
  }

  createData() {
   
    if (this.createUserForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.service.createUser(
      this.createUserForm.value.firstname,
      this.createUserForm.value.lastname,
      this.createUserForm.value.email,
      this.createUserForm.value.role,
      this.createUserForm.value.password,
      this.createUserForm.value.confirmPassword,
      this.createUserForm.value.image
    );
    this.createUserForm.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
