import { Injectable } from '@angular/core';
import {
  Router,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
}                                 from '@angular/router';
import { Observable, of, EMPTY }  from 'rxjs';
import { mergeMap }         from 'rxjs/operators';
import { PatientService }         from '../patient.service'
import { AssignCareGiverModel } from './assign-caregiver-route-model';

@Injectable({
  providedIn: 'root'
})
export class AssignCareGiverRouteResolverService {

  constructor(private ps: PatientService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AssignCareGiverModel> | Observable<never> {
      let id = route.paramMap.get('id');

      return this.ps.getPatient(id).pipe(
        mergeMap(patient => {
          if(patient){
            return of({patient: patient,
            caregivers: [{ name: 'Mary', id: '1' },
            { name: 'Shelley', id: '2' },
            { name: 'Igor', id: '3' },]})
          } else {
            this.router.navigate(['/patient'])
            return EMPTY;
          }
        })
      )
  }
}
