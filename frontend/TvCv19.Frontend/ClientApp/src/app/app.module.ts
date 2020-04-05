import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatCardModule} from '@angular/material/card';
import { LineChartModule } from '@swimlane/ngx-charts';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import { ZXingScannerModule } from '@zxing/ngx-scanner'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PatientRegistrationComponent } from './patient-registration/patient-registration.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { QrScannerComponent } from './qr/qr-scanner.component';
import { AssignCareGiverComponent } from './patient-registration/assign-caregiver.component';
import { CameraSetupComponent } from './patient-registration/camera-setup.component';
import { physicianAdminComponent } from './physician-admin/physician-admin.component';
import { PhysicianHeirachyComponent } from '../../projects/physician/src/lib/physician-heirachy/physician-heirachy.component';

@NgModule({
  declarations: [
    AppComponent,
    PatientRegistrationComponent,
    QrScannerComponent,
    AssignCareGiverComponent,
    CameraSetupComponent,
    physicianAdminComponent,
    PhysicianHeirachyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    LineChartModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatBadgeModule,
    MatGridListModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    MatSidenavModule,
    QRCodeModule,
    ZXingScannerModule,
    MatAutocompleteModule,
    MatCardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
