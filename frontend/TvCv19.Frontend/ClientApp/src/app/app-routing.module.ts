import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VolunteerComponent } from './volunteer/volunteer.component';
import { ChatComponent } from './chat/chat.component';
import { PatientAdminComponent } from './patient-admin/patient-admin.component'

const routes: Routes = [
  { path: 'volunteer', component: VolunteerComponent },
  { path: 'patient', component: PatientAdminComponent },
  { path: 'chat', component: ChatComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
