import { Component, OnInit } from '@angular/core';
import { PatientModel } from '../patient-admin/patient-model';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from '../patient.service';
import { FirstLinePatientRouteDataModel } from './firstlinePatientRouteData.model';

@Component({
  selector: 'app-firstline',
  templateUrl: './firstline.component.html',
  styleUrls: ['./firstline.component.scss']
})
export class FirstlineComponent implements OnInit {
  patients: Array<PatientModel> = []
  scanQr: boolean
  private id: string
  constructor(private route: ActivatedRoute, private patientService: PatientService) { }

  ngOnInit(): void {
    this.route.data
      .subscribe((data: { model: FirstLinePatientRouteDataModel }) => {
        this.patients = data.model.patients || [];
        this.id = data.model.caregiverId || "123"
      });
  }

  addToPatients(patientId: string): void {
    this.scanQr = false
    this.patientService.getPatient(patientId).subscribe(
        patient => {
          patient.caregiverId = this.id
          this.patientService.updatePatient(patient).subscribe(p => this.patients.push(p))
        } 
      )
  }

}

