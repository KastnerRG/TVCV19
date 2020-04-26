import { Component, OnInit } from '@angular/core';
import { PatientService, PatientModel } from 'projects/shared/src/public-api';

@Component({
  selector: 'lib-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss']
})
export class RootComponent implements OnInit {
  patients: PatientModel[];

  constructor(patientService: PatientService) {
    patientService.getPatients()
      .subscribe(p => this.patients = p);
  }

  ngOnInit(): void {
  }

}
