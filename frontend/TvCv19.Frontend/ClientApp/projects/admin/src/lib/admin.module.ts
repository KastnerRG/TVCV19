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
import { FlexModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { AddPatientDeviceComponent } from './add-patient-device/add-patient-device.component';
import { MatListModule } from '@angular/material/list';


@NgModule({
  declarations: [
    AdminComponent,
    PhysicianAdminComponent,
    RootComponent,
    AddPatientDeviceComponent
  ],
  imports: [
    RouterModule.forChild([
      { path: '', component: RootComponent },
      { path: 'physician', component: PhysicianAdminComponent },
      { path: 'add-patient-device', component: AddPatientDeviceComponent }
    ]),
    ReactiveFormsModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
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
