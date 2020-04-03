import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PatientService } from '../patient.service';
import { PatientModel } from './patient-model';

@Component({
  selector: 'app-patient-admin',
  templateUrl: './patient-admin.component.html',
  styleUrls: ['./patient-admin.component.scss']
})
export class PatientAdminComponent implements OnInit {
  patientForm;
  patients: Array<PatientModel> = []
  constructor(private formBuilder: FormBuilder, private service: PatientService) {
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
    console.log(patient)
    this.patients.push(patient)
    this.service.admitPatient(patient).subscribe(id => {
      patient.id = id;
      this.patients.push(patient)
    },
      error => console.error(error))
  }
}
