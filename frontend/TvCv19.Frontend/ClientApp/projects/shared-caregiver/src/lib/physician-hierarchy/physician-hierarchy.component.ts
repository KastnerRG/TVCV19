import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatientModel, PhysicianModel, PatientService, CaregiverRouteDataModel, HierarchyLevel, PhysicianService } from 'projects/shared/src/public-api';
import { ToolbarService } from 'src/app/toolbar.service';

@Component({
  selector: 'app-physician-hierarchy',
  templateUrl: './physician-hierarchy.component.html',
  styleUrls: ['./physician-hierarchy.component.scss']
})

export class PhysicianHierarchyComponent implements OnInit {
  patients: Array<PatientModel>
  careTeam: Array<PhysicianModel>
  supervisor: PhysicianModel;
  scanPatientQr: boolean
  scanPhysicianQr: boolean
  isSupervisor: boolean
  private id: string
  constructor(private route: ActivatedRoute, private patientService: PatientService, private physicianService: PhysicianService, private toolbarService: ToolbarService) { }

  ngOnInit(): void {
    this.route.data
      .subscribe(async (data: { model: CaregiverRouteDataModel }) => {
        this.patients = data.model.patients || [];
        this.id = data.model.physician.id;
        this.isSupervisor = data.model.physician.hierarchy === HierarchyLevel.SecondLine;
        this.careTeam = data.model.careTeam
        this.toolbarService.setToolbarData({ menu: [], title: data.model.physician.name})
        this.supervisor = await this.physicianService.getPhysician(data.model.physician.supervisorId).toPromise()
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
  addPhysician(physicianId: string): void {
    this.scanPhysicianQr = false
    this.physicianService.getPhysician(physicianId).subscribe(
      p => {
        p.supervisorId = this.id
        this.physicianService.updatePhysician(p).subscribe(p => this.careTeam.push(p))
      }
    )
  }

}
