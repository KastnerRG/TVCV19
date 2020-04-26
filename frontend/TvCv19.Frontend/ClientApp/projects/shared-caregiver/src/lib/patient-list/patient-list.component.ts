import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientModel, PhysicianModel, CaregiverRouteDataModel } from 'projects/shared/src/public-api';

@Component({
  selector: 'lib-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss'],
})
export class PatientListComponent implements OnInit {
  patients: Array<PatientModel>;
  id: string;
  careTeam: Array<PhysicianModel> = [];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.data.subscribe(
      (data: { model: CaregiverRouteDataModel }) => {
        this.patients = data.model.patients || [];
        this.id = data.model.id || '123';
        this.careTeam = data.model.careTeam;
      }
    );
  }
}
