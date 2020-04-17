import { Routes } from '@angular/router';

import { RootComponent } from './root/root.component';
import { PatientNavigationComponent } from './patient-navigation/patient-navigation.component';
import { LiveVideoComponent } from './live-video/live-video.component';
import { ChatComponent } from './chat/chat.component';
import { PhysicianHeirachyComponent } from './physician-heirachy/physician-heirachy.component';
import { PhysicianRouteResolverService } from './physician-heirachy/physician-heirachy-route-resolver.service';
import { PatientListComponent } from './patient-list/patient-list.component';
import { PatientDetailComponent } from './patient-detail/patient-detail.component';
import { ChangeShiftComponent } from './change-shift/change-shift.component';
import { ChatRouteResolverService } from './chat/chat-route-resolver.service';

export const routes: Routes = [
  {
    path: '',
    component: PhysicianHeirachyComponent,
    resolve: {
      model: PhysicianRouteResolverService,
    },
  },
  {
    path: 'patients',
    component: PatientListComponent,
    resolve: {
      model: PhysicianRouteResolverService,
    },
  },
  { path: 'patient/:patient-id', component: PatientDetailComponent },
  { path: 'patient/:patient-id/chat', component: ChatComponent,
    resolve: {
      messages: ChatRouteResolverService 
    }
  },
];
