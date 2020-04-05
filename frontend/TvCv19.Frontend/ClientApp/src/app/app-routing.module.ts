import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PhysicianComponent } from 'projects/physician/src/public-api';

import { PatientRegistrationComponent } from './patient-registration/patient-registration.component'
import { AssignCareGiverRouteResolverService } from './patient-registration/assign-caregiver-route-resolver.service';
import { FirstlineComponent } from './firstline/firstline.component';
import { FirstlinePatientRouteResolverService } from './firstline-patient-route-resolver.service';
import { AssignCareGiverComponent } from './patient-registration/assign-caregiver.component';
import { CameraSetupComponent } from './patient-registration/camera-setup.component';
import { PhyiscianAdminComponent } from './phyiscian-admin/phyiscian-admin.component';

const routes: Routes = [
  { path: 'physician/:physician-id', component: PhysicianComponent, loadChildren: 'projects/physician/src/public-api#PhysicianModule' },
  { path: 'physicians/admin', component: PhyiscianAdminComponent },
  // Patient workflow
  { path: 'patient/registration', component: PatientRegistrationComponent },
  { path: 'patient/registration/camera-setup', component: CameraSetupComponent },
  {
    path: 'patient/registration/assign-caregiver/:id', component: AssignCareGiverComponent, resolve: {
      model: AssignCareGiverRouteResolverService
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
