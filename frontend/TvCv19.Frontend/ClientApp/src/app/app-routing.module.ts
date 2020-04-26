import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PatientComponent } from 'projects/patient/src/public-api';
import { RootComponent } from './root/root.component';
import { AdminComponent } from 'projects/admin/src/public-api';
import { BedsideComponent } from 'projects/bedside/src/public-api';
import { PhysicianComponent } from 'projects/physician/src/public-api';

const routes: Routes = [
  { path: '', component: RootComponent },
  { path: 'admin', component: AdminComponent, loadChildren: 'projects/admin/src/public-api#AdminModule' },
  { path: 'caregiver', component: BedsideComponent, loadChildren: 'projects/bedside/src/public-api#BedsideModule'  },
  { path: 'patient', component: PatientComponent, loadChildren: 'projects/patient/src/public-api#PatientModule' },
  { path: 'physician', component: PhysicianComponent, loadChildren: 'projects/physician/src/public-api#PhysicianModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
