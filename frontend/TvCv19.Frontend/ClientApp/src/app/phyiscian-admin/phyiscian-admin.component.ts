import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PatientService } from '../patient.service';

@Component({
  selector: 'app-phyiscian-admin',
  templateUrl: './phyiscian-admin.component.html',
  styleUrls: ['./phyiscian-admin.component.scss']
})
export class PhyiscianAdminComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private service: PatientService) { 
    this.patientRegistrationForm = this.formBuilder.group({
      name: '',
      location: '',
      caregiverId: ''
    })
  }

  ngOnInit(): void {
  }

}
