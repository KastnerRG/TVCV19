import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PatientComponent } from 'projects/patient/src/public-api';
import { RootComponent } from './root/root.component';
import { AdminComponent } from 'projects/admin/src/public-api';
import { BedsideComponent } from 'projects/bedside/src/public-api';
import { PhysicianComponent, CommanderRootComponent } from 'projects/physician/src/public-api';
import { LoginComponent } from './login/login.component';
import { AuthorizationGuard } from 'projects/shared/src/public-api';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AuthorizationGuard], loadChildren: 'projects/admin/src/public-api#AdminModule' },
  { path: 'caregiver', component: BedsideComponent, canActivate: [AuthorizationGuard], loadChildren: 'projects/bedside/src/public-api#BedsideModule'  },
  { path: 'patient', component: PatientComponent, loadChildren: 'projects/patient/src/public-api#PatientModule' },
  { path: 'physician', component: PhysicianComponent, canActivate: [AuthorizationGuard], loadChildren: 'projects/physician/src/public-api#PhysicianModule' },
  { path: '', canActivate: [AuthorizationGuard], component: RootComponent },
  { path: 'commander', canActivate: [AuthorizationGuard], component: CommanderRootComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
