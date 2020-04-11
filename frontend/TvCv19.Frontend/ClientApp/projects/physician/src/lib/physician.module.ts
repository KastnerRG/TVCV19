import { NgModule, } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PhysicianComponent } from './physician.component';
import { RootComponent } from './root/root.component';
import { LiveVideoComponent } from './live-video/live-video.component';
import { PatientNavigationComponent } from './patient-navigation/patient-navigation.component';
import { ChatComponent } from './chat/chat.component';
import { routes } from './physician.routes';
import { SharedModule } from 'src/app/shared/shared.module';
import { PatientListComponent } from './patient-list/patient-list.component';
import { PhysicianHeirachyComponent } from './physician-heirachy/physician-heirachy.component';
import { PatientDetailComponent } from './patient-detail/patient-detail.component';

@NgModule({
  declarations: [
    PhysicianComponent,
    RootComponent,
    LiveVideoComponent,
    PatientNavigationComponent,
    ChatComponent,
    PhysicianHeirachyComponent,
    PatientListComponent,
    PatientDetailComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ],
  exports: [PhysicianComponent, RouterModule]
})
export class PhysicianModule { }
