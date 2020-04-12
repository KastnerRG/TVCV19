import { NgModule } from '@angular/core';
import { PatientComponent } from './patient/patient.component';
import { RouterModule } from '@angular/router';
import { PatientRegistrationComponent } from './patient/patient-registration/patient-registration.component';
import { AssignCareGiverComponent } from './patient/patient-registration/assign-caregiver.component';
import { CameraSetupComponent } from './patient/patient-registration/camera-setup.component';
import { SharedModule } from 'projects/shared/src/public-api';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { QRCodeModule } from 'angularx-qrcode';



@NgModule({
  declarations: [
    PatientComponent,
    PatientRegistrationComponent,
    AssignCareGiverComponent,
    CameraSetupComponent,
  ],
  imports: [
    RouterModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    QRCodeModule,
    SharedModule
  ],
  exports: []
})
export class PatientModule { }
