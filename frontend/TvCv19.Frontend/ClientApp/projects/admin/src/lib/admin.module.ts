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
import { MatListModule } from '@angular/material/list';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { PatientAdminComponent } from './patient-admin/patient-admin.component';
import { AdminTableComponent } from './admin-table/admin-table.component';


@NgModule({
  declarations: [
    AdminComponent,
    PhysicianAdminComponent,
    RootComponent,
    PatientAdminComponent,
    AdminTableComponent
  ],
  imports: [
    RouterModule.forChild([
      { path: '', component: RootComponent },
      { path: 'physician', component: PhysicianAdminComponent },
      { path: 'patient', component: PatientAdminComponent }
    ]),
    ReactiveFormsModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatAutocompleteModule,
    MatOptionModule,
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
