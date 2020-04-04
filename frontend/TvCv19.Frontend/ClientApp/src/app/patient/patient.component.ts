import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatientModel } from '../patient-registration/patient-model';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent implements OnInit {
  patient: PatientModel;
 
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data
    .subscribe((data: { patient: PatientModel }) => {
      this.patient = data.patient;
      
    });
  }

}
