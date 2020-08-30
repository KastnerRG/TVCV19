import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientModel, PatientService } from 'projects/shared/src/public-api';
import { ToolbarService } from 'src/app/toolbar.service';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { MatDateFormats, MAT_NATIVE_DATE_FORMATS, MAT_DATE_FORMATS } from '@angular/material/core';

@Component({
  selector: 'patient-registration',
  templateUrl: './patient-registration.component.html',
  styleUrls: ['./patient-registration.component.scss'],
})
export class PatientRegistrationComponent implements OnInit {
  height_in_ft = [];
  height_in_inches = [];
  ft;
  inches;
  //date: moment.Moment;

  patientRegistrationForm;
  patients: Array<PatientModel> = []
  constructor(private formBuilder: FormBuilder, private service: PatientService, private toolbarService: ToolbarService, private router: Router) {
    this.patientRegistrationForm = this.formBuilder.group({
      name: '',
      location: '',
      caregiverId: '',
      gender: '',
      dateOfBirth: ''
    })
  }

  ngOnInit(): void {
    this.toolbarService.setToolbarData({menu: []})
    this.height_in_ft = Array(9).fill(0).map((x,i)=>i+1);
    this.height_in_inches = Array(12).fill(0).map((x,i)=>i);
  }
  logPatients() {
    console.log(this.patients)
  }

  onSubmit(patient: PatientModel) {
    //patient.dateOfBirth = patient.dateOfBirth.format('YYYY-MM-DD');
    console.log(patient.dateOfBirth);
    patient.height = this.ft + this.inches;
    this.service.admitPatient(patient).subscribe(p => {
      patient.id = p.id;
      this.router.navigateByUrl(`/patient/registration/assign-caregiver/${p.id}`)
    },
      error => console.error(error))
  }
}
