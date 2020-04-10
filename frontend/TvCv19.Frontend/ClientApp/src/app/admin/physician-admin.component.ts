import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PhysicianService } from '../shared/services/physician.service';
import { PhysicianModel } from '../shared/models/physician-model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-phyiscian-admin',
  templateUrl: './physician-admin.component.html',
  styleUrls: ['./physician-admin.component.scss']
})
export class physicianAdminComponent implements OnInit {
  caregiverRegistrationForm;
  patients: Array<PhysicianModel> = []
  constructor(private formBuilder: FormBuilder, private service: PhysicianService, private router: Router) {
    this.caregiverRegistrationForm = this.formBuilder.group({
      name: '',
      location: '',
      heirachy: ''
    })
  }

  ngOnInit(): void { }

  onSubmit(physician: PhysicianModel) {
    this.service.addPhysician(physician).subscribe(p => {
      this.router.navigateByUrl(`/physician/${p.id}/patients`)
    },
      error => console.error(error))
  }
}
