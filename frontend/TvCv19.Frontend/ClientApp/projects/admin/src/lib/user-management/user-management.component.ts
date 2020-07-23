import { Component, OnInit } from '@angular/core';
import { UserManagementService, ApplicationLogin } from '../user-management.service';
import { MatDialog } from '@angular/material/dialog';
import { EditUserComponent } from '../edit-user/edit-user.component';

@Component({
  selector: 'lib-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {

  displayedColumns: string[] = ['userName'];
  applicationLogins: ApplicationLogin[] = [];

  constructor(private userManagementService: UserManagementService, private matDialog: MatDialog) { }

  ngOnInit(): void {
    this.userManagementService.getApplicationLogins()
      .subscribe(appLogins => this.applicationLogins = appLogins);
  }

  addUserLogin() {
    const dialogRef = this.matDialog.open(EditUserComponent);

    dialogRef.afterClosed().subscribe(result => {
      alert(result.userName);
    })
  }

}
