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
    const isGrandChild: boolean = route.data['isGrandChild']  
    const id = isGrandChild ? parseInt(route.parent.parent.params["id"]) : parseInt(route.parent.params["id"]);
    const patientId = parseInt(route.parent.params["id"]);
       return this.physicianService.getPhysician(id).pipe(
         mergeMap(carer => {
           if(carer) {
             const hierarchy = carer.hierarchy
             return this.physicianService.getPhysicians().pipe(
               mergeMap( physicians => {
                 const careTeam = physicians.filter(p => p.id !== id && p.hierarchy === hierarchy)
                 return this.patientService.getPatientsByPhysicianId(id).pipe(
                   mergeMap(
                     ps => {
                       const patients = isGrandChild ? [ps.find(p => p.id === patientId)] : ps 
                       this.toolbarService.setToolbarData({title: 'Change Shift'})
                       return of({careTeam, patients})
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



