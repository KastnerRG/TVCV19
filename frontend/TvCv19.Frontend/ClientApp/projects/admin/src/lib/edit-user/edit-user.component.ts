import { Component, OnInit } from '@angular/core';
import { UserManagementService } from '../user-management.service';

function generatePassword() {
  var length = 8,
      charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal + "1!";
}

@Component({
  selector: 'lib-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  userName: string;
  password: string;

  constructor(private userManagementService: UserManagementService) { }

  ngOnInit(): void {
    var a = ["Small", "Blue", "Ugly", "Yellow", "Cosmic", "Hanging", "Unsafe"];
    var b = ["Bear", "Dog", "Banana", "Cat", "Chair", "Bottle", "Speaker"];

    var rA = Math.floor(Math.random()*a.length);
    var rB = Math.floor(Math.random()*b.length);
    this.userName = a[rA] + b[rB];

    this.password = generatePassword();

    this.userManagementService.createApplicationLogin({
      userName: this.userName
    }, this.password).subscribe(_ => _);
  }

}
