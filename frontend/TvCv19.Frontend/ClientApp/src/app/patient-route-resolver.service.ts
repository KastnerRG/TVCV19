import { Injectable } from '@angular/core';
import {
  Router,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
}                                 from '@angular/router';
import { Observable, of, EMPTY }  from 'rxjs';
import { mergeMap }         from 'rxjs/operators';
import { PatientService }         from './patient.service'
import { PatientModel } from './patient-registration/patient-model';

@Injectable({
  providedIn: 'root'
})
export class PatientRouteResolverService {

  constructor(private ps: PatientService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PatientModel> | Observable<never> {
      let id = route.paramMap.get('id');

      return this.ps.getPatient(id).pipe(
        mergeMap(patient => {
          if(patient){
            return of(patient)
          } else {
            this.router.navigate(['/patient'])
            return EMPTY;
          }
        })
      )
  }
}
