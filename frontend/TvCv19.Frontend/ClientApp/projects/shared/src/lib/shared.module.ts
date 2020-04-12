import { NgModule } from '@angular/core';
import { SharedComponent } from './shared.component';
import { QRCodeModule } from 'angularx-qrcode';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { QrScannerComponent } from './qr/qr-scanner.component';



@NgModule({
  declarations: [
    SharedComponent,
    QrScannerComponent
  ],
  imports: [
    QRCodeModule,
    ZXingScannerModule,
    MatToolbarModule
  ],
  exports: [
    SharedComponent,
    QrScannerComponent
  ]
})
export class SharedModule { }
