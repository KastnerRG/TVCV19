import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PatientComponent } from 'projects/patient/src/public-api';
import { RootComponent } from './root/root.component';
import { AdminComponent } from 'projects/admin/src/public-api';
import { LoginComponent } from './login/login.component';
import { AuthorizationGuard } from 'projects/shared/src/public-api';
import { CaregiverComponent } from 'projects/caregiver/src/public-api';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AuthorizationGuard], loadChildren: 'projects/admin/src/public-api#AdminModule' },
  { path: 'patient', component: PatientComponent, canActivate: [AuthorizationGuard], loadChildren: 'projects/patient/src/public-api#PatientModule' },
  { path: 'caregiver', component: CaregiverComponent, canActivate: [AuthorizationGuard], loadChildren: 'projects/caregiver/src/public-api#CaregiverModule' },
  { path: '', canActivate: [AuthorizationGuard], component: RootComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
