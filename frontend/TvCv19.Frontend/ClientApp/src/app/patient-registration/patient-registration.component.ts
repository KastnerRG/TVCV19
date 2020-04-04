import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PatientService } from '../patient.service';
import { PatientModel } from './patient-model';
import { Router } from '@angular/router';

@Component({
  selector: 'patient-registration',
  templateUrl: './patient-registration.component.html',
  styleUrls: ['./patient-registration.component.scss']
})
export class PatientRegistrationComponent implements OnInit {
  patientRegistrationForm;
  patients: Array<PatientModel> = []
  constructor(private formBuilder: FormBuilder, private service: PatientService, private router: Router) {
    this.patientRegistrationForm = this.formBuilder.group({
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
