import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PatientService } from '../patient.service';
import { PatientModel } from './patient-model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-admin',
  templateUrl: './patient-admin.component.html',
  styleUrls: ['./patient-admin.component.scss']
})
export class PatientAdminComponent implements OnInit {
  patientForm;
  patients: Array<PatientModel> = []
  constructor(private formBuilder: FormBuilder, private service: PatientService, private router: Router) {
    this.patientForm = this.formBuilder.group({
      name: '',
      location: '',
      caregiverId: ''
    })
  }

  ngOnInit(): void {
  }
  logPatients() {
    console.log(this.patients)
  }

  onSubmit(patient: PatientModel) {
    this.service.admitPatient(patient).subscribe(p => {
      patient.id = p.id;
      this.router.navigateByUrl(`/patient/${p.id}`)
    },
      error => console.error(error))
  }
}
