import { Component, OnInit } from '@angular/core';
import { DeviceAuthorizationService } from 'projects/shared/src/public-api';

@Component({
  selector: 'lib-patient-authorization',
  templateUrl: './patient-authorization.component.html',
  styleUrls: ['./patient-authorization.component.scss']
})
export class PatientAuthorizationComponent implements OnInit {

  qrData: string;

  constructor(private deviceAuthorizationSerivce: DeviceAuthorizationService) { }

  ngOnInit(): void {
    this.deviceAuthorizationSerivce.beginRegisterPatientDevice()
      .subscribe(async token => this.qrData = `${token};${await this.deviceAuthorizationSerivce.getConnectionIdAsync()}`);
  }

}
