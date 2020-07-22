import { Component, OnInit } from '@angular/core';
import { PatientAuthorizationService } from '../patient-authorization.service';

@Component({
  selector: 'lib-patient-authorization',
  templateUrl: './patient-authorization.component.html',
  styleUrls: ['./patient-authorization.component.scss']
})
export class PatientAuthorizationComponent implements OnInit {

  constructor(patientAuthorizationService: PatientAuthorizationService) { }

  ngOnInit(): void {
  }

}
