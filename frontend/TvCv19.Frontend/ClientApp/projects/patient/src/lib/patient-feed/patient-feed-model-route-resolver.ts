import { Injectable } from '@angular/core';
import {
  Router,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { PatientService } from 'projects/shared/src/public-api';
import { PatientFeedModel } from './patient-feed-model';

@Injectable({
  providedIn: 'root',
})
export class PatientFeedModelRouteResolverService {
  constructor(
    private patientService: PatientService,
    private router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<PatientFeedModel> | Observable<never> {
    let id = route.paramMap.get('id');
    return this.patientService.getPatient(id).pipe(
      mergeMap((patient) => {
        if (patient) {
          return of({id, token: patient.token})
        } else {
          this.router.navigate(['/']);
          return EMPTY;
        }
      })
    );
  }
} 