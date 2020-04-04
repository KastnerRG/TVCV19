import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import {MatGridListModule} from '@angular/material/grid-list';
import { LineChartModule } from '@swimlane/ngx-charts';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import { ZXingScannerModule } from '@zxing/ngx-scanner'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LiveVideoComponent } from './live-video/live-video.component';
import { VideoReceiverComponent } from './video-receiver/video-receiver.component';
import { ChatComponent } from './chat/chat.component';
import { PatientAdminComponent } from './patient-admin/patient-admin.component';
import { NavigationComponent } from './navigation/navigation.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { PatientComponent } from './patient/patient.component';
import { QrScannerComponent } from './qr/qr-scanner.component';
import { FirstlineComponent } from './firstline/firstline.component';

@NgModule({
  declarations: [
    AppComponent,
    LiveVideoComponent,
    VideoReceiverComponent,
    ChatComponent,
    PatientAdminComponent,
    NavigationComponent,
    PatientComponent,
    QrScannerComponent,
    FirstlineComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    LineChartModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatBadgeModule,
    MatGridListModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    MatSidenavModule,
    QRCodeModule,
    ZXingScannerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
