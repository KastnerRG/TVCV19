import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.scss']
})
export class QrScannerComponent implements OnInit {
  availableDevices: MediaDeviceInfo[];
  currentDevice: MediaDeviceInfo = null;
  
  @Output() scannedId = new EventEmitter<string>();
  constructor() { }

  ngOnInit(): void {
  }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
    this.currentDevice = devices[0]
  }

  onScanSuccess(scan: string) {
    
    //log added patient
    
    //disbale camera
    this.currentDevice = null;
    console.log(scan)
    this.scannedId.emit(scan);
    //naviage to home
  }

}
