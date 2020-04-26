import { NgModule } from '@angular/core';
import { BedsideComponent } from './bedside.component';
import { RootComponent } from './root/root.component';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { BedsideRootComponent } from './bedside-root/bedside-root.component';
import { PhysicianHeirachyComponent, CarerRouteResolverService, PatientDetailComponent, SharedCaregiverModule, getCaregiverRoute } from 'projects/shared-caregiver/src/public-api';



@NgModule({
  declarations: [
    BedsideComponent,
    RootComponent,
    BedsideRootComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(getCaregiverRoute(RootComponent, BedsideRootComponent)),
    MatListModule,
    MatButtonModule,
    SharedCaregiverModule
  ],
  exports: [BedsideComponent]
})
export class BedsideModule { }
