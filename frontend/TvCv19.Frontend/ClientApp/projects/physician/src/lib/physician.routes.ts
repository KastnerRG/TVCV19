import { Routes } from '@angular/router';

import { RootComponent } from './root/root.component';
import { NavigationComponent } from './navigation/navigation.component';
import { LiveVideoComponent } from './live-video/live-video.component';
import { ChatComponent } from './chat/chat.component';
import { PhysicianHeirachyComponent } from './physician-heirachy/physician-heirachy.component';
import { PhysicianRouteResolverService } from './physician-heirachy/physician-heirachy-route-resolver.service';

export const routes: Routes = [
    { path: '', component: RootComponent },
    { path: 'heirachy', component: PhysicianHeirachyComponent, resolve: {
        model: PhysicianRouteResolverService
    } },
    { path: 'patient/:patient-id', component: NavigationComponent, children: [
        { path: 'live-video', component: LiveVideoComponent },
        { path: 'chat', component: ChatComponent }
    ]}
];