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


@NgModule({
  declarations: [
    AdminComponent,
    PhysicianAdminComponent,
    RootComponent
  ],
  imports: [
    RouterModule.forChild([
      { path: '', component: RootComponent },
      { path: 'physician', component: PhysicianAdminComponent }
    ]),
    ReactiveFormsModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    SharedModule
  ],
  exports: [
    AdminComponent,
    RouterModule
  ]
})
export class AdminModule { }
