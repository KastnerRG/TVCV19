import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientService, PatientRegistration } from 'projects/shared/src/public-api';
import { ToolbarService } from 'src/app/toolbar.service';
import { Observable } from 'rxjs';
import { Caregiver } from 'projects/caregiver/src/public-api';

@Component({
  selector: 'lib-patient-admin',
  templateUrl: './patient-admin.component.html',
  styleUrls: ['./patient-admin.component.scss']
})
export class PatientAdminComponent implements OnInit {

  patientRegistrationForm;
  options: Caregiver[];
  filteredOptions: Observable<Caregiver[]>;
  caregiverControl = new FormControl();
  constructor(private formBuilder: FormBuilder, private service: PatientService, private toolbarService: ToolbarService, private router: Router) {
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

  onSubmit(patient: PatientRegistration) {
    this.service.admitPatient(patient).subscribe(
      (p) => {
        this.router.navigateByUrl(`/admin`);
      },
      (error) => console.error(error)
    );
  }
}
