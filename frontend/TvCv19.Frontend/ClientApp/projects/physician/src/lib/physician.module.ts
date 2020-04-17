import { NgModule, } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PhysicianComponent } from './physician.component';
import { RootComponent } from './root/root.component';
import { LiveVideoComponent } from './live-video/live-video.component';
import { PatientNavigationComponent } from './patient-navigation/patient-navigation.component';
import { ChatComponent } from './chat/chat.component';
import { PatientListComponent } from './patient-list/patient-list.component';
import { PatientDetailComponent } from './patient-detail/patient-detail.component';
import { SharedModule, PhysicianHeirachyComponent, PhysicianRouteResolverService } from 'projects/shared/src/public-api';
import { CommonModule } from '@angular/common';
import { VideoReceiverComponent } from './video-receiver/video-receiver.component';
import { QRCodeModule } from 'angularx-qrcode';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { ChangeShiftComponent } from './change-shift/change-shift.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { PhysicianRootComponent } from './physician-root/physician-root.component';

@NgModule({
  declarations: [
    PhysicianComponent,
    RootComponent,
    LiveVideoComponent,
    PatientNavigationComponent,
    ChatComponent,
    PatientListComponent,
    PatientDetailComponent,
    VideoReceiverComponent,
    ChangeShiftComponent,
    PhysicianRootComponent
  ],
  imports: [
    RouterModule.forChild([
      { path: '', component: RootComponent},
      { path: ':id', component: PhysicianRootComponent, children: [
        { path: '',
            component: PhysicianHeirachyComponent,
            resolve: {
              model: PhysicianRouteResolverService
            }
        },
      ]}
    ]),
    CommonModule,
    QRCodeModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatGridListModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatListModule,
    MatAutocompleteModule,
    MatButtonModule,
    SharedModule
  ],
  exports: [PhysicianComponent, RouterModule]
})
export class PhysicianModule { }
