import { Component, OnInit } from '@angular/core';
import { DeviceAuthorizationService } from 'projects/shared/src/public-api';

@Component({
  selector: 'lib-add-patient-device',
  templateUrl: './add-patient-device.component.html',
  styleUrls: ['./add-patient-device.component.scss']
})
export class AddPatientDeviceComponent implements OnInit {

  constructor(private deviceAuthorizationService: DeviceAuthorizationService) { }

  ngOnInit(): void {
  }

  scanned(qrData: string) {
    let parts = qrData.split(';');

    this.deviceAuthorizationService.endRegisterPatientDevice(parts[0], {
      connectionId: parts[1]
    }).subscribe(_ => _);
  }

}
