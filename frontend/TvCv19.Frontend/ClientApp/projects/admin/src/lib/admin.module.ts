import { NgModule } from '@angular/core';
import { AdminComponent } from './admin.component';
import { PhysicianAdminComponent } from './physician-admin/physician-admin.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';


@NgModule({
  declarations: [
    AdminComponent,
    PhysicianAdminComponent
  ],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatToolbarModule
  ],
  exports: [
    AdminComponent,
    PhysicianAdminComponent
  ]
})
export class AdminModule { }
