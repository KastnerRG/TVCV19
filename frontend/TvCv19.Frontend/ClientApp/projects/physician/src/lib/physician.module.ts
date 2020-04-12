import { NgModule, } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PhysicianComponent } from './physician.component';
import { RootComponent } from './root/root.component';
import { LiveVideoComponent } from './live-video/live-video.component';
import { PatientNavigationComponent } from './patient-navigation/patient-navigation.component';
import { ChatComponent } from './chat/chat.component';
import { routes } from './physician.routes';
import { PatientListComponent } from './patient-list/patient-list.component';
import { PhysicianHeirachyComponent } from './physician-heirachy/physician-heirachy.component';
import { PatientDetailComponent } from './patient-detail/patient-detail.component';
import { SharedModule } from 'projects/shared/src/public-api';
import { CommonModule } from '@angular/common';
import { VideoReceiverComponent } from './video-receiver/video-receiver.component';
import { QRCodeModule } from 'angularx-qrcode';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [
    PhysicianComponent,
    RootComponent,
    LiveVideoComponent,
    PatientNavigationComponent,
    ChatComponent,
    PhysicianHeirachyComponent,
    PatientListComponent,
    PatientDetailComponent,
    VideoReceiverComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    QRCodeModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatGridListModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatListModule,
    SharedModule
  ],
  exports: [PhysicianComponent, RouterModule]
})
export class PhysicianModule { }
