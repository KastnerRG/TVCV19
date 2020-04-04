import { Injectable } from '@angular/core';
import {
  Router,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
}                                 from '@angular/router';
import { Observable, of, EMPTY }  from 'rxjs';
import { mergeMap }         from 'rxjs/operators';
import { PatientService }         from './patient.service'
import { PatientModel } from './patient-admin/patient-model';
import { FirstLinePatientRouteDataModel } from './firstline/firstlinePatientRouteData.model';

@Injectable({
  providedIn: 'root'
})
export class FirstlinePatientRouteResolverService {

  constructor(private ps: PatientService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FirstLinePatientRouteDataModel> | Observable<never> {
      let id = route.paramMap.get('id');

      return this.ps.getPatients(id).pipe(
        mergeMap(patient => {
          if(patient){
            return of({
              patients: patient,
              caregiverId: id
            })
          } else {
            this.router.navigate(['/patient'])
            return EMPTY;
          }
        })
      )
  }
}