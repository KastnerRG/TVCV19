import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { PatientModel } from 'projects/shared/src/public-api';
import { PatientService } from 'projects/shared/src/public-api';

@Injectable({
  providedIn: 'root',
})
export class AssignCareGiverRouteResolverService {
  constructor(
    private patientService: PatientService,
    private router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<PatientModel> | Observable<never> {
    let id = route.paramMap.get('id');

    return this.patientService.getPatient(id).pipe(
      mergeMap((patient) => {
        if (patient && !patient.caregiverId) {
          return of(patient);
        } else {
          this.router.navigate(['/patient', 'live', patient.id]);
          return EMPTY;
        }
      })
    );
  }
}