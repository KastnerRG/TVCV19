import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from 'projects/shared/src/public-api';
import { FormGroup, FormControl } from '@angular/forms';
import { LoginModel } from 'projects/shared/src/lib/models/login.model';
import { UserService, Role } from 'projects/shared/src/lib/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginFormGroup: FormGroup;

  constructor(private authService: AuthorizationService, private userService: UserService) {}

  ngOnInit(): void {
    this.loginFormGroup = new FormGroup({
      userName: new FormControl(''),
      password: new FormControl('')
    });
  }

  login(value: LoginModel) {
    this.authService
      .login(value)
      .subscribe(_ => {
        let user = this.userService.getUser();
        switch (user.role) {
          case Role.Admin:
            return location.href = '/admin'
          case Role.Caregiver:
            return location.href = `/caregiver/${user.id}/patients`
          case Role.Patient:
            return location.href = `/patient/assign-caregiver/${user.id}`
          default:
            location.href = '/';
        }
      });
  }

}

