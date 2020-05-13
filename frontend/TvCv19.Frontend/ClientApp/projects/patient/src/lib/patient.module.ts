import { NgModule } from '@angular/core';
// import { PatientComponent } from './patient/patient.component';
import { RouterModule } from '@angular/router';
import { PatientRegistrationComponent } from './patient/patient-registration/patient-registration.component';
import { AssignCareGiverComponent } from './patient/patient-registration/assign-caregiver.component';
import { CameraSetupComponent } from './patient/patient-registration/camera-setup.component';
import { SharedModule } from 'projects/shared/src/public-api';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { QRCodeModule } from 'angularx-qrcode';
import { RootComponent } from './root/root.component';
import { PatientComponent } from './patient.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { PatientRegistrationRootComponent } from './patient-registration-root/patient-registration-root.component';
import { AssignCareGiverRouteResolverService } from './patient/patient-registration/assign-caregiver-route-resolver.service';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { PatientFeedComponent } from './patient-feed/patient-feed.component';
import { FlexModule } from '@angular/flex-layout';



@NgModule({
  declarations: [
    PatientComponent,
    PatientRegistrationComponent,
    AssignCareGiverComponent,
    CameraSetupComponent,
    RootComponent,
    PatientRegistrationRootComponent,
    PatientFeedComponent
  ],
  imports: [
    RouterModule.forChild([
      { path: '', component: RootComponent },
      { path: 'live/:id', component: PatientFeedComponent},
      { path: 'registration', component: PatientRegistrationRootComponent, children: [
        { path: '', component: PatientRegistrationComponent },
        { path: 'assign-caregiver/:id', component: AssignCareGiverComponent, resolve: {
          model: AssignCareGiverRouteResolverService }
        },
        { path: 'camera-setup/:id', component: CameraSetupComponent }
      ]}
    ]),
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatAutocompleteModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatOptionModule,
    QRCodeModule,
    FlexModule,
    SharedModule
  ],
  exports: []
})
export class PatientModule { }
