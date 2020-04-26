import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ChangeShiftModel } from './change-shift.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService, PatientModel, PhysicianModel } from 'projects/shared/src/public-api';
import { AssignCareGiverModel } from 'projects/patient/src/public-api';

export interface Caregiver {
  name: string;
  id: string;
}

@Component({
  selector: 'lib-change-shift',
  templateUrl: './change-shift.component.html',
  styleUrls: ['./change-shift.component.scss']
})


export class ChangeShiftComponent implements OnInit {
  patient: PatientModel;
  caregiverControl = new FormControl();
  options: Caregiver[];
  filteredOptions: Observable<Caregiver[]>;

  constructor(private route: ActivatedRoute, private patientService: PatientService, private router: Router) { }

  ngOnInit(): void {
    this.route.data.subscribe((data: { model: AssignCareGiverModel }) => {
      this.patient = data.model.patient;
      this.options = data.model.caregivers;
    });

    this.filteredOptions = this.caregiverControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.name)),
      map((name) => (name ? this._filter(name) : this.options.slice()))
    );
  }

  displayFn(user: Caregiver): string {
    return user && user.name ? user.name : '';
  }

  private _filter(name: string): Caregiver[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(
      (option) => option.name.toLowerCase().indexOf(filterValue) === 0
    );
  }

  onSubmit(caregiver: PhysicianModel) {
    this.patient.caregiverId = caregiver.id
    this.patientService.updatePatient(this.patient).subscribe()
    this.router.navigateByUrl('/')
  }
}
