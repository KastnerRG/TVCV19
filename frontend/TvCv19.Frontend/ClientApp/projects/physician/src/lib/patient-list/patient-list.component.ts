import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirstLinePatientRouteDataModel } from '../physician-heirachy/firstlinePatientRouteData.model';
import { PatientModel } from 'src/app/shared/models/patient-model';
import { PhysicianModel } from 'src/app/shared/models/physician-model';

@Component({
  selector: 'lib-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss'],
})
export class PatientListComponent implements OnInit {
  patients: Array<PatientModel>;
  id: string;
  physicians: Array<PhysicianModel> = [];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.data.subscribe(
      (data: { model: FirstLinePatientRouteDataModel }) => {
        this.patients = data.model.patients || [];
        this.id = data.model.physicianId || '123';
        this.physicians = data.model.physicians;
        console.log(this.id);
      }
    );
  }
  onClick(patientId: string): void {
      this.router.navigateByUrl(`physician/${this.id}/patient/${patientId}`)
  }
}
