import { Injectable } from '@angular/core';
import {
  Router,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
}                                 from '@angular/router';
import { Observable, of, EMPTY }  from 'rxjs';
import { mergeMap }         from 'rxjs/operators';
import { PatientService, PhysicianService, CaregiverRouteDataModel } from 'projects/shared/src/public-api';

@Injectable({
  providedIn: 'root'
})
export class CarerRouteResolverService {

  constructor(private patientService: PatientService, private physicianService: PhysicianService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CaregiverRouteDataModel> | Observable<never> {
      const id = route.parent.params["id"];
       
      return this.patientService.getPatientsByPhysicianId(id).pipe(
        mergeMap(patients => {
          if(patients){
           return this.physicianService.getPhysicians().pipe(
              mergeMap(physicians => {
                const careTeam = physicians.filter(p => p.supervisorId === id)
                return of({
                  patients,
                  careTeam,
                  id
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