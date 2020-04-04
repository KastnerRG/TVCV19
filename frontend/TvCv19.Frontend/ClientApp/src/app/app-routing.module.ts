import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LiveVideoComponent } from './live-video/live-video.component';
import { ChatComponent } from './chat/chat.component';
import { PatientAdminComponent } from './patient-admin/patient-admin.component'

const routes: Routes = [
  { path: 'live-video/:id', component: LiveVideoComponent },
  { path: 'patient', component: PatientAdminComponent },
  { path: 'chat', component: ChatComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
