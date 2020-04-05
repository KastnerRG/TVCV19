import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PhysicianService } from '../physician.service';
import { PhysicianModel } from './physician-model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-phyiscian-admin',
  templateUrl: './physician-admin.component.html',
  styleUrls: ['./physician-admin.component.scss']
})
export class physicianAdminComponent implements OnInit {
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
      this.router.navigateByUrl(`/physician/${p.id}/heirachy`)
    },
      error => console.error(error))
  }
}
