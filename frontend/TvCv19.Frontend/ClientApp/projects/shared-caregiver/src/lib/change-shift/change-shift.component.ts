import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ChangeShiftModel } from './change-shift.model';
import { ActivatedRoute } from '@angular/router';
import { PatientService, PatientModel } from 'projects/shared/src/public-api';

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
  patients: Array<PatientModel>;
  caregiverControl = new FormControl();
  options: Caregiver[];
  filteredOptions: Observable<Caregiver[]>;
  id: string;
  constructor(private route: ActivatedRoute, private patientService: PatientService) { }

  ngOnInit(): void {
    this.route.data.subscribe(
      ( data: { model: ChangeShiftModel }) => {
        this.patients = data.model.patients || [];
        this.id = data.model.physicianId || '123';
        this.filteredOptions = this.caregiverControl.valueChanges.pipe(
        startWith(''),
        map((value) => (typeof value === 'string' ? value : value.name)),
        map((name) => (name ? this._filter(name) : this.options.slice()))
        );
      }
    );
  }

  onSubmit(caregiver: Caregiver) {
    for (var patient of this.patients) { 
         patient.caregiverId = caregiver.id
      this.patientService.updatePatient(patient);
    } 
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
}
