import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PatientRegistrationComponent } from '../../projects/patient/src/lib/patient/patient-registration/patient-registration.component';
import { AssignCareGiverComponent } from '../../projects/patient/src/lib/patient/patient-registration/assign-caregiver.component';
import { CameraSetupComponent } from '../../projects/patient/src/lib/patient/patient-registration/camera-setup.component';
import { physicianAdminComponent } from './admin/physician-admin.component';
import { PhysicianHeirachyComponent } from '../../projects/physician/src/lib/physician-heirachy/physician-heirachy.component';
import { PatientListComponent } from 'projects/physician/src/lib/patient-list/patient-list.component';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    physicianAdminComponent,
  
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
