import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PhysicianComponent } from 'projects/physician/src/public-api';

import { PatientRegistrationComponent } from './patient-registration/patient-registration.component'
import { AssignCareGiverRouteResolverService } from './patient-registration/assign-caregiver-route-resolver.service';
import { AssignCareGiverComponent } from './patient-registration/assign-caregiver.component';
import { CameraSetupComponent } from './patient-registration/camera-setup.component';
import { physicianAdminComponent } from './physician-admin/physician-admin.component';

const routes: Routes = [
  { path: 'physician/:physician-id', component: PhysicianComponent, loadChildren: 'projects/physician/src/public-api#PhysicianModule' },
  { path: 'physicians/admin', component: physicianAdminComponent },
  // Patient workflow
  { path: 'patient/registration', component: PatientRegistrationComponent },
  { path: 'patient/registration/camera-setup', component: CameraSetupComponent },
  {
    path: 'patient/registration/assign-caregiver/:id', component: AssignCareGiverComponent, resolve: {
      model: AssignCareGiverRouteResolverService
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
