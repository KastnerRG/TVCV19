import { Routes } from '@angular/router';
import { Type } from '@angular/core';
import { PhysicianHeirachyComponent } from './physician-heirachy/physician-heirachy.component';
import { CarerRouteResolverService } from './physician-heirachy/carer-route-resolver.service';
import { PatientDetailComponent } from './patient-detail/patient-detail.component';
import { ChatComponent } from './chat/chat.component';
import { ChangeShiftComponent } from './change-shift/change-shift.component';
import { ChatRouteResolverService } from './chat/chat-route-resolver.service';
import { PatientListComponent } from './patient-list/patient-list.component';
import { PhysicianMessagingChecklistComponent } from './physician-messaging-checklist/physician-messaging-checklist.component';
import { CarerPatientRouteResolverService } from './patient-detail/carer-patient-route-resolver.service';

export function getCaregiverRoute(
  rootComponent: Type<any>,
  caregiverRootComponent: Type<any>
): Routes {
  return [
    { path: '', component: rootComponent },
    {
      path: 'messaging-checklist',
      component: PhysicianMessagingChecklistComponent,
    },
    {
      path: ':id',
      component: caregiverRootComponent,
      children: [
        {
          path: '',
          component: PhysicianHeirachyComponent,
          resolve: {
            model: CarerRouteResolverService,
          },
        },
        {
          path: 'patients',
          component: PatientListComponent,
          resolve: {
            model: CarerRouteResolverService,
          },
        },
        {
          path: 'patient/:id',
          component: caregiverRootComponent,
          children: [
            { path: '', component: PatientDetailComponent },
            {
              path: 'chat',
              component: ChatComponent,
              resolve: {
                messages: ChatRouteResolverService,
              },
            },
            {
              path: 'change-shift',
              component: ChangeShiftComponent,
              resolve: {
                model: CarerPatientRouteResolverService,
              },
            },
          ],
        },
      ],
    },
  ];
}
