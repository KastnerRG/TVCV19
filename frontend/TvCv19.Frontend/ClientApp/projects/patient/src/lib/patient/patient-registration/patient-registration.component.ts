import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientModel, PatientService } from 'projects/shared/src/public-api';
import { ToolbarService } from 'src/app/toolbar.service';

@Component({
  selector: 'patient-registration',
  templateUrl: './patient-registration.component.html',
  styleUrls: ['./patient-registration.component.scss'],
})
export class PatientRegistrationComponent implements OnInit {
  patientRegistrationForm;
  patients: Array<PatientModel> = []
  constructor(private formBuilder: FormBuilder, private service: PatientService, private toolbarService: ToolbarService, private router: Router) {
    this.patientRegistrationForm = this.formBuilder.group({
      name: '',
      location: '',
      age: '',
      caregiverId: '',
    });
  }

  ngOnInit(): void {
    this.toolbarService.setToolbarData({menu: []})
  }

  onSubmit(patient: PatientModel) {
    this.service.admitPatient(patient).subscribe(
      (p) => {
        patient.id = p.id;
        this.router.navigateByUrl(
          `/patient/registration/assign-caregiver/${p.id}`
        );
      },
      (error) => console.error(error)
    );
  }
}
