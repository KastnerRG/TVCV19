import { Injectable } from '@angular/core';
import {
  Router,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
}                                 from '@angular/router';
import { Observable, of, EMPTY }  from 'rxjs';
import { mergeMap }         from 'rxjs/operators';
import { FirstLinePatientRouteDataModel } from './firstlinePatientRouteData.model';
import { PatientService } from 'src/app/shared/services/patient.service';

@Injectable({
  providedIn: 'root'
})
export class PhysicianRouteResolverService {

  constructor(private ps: PatientService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FirstLinePatientRouteDataModel> | Observable<never> {
      let id = route.parent.params["physician-id"];
       
      return this.ps.getPatientsByPhysicianId(id).pipe(
        mergeMap(patient => {
          if(patient){
            return of({
              patients: patient,
              physicianId: id,
              physicians: []
            })
          } else {
            this.router.navigate(['/patient'])
            return EMPTY;
          }
        })
      )
  }
}