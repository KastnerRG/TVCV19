import { Injectable } from '@angular/core';
import {
  Router,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
}                                 from '@angular/router';
import { Observable, of, EMPTY }  from 'rxjs';
import { mergeMap }         from 'rxjs/operators';
import { PatientService, PhysicianService, ChangeShiftRouteDataModel } from 'projects/shared/src/public-api';
import { ToolbarService } from 'src/app/toolbar.service';

@Injectable({
  providedIn: 'root'
})
export class ChangeShiftRouteResolverService {

  constructor(private patientService: PatientService, private physicianService: PhysicianService, private toolbarService: ToolbarService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ChangeShiftRouteDataModel> | Observable<never> {
      const id = route.parent.parent.params["id"];
      const patientId = route.parent.params["id"];
       return this.physicianService.getPhysician(id).pipe(
         mergeMap(carer => {
           if(carer) {
             const hierarchy = carer.hierarchy
             return this.physicianService.getPhysicians().pipe(
               mergeMap( physicians => {
                 const careTeam = physicians.filter(p => p.id !== id && p.hierarchy === hierarchy)
                 return this.patientService.getPatient(patientId).pipe(
                   mergeMap(
                     patient => {
                       this.toolbarService.setToolbarData({title: '', back: true, menu: undefined})
                       return of({careTeam, patient})
                     }
                   )
                 )
               })
             )
           } else {
             this.router.navigateByUrl('/')
             return EMPTY;
           }
         })
       )
  }
}



