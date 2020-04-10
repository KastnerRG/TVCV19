import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrScannerComponent } from './qr/qr-scanner.component';
import { VideoReceiverComponent } from 'projects/physician/src/lib/video-receiver/video-receiver.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LineChartModule } from '@swimlane/ngx-charts';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatGridListModule } from '@angular/material/grid-list';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { QRCodeModule } from 'angularx-qrcode';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';



@NgModule({
  declarations: [
    QrScannerComponent,
    VideoReceiverComponent   
  ],
  
  imports: [
    MatToolbarModule,
    ZXingScannerModule,
    CommonModule
  ],
  exports: [
    ZXingScannerModule,
    FlexLayoutModule,
    LineChartModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatBadgeModule,
    MatGridListModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    MatSidenavModule,
    QRCodeModule,
    MatAutocompleteModule,
    MatCardModule,
    QrScannerComponent,
    VideoReceiverComponent,
    MatMenuModule,
    HttpClientModule,
    CommonModule
   
  ]
})
export class SharedModule { }
