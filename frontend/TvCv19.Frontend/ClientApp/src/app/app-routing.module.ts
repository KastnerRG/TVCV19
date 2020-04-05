import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { PatientComponent } from 'projects/patient/src/public-api';
import { PhysicianComponent } from 'projects/physician/src/public-api';

import { PatientAdminComponent } from './patient-admin/patient-admin.component'
import { PatientComponent } from './patient/patient.component';
import { PatientRouteResolverService } from './patient-route-resolver.service';
import { FirstlineComponent } from './firstline/firstline.component';
import { FirstlinePatientRouteResolverService } from './firstline-patient-route-resolver.service';

const routes: Routes = [
  // { path: 'patient', component: PatientComponent },
  { path: 'physician/:physician-id', component: PhysicianComponent, loadChildren: 'projects/physician/src/public-api#PhysicianModule' },

  // Patient workflow
  { path: 'patient', component: PatientAdminComponent },
  {
    path: 'patient/:id', component: PatientComponent, resolve: {
      patient: PatientRouteResolverService
    }
  },
  {
    path: 'firstline/patients/:id', component: FirstlineComponent, resolve: {
      model: FirstlinePatientRouteResolverService
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
