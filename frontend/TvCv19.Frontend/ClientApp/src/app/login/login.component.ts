import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from 'projects/shared/src/public-api';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginFormGroup: FormGroup;

  constructor(private authService: AuthorizationService) {}

  ngOnInit(): void {
    this.loginFormGroup = new FormGroup({
      userName: new FormControl(''),
      password: new FormControl('')
    });
  }

  login() {
    this.authService
      .login(this.loginFormGroup.value)
      .subscribe(_ => {
        location.href = '/';
      });
  }

}
