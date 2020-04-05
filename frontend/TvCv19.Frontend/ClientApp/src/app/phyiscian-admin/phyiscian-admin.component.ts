import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PhysicianService } from '../physician.service';
import { PhysicianModel } from './phyiscian-model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-phyiscian-admin',
  templateUrl: './phyiscian-admin.component.html',
  styleUrls: ['./phyiscian-admin.component.scss']
})
export class PhyiscianAdminComponent implements OnInit {
  physicianRegistrationForm;
  patients: Array<PhysicianModel> = []
  constructor(private formBuilder: FormBuilder, private service: PhysicianService, private router: Router) {
    this.physicianRegistrationForm = this.formBuilder.group({
      name: '',
      location: '',
      caregiverId: ''
    })
  }

  ngOnInit(): void {
  }
  logPs() {
    console.log(this.patients)
  }

  onSubmit(physician: PhysicianModel) {
    this.service.addPhysician(physician).subscribe(p => {
      physician.id = p.id;
      this.router.navigateByUrl(`/patient/registration/assign-caregiver/${p.id}`)
    },
      error => console.error(error))
  }
}
