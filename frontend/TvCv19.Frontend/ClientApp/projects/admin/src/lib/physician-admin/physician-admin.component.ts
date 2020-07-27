import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { PhysicianModel, PhysicianService, HierarchyLevel } from 'projects/shared/src/public-api';

@Component({
  selector: 'lib-phyiscian-admin',
  templateUrl: './physician-admin.component.html',
  styleUrls: ['./physician-admin.component.scss'],
})
export class PhysicianAdminComponent implements OnInit {
  caregiverRegistrationForm;
  physicians: Array<PhysicianModel> = []
  commanders: Array<PhysicianModel> = []
  constructor(private formBuilder: FormBuilder, private service: PhysicianService, private router: Router) {
    
    service.getPhysicians().subscribe(physicians => {
      this.physicians = physicians.filter(p => p.hierarchy === HierarchyLevel.SecondLine)
      this.commanders = physicians.filter(p => p.hierarchy === HierarchyLevel.Commander)
    });
    
    this.caregiverRegistrationForm = this.formBuilder.group({
      name: '',
      location: '',
      hierarchy: '',
      supervisorId: '',
    });
  }

  ngOnInit(): void {}

  onSubmit(physician: PhysicianModel) {
    this.service.addPhysician(physician).subscribe(p => {
      this.router.navigateByUrl(`/`)
    },
      error => console.error(error))
  }
}
