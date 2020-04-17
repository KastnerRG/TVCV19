import { NgModule } from '@angular/core';
import { SharedComponent } from './shared.component';
import { QRCodeModule } from 'angularx-qrcode';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { QrScannerComponent } from './components/qr-scanner/qr-scanner.component';
import { HttpClientModule } from '@angular/common/http';
import { PhysicianHeirachyComponent } from './components/physician-heirachy/physician-heirachy.component';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    SharedComponent,
    QrScannerComponent,
    PhysicianHeirachyComponent
  ],
  imports: [
    CommonModule,
    QRCodeModule,
    ZXingScannerModule,
    HttpClientModule,
    MatToolbarModule,
    MatIconModule,
    MatGridListModule,
    MatButtonModule
  ],
  exports: [
    SharedComponent,
    QrScannerComponent,
    HttpClientModule
  ]
})
export class SharedModule { }
