import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatientModel, PhysicianModel, CaregiverRouteDataModel, HierarchyLevel } from 'projects/shared/src/public-api';

@Component({
  selector: 'lib-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss'],
})
export class PatientListComponent implements OnInit {
  patients: Array<PatientModel>;
  careTeam: Array<PhysicianModel> = [];
  isFirstLine: boolean

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe(
      (data: { model: CaregiverRouteDataModel }) => {
        this.patients = data.model.patients || [];
        this.isFirstLine = data.model.physician.hierarchy === HierarchyLevel.FirstLine;
        this.careTeam = data.model.careTeam;
      }
    );
  }
}
