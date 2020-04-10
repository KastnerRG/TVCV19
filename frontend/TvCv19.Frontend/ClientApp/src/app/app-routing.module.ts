import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PhysicianComponent } from 'projects/physician/src/public-api';

import { PatientRegistrationComponent } from '../../projects/patient/src/lib/patient/patient-registration/patient-registration.component'
import { AssignCareGiverRouteResolverService } from '../../projects/patient/src/lib/patient/patient-registration/assign-caregiver-route-resolver.service';
import { AssignCareGiverComponent } from '../../projects/patient/src/lib/patient/patient-registration/assign-caregiver.component';
import { CameraSetupComponent } from '../../projects/patient/src/lib/patient/patient-registration/camera-setup.component';
import { physicianAdminComponent } from './admin/physician-admin.component';
import { PatientComponent } from 'projects/patient/src/public-api';

const routes: Routes = [
  { path: 'physician/:physician-id', component: PhysicianComponent, loadChildren: 'projects/physician/src/public-api#PhysicianModule' },
  { path: 'admin/registration', component: physicianAdminComponent },
  // Patient workflow
  {path: 'patient-detail/:id', component: PatientComponent},
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
