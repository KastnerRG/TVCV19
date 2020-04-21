import { Injectable } from '@angular/core';
import {
  Router,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
}                                 from '@angular/router';
import { Observable, of, EMPTY }  from 'rxjs';
import { mergeMap }         from 'rxjs/operators';
import { PatientService, PhysicianService, FirstLinePatientRouteDataModel } from 'projects/shared/src/public-api';

@Injectable({
  providedIn: 'root'
})
export class PhysicianRouteResolverService {

  constructor(private patientService: PatientService, private physicianService: PhysicianService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FirstLinePatientRouteDataModel> | Observable<never> {
      const id = route.parent.params["id"];
       
      return this.patientService.getPatientsByPhysicianId(id).pipe(
        mergeMap(patient => {
          if(patient){
           return this.physicianService.getPhysicians().pipe(
              mergeMap(physicians => {
                const filtered = physicians.filter(p => p.supervisorId === id)
                return of({
                  patients: patient,
                  physicians: filtered,
                  physicianId: id
                })
              })
            )
          } else {
            this.router.navigate(['/patient'])
            return EMPTY;
          }
        })
      )
  }
}