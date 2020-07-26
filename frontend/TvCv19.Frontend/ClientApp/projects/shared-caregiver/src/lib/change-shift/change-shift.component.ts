import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import {
  PatientService,
  PatientModel,
  PhysicianModel,
  ChangeShiftRouteDataModel,
  HierarchyLevel,
  PhysicianService,
} from 'projects/shared/src/public-api';
import { ToolbarService } from 'src/app/toolbar.service';

export interface Caregiver {
  name: string;
  id: string;
}

@Component({
  selector: 'lib-change-shift',
  templateUrl: './change-shift.component.html',
  styleUrls: ['./change-shift.component.scss'],
})
export class ChangeShiftComponent implements OnInit {
  patient: PatientModel;
  patients: Array<PatientModel>;
  caregiverControl = new FormControl();
  options: Caregiver[];
  filteredOptions: Observable<Caregiver[]>;
  show: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private physicianService: PhysicianService,
    private router: Router,
    private toolbarService: ToolbarService
  ) {
    toolbarService.menuClick.subscribe(e => {
      this.show = !e.isOpen;
    })
  }

  ngOnInit(): void {
    this.route.data.subscribe((data: { model: ChangeShiftRouteDataModel }) => {
      this.patients = data.model.patients;
      this.options = data.model.careTeam;
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

  async onSubmit(caregiver: PhysicianModel) {
    if (caregiver.hierarchy === HierarchyLevel.FirstLine) {
      let updates: Array<Promise<PatientModel>> = [];
      this.patients.forEach((patient) => {
        patient.caregiverId = caregiver.id;
        updates.push(this.patientService.updatePatient(patient).toPromise());
      });
      await Promise.all(updates);
    } else {
      let updates: Array<Promise<PhysicianModel>> = [];
      let carerIds: Array<string> = [
        ...new Set(this.patients.map((patient) => patient.caregiverId)),
      ];
      let carers = await (
        await this.physicianService.getPhysicians().toPromise()
      ).filter((p) => carerIds.includes(p.id));
      carers.forEach((carer) => {
        carer.supervisorId = caregiver.id;
        updates.push(this.physicianService.updatePhysician(carer).toPromise());
      });
      await Promise.all(updates);
    }

    this.router.navigateByUrl('/');
  }
}
