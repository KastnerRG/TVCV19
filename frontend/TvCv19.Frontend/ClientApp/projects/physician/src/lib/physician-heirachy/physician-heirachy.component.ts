import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirstLinePatientRouteDataModel } from '../physician-heirachy/firstlinePatientRouteData.model';
import { PatientService, PatientModel, AdmissionStatus, PhysicianModel, HierarchyLevel } from 'projects/shared/src/public-api';

@Component({
  selector: 'app-physician-heirachy',
  templateUrl: './physician-heirachy.component.html',
  styleUrls: ['./physician-heirachy.component.scss']
})

export class PhysicianHeirachyComponent implements OnInit {
  patients: Array<PatientModel>
  physicians: Array<PhysicianModel>
  scanPatientQr: boolean
  scanPhysicianQr: boolean
  private id: string
  constructor(private route: ActivatedRoute, private patientService: PatientService) { }

  ngOnInit(): void {
    this.route.data
      .subscribe((data: { model: FirstLinePatientRouteDataModel }) => {
        this.patients = data.model.patients || [];
        this.id = data.model.physicianId || "123"
        this.physicians = data.model.physicians
        console.log(this.id)
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
