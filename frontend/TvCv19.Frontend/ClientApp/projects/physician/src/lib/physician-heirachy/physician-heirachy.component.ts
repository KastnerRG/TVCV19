import { Component, OnInit } from '@angular/core';
import { PatientModel, AdmissionStatus } from '../../../../../src/app/patient-registration/patient-model';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from '../../../../../src/app/patient.service';
import { PhysicianModel, HierarchyLevel } from 'src/app/physician-admin/physician-model';

@Component({
  selector: 'app-physician-heirachy',
  templateUrl: './physician-heirachy.component.html',
  styleUrls: ['./physician-heirachy.component.scss']
})

export class PhysicianHeirachyComponent implements OnInit {
  patients: Array<PatientModel> = [{addmissionStatus: AdmissionStatus.Admitted, name: 'Stephen', id: 'patient1', caregiverId: '5', location: 'West wing'}]
  physicians: Array<PhysicianModel> = [{hierarchyLevel: HierarchyLevel.SecondLine, id: '2', name: 'Dr. Seuss', messages: [], reportId: '1', location: 'East Wing'},
                                   {hierarchyLevel: HierarchyLevel.FirstLine, id: '3', name: 'Dr. Barrow', messages: [], reportId: '2',location: 'East Wing'}]
  scanPatientQr: boolean
  scanPhysicianQr: boolean
  private id: string
  constructor(private route: ActivatedRoute, private patientService: PatientService) { }

  ngOnInit(): void {
    // this.route.data
    //   .subscribe((data: { model: FirstLinePatientRouteDataModel }) => {
    //     this.patients = data.model.patients || [];
    //     this.id = data.model.physicianId || "123"
    //     this.physicians = data.model.physicians
    //     console.log(this.id)
    //   });
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
