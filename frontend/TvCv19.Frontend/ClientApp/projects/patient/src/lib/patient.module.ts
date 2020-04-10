import { NgModule } from '@angular/core';
import { PatientComponent } from './patient/patient.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { PatientRegistrationComponent } from './patient/patient-registration/patient-registration.component';
import { AssignCareGiverComponent } from './patient/patient-registration/assign-caregiver.component';
import { CameraSetupComponent } from './patient/patient-registration/camera-setup.component';



@NgModule({
  declarations: [
    PatientComponent,
    PatientRegistrationComponent,
    AssignCareGiverComponent,
    CameraSetupComponent,
  ],
  imports: [RouterModule,SharedModule
  ],
  exports: []
})
export class PatientModule { }
