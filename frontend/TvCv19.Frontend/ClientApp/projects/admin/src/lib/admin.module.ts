import { NgModule } from '@angular/core';
import { AdminComponent } from './admin.component';
import { PhysicianAdminComponent } from './physician-admin/physician-admin.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { RootComponent } from './root/root.component';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from 'projects/shared/src/public-api';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FlexModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { AddPatientDeviceComponent } from './add-patient-device/add-patient-device.component';
import { MatListModule } from '@angular/material/list';
import { UserManagementComponent } from './user-management/user-management.component';
import { MatDialogModule } from '@angular/material/dialog';
import { EditUserComponent } from './edit-user/edit-user.component';


@NgModule({
  declarations: [
    AdminComponent,
    PhysicianAdminComponent,
    RootComponent,
    AddPatientDeviceComponent,
    UserManagementComponent,
    EditUserComponent
  ],
  imports: [
    RouterModule.forChild([
      { path: '', component: RootComponent },
      { path: 'physician', component: PhysicianAdminComponent },
      { path: 'add-patient-device', component: AddPatientDeviceComponent },
      { path: 'user-management', component: UserManagementComponent }
    ]),
    ReactiveFormsModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatDialogModule,
    MatSlideToggleModule,
    FlexModule,
    CommonModule,
    SharedModule
  ],
  exports: [
    AdminComponent,
    RouterModule
  ]
})
export class AdminModule { }
