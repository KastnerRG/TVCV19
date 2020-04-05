import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LiveVideoComponent } from './live-video/live-video.component';
import { ChatComponent } from './chat/chat.component';
import { PatientAdminComponent } from './patient-admin/patient-admin.component'
import { PatientComponent } from './patient/patient.component';
import { PatientRouteResolverService } from './patient-route-resolver.service';
import { FirstlineComponent } from './firstline/firstline.component';
import { FirstlinePatientRouteResolverService } from './firstline-patient-route-resolver.service';

const routes: Routes = [
  { path: 'live-video/:id', component: LiveVideoComponent },
  { path: 'patient', component: PatientAdminComponent },
  { path: 'chat', component: ChatComponent },
  {
    path: 'patient/:id', component: PatientComponent, resolve: {
      patient: PatientRouteResolverService
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
