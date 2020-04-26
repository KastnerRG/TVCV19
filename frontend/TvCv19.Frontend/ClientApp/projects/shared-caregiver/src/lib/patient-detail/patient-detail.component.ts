import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'lib-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.scss'],
})
export class PatientDetailComponent implements OnInit {
  patientId: any;
  physicianId: any;

  constructor(route: ActivatedRoute, private router: Router) {
    route.params.subscribe((p) => (this.patientId = p['patient-id']));
    route.parent.params.subscribe((p: any) => {
      this.physicianId = p['physician-id']
    })
  }

  ngOnInit(): void {}

  chat(): void {
    this.router.navigateByUrl(`/physician/${this.physicianId}/patient/${this.patientId}/chat`);
  }

  shift(): void {
    this.router.navigateByUrl(`/physician/${this.physicianId}/patient/${this.patientId}/shift`);
  }
}
