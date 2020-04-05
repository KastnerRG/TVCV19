import { Routes } from '@angular/router';

import { RootComponent } from './root/root.component';
import { PatientNavigationComponent } from './patient-navigation/patient-navigation.component';
import { LiveVideoComponent } from './live-video/live-video.component';
import { ChatComponent } from './chat/chat.component';
import { PhysicianRouteResolverService } from './physician-route-resolver.service';

export const routes: Routes = [
    { path: '', component: RootComponent },
    { path: 'patient/:patient-id', component: PatientNavigationComponent, children: [
        { path: 'live-video', component: LiveVideoComponent },
        { path: 'chat', component: ChatComponent }
    ]}
];