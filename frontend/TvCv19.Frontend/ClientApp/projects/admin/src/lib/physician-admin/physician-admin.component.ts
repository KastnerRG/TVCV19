import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PhysicianModel, PhysicianService, HierarchyLevel } from 'projects/shared/src/public-api';
import { UserManagementService } from '../user-management.service';

@Component({
  selector: 'lib-phyiscian-admin',
  templateUrl: './physician-admin.component.html',
  styleUrls: ['./physician-admin.component.scss'],
})
export class PhysicianAdminComponent implements OnInit {
  caregiverRegistrationForm: FormGroup;
  physicians: Array<PhysicianModel> = []
  commanders: Array<PhysicianModel> = []
  constructor(private formBuilder: FormBuilder, private service: PhysicianService, private userManagementService: UserManagementService, private router: Router) {
    
    service.getPhysicians().subscribe(physicians => {
      this.physicians = physicians.filter(p => p.hierarchy === HierarchyLevel.SecondLine)
      this.commanders = physicians.filter(p => p.hierarchy === HierarchyLevel.Commander)
    });
    
    this.caregiverRegistrationForm = this.formBuilder.group({
      name: '',
      location: '',
      hierarchy: '',
      supervisorId: '',
      userName: '',
      password: ''
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    this.userManagementService.createApplicationLogin({
      userName: this.caregiverRegistrationForm.value.userName
    }, this.caregiverRegistrationForm.value.password).subscribe(a => {
      this.service.addPhysician({
        applicationLoginId: a.id,
        hierarchy: this.caregiverRegistrationForm.value.hierarchy,
        location: this.caregiverRegistrationForm.value.location,
        name: this.caregiverRegistrationForm.value.name,
        supervisorId: this.caregiverRegistrationForm.value.supervisorId
      }).subscribe(p => {
        this.router.navigateByUrl(`/`)
      },
      error => console.error(error))
    },
    error => console.error(error));
  }
}
