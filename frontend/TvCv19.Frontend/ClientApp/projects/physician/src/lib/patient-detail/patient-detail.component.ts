import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'lib-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.scss']
})
export class PatientDetailComponent implements OnInit {
  patientId: any;

  constructor(route: ActivatedRoute) {
  route.params.subscribe(p => 
     this.patientId = p['patient-id'])
  }

  ngOnInit(): void {
  }

}
