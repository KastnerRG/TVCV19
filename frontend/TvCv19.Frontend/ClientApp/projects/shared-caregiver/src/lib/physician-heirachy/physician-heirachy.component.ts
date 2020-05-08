import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatientModel, PhysicianModel, PatientService, CaregiverRouteDataModel, HierarchyLevel } from 'projects/shared/src/public-api';

@Component({
  selector: 'app-physician-heirachy',
  templateUrl: './physician-heirachy.component.html',
  styleUrls: ['./physician-heirachy.component.scss']
})

export class PhysicianHeirachyComponent implements OnInit {
  patients: Array<PatientModel>
  careTeam: Array<PhysicianModel>
  scanPatientQr: boolean
  scanPhysicianQr: boolean
  isSupervisor: boolean
  private id: string
  constructor(private route: ActivatedRoute, private patientService: PatientService) { }

  ngOnInit(): void {
    this.route.data
      .subscribe((data: { model: CaregiverRouteDataModel }) => {
        this.patients = data.model.patients || [];
        this.id = data.model.physician.id;
        this.isSupervisor = data.model.physician.hierarchy === HierarchyLevel.SecondLine;
        this.careTeam = data.model.careTeam
      });
  }

  addPatient(id: string): void {
    this.scanPatientQr = false
    this.patientService.getPatient(id).subscribe(
        patient => {
          patient.caregiverId = this.id
          this.patientService.updatePatient(patient).subscribe(p => this.patients.push(p))
        } 
      )
  }
  addPhysician(patientId: string): void {
    this.scanPhysicianQr = false
    // todo update physician report
    console.log('scanned id')
  }

}
