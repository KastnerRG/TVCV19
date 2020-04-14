import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PhysicianService } from '../shared/services/physician.service';
import { PhysicianModel } from '../shared/models/physician-model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-phyiscian-admin',
  templateUrl: './physician-admin.component.html',
  styleUrls: ['./physician-admin.component.scss'],
})
export class PhysicianAdminComponent implements OnInit {
  caregiverRegistrationForm;
  physicians: Array<PhysicianModel> = [];
  constructor(
    private formBuilder: FormBuilder,
    private service: PhysicianService,
    private router: Router
  ) {
    service
      .getPhysicians()
      .subscribe((physicians) => (this.physicians = physicians));

    this.caregiverRegistrationForm = this.formBuilder.group({
      name: '',
      location: '',
      hierarchy: '',
      supervisorId: '',
    });
  }

  ngOnInit(): void {}

  onSubmit(physician: PhysicianModel) {
    this.service.addPhysician(physician).subscribe(
      (p) => {
        this.router.navigateByUrl(`/physician/${p.id}/patients`);
      },
      (error) => console.error(error)
    );
  }
}
