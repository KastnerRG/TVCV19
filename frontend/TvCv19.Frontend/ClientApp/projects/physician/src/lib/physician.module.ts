import { NgModule, } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PhysicianComponent } from './physician.component';
import { RootComponent } from './root/root.component';
import { PatientNavigationComponent } from './patient-navigation/patient-navigation.component';
import { CommonModule } from '@angular/common';
import { QRCodeModule } from 'angularx-qrcode';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { PhysicianRootComponent } from './physician-root/physician-root.component';
import { PatientDetailComponent, PhysicianRouteResolverService, PhysicianHeirachyComponent, SharedCaregiverModule, getCaregiverRoute } from 'projects/shared-caregiver/src/public-api';

@NgModule({
  declarations: [
    PhysicianComponent,
    RootComponent,
    PatientNavigationComponent,
    PhysicianRootComponent
  ],
  imports: [
    RouterModule.forChild(getCaregiverRoute(RootComponent, PhysicianRootComponent)),
    CommonModule,
    QRCodeModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatGridListModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatListModule,
    MatAutocompleteModule,
    MatButtonModule,
    SharedCaregiverModule
  ],
  exports: [PhysicianComponent, RouterModule]
})
export class PhysicianModule { }
