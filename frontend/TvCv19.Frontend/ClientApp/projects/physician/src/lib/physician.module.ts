import { NgModule, } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';     
import { FlexLayoutModule } from '@angular/flex-layout';                                                                                                                                                  

import { PhysicianComponent } from './physician.component';
import { RootComponent } from './root/root.component';
import { LiveVideoComponent } from './live-video/live-video.component';
import { VideoReceiverComponent } from './video-receiver/video-receiver.component';
import { NavigationComponent } from './navigation/navigation.component';
import { ChatComponent } from './chat/chat.component';

import { routes } from './physician.routes';

@NgModule({
  declarations: [
    PhysicianComponent,
    RootComponent,
    LiveVideoComponent,
    VideoReceiverComponent,
    NavigationComponent,
    ChatComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatBadgeModule,
    FlexLayoutModule
  ],
  exports: [PhysicianComponent, RouterModule]
})
export class PhysicianModule { }
