import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientRegistrationModel, PatientService, AuthorizationService } from 'projects/shared/src/public-api';
import { ToolbarService } from 'src/app/toolbar.service';

@Component({
  selector: 'patient-registration',
  templateUrl: './patient-registration.component.html',
  styleUrls: ['./patient-registration.component.scss'],
})
export class PatientRegistrationComponent implements OnInit {
  patientRegistrationForm;
  hide = true;
  patients: Array<PatientRegistrationModel> = []
  constructor(private formBuilder: FormBuilder, private service: PatientService, private authService: AuthorizationService, private toolbarService: ToolbarService, private router: Router) {
    this.patientRegistrationForm = this.formBuilder.group({
      name: '',
      location: '',
      username: '',
      password: ''
    });
  }

  ngOnInit(): void {
    this.toolbarService.setToolbarData({})
  }

  onSubmit(patientRegistration: PatientRegistrationModel) {
    patientRegistration.applicationLoginId = this.authService.getId();

    this.service.admitPatient(patientRegistration).subscribe(
      (p) => {
        patientRegistration.id = p.id;
        this.router.navigateByUrl(
          `/patient/registration/assign-caregiver/${p.id}`
        );
      },
      (error) => console.error(error)
    );
  }
}
