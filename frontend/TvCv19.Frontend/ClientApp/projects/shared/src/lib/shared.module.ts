import { NgModule } from '@angular/core';
import { SharedComponent } from './shared.component';
import { QRCodeModule } from 'angularx-qrcode';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { QrScannerComponent } from './components/qr-scanner/qr-scanner.component';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VideoReceiverComponent } from './components/video-receiver/video-receiver.component';
import { FlexLayoutModule } from '@angular/flex-layout';



@NgModule({
  declarations: [
    SharedComponent,
    QrScannerComponent,
    VideoReceiverComponent
  ],
  imports: [
    RouterModule,
    CommonModule,
    QRCodeModule,
    ZXingScannerModule,
    HttpClientModule,
    MatToolbarModule,
    MatIconModule,
    MatGridListModule,
    MatButtonModule,
    FlexLayoutModule
  ],
  exports: [
    SharedComponent,
    QrScannerComponent,
    HttpClientModule,
    VideoReceiverComponent
  ]
})
export class SharedModule { }
