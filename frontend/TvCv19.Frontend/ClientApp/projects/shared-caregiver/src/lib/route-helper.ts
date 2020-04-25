import { Routes } from '@angular/router';
import { Type } from '@angular/core';
import { PhysicianHeirachyComponent } from './physician-heirachy/physician-heirachy.component';
import { PhysicianRouteResolverService } from './physician-heirachy/physician-heirachy-route-resolver.service';
import { PatientDetailComponent } from './patient-detail/patient-detail.component';
import { ChatComponent } from './chat/chat.component';
import { ChangeShiftComponent } from './change-shift/change-shift.component';
import { ChatRouteResolverService } from './chat/chat-route-resolver.service';

export function getCaregiverRoute(rootComponent: Type<any>, caregiverRootComponent: Type<any>): Routes {
    return [
        { path: '', component: rootComponent }, 
        { path: ':id', component: caregiverRootComponent, children: [
            { path: '',
                component: PhysicianHeirachyComponent,
                resolve: {
                    model: PhysicianRouteResolverService
                }
            },
            { path: 'patient/:id', component: caregiverRootComponent, children: [
                { path: '', component: PatientDetailComponent },
                { path: 'chat', component: ChatComponent, 
                  resolve: {
                    messages: ChatRouteResolverService 
                  } 
                },
                { path: 'change-shift', component: ChangeShiftComponent }
            ]}
        ]}
    ];
}