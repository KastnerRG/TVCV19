import { Injectable } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { PatientService, MessageModel, PhysicianService } from 'projects/shared/src/public-api'
import { ToolbarService } from 'src/app/toolbar.service';

@Injectable({
  providedIn: 'root',
})
export class ChatRouteResolverService {
  constructor(private patientService: PatientService, private physicianService: PhysicianService, private toolbarService: ToolbarService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Array<MessageModel>> {
    let patientId = route.parent.params['id']
    let physicianId = route.parent.parent.params['id']
    return this.patientService.getPatient(patientId).pipe(
      mergeMap(patient => {
        if(patient){
          return this.physicianService.getPhysician(physicianId).pipe(
            mergeMap(physician => {
               this.toolbarService.setToolbarData({menu: undefined, back: true, title: `${patient.name} (${physician.name})`})
              return this.patientService.getMessages(patientId).pipe(
                mergeMap((messages) => {
                  if (messages) {
                    return of(messages);
                  } else {
                    return new BehaviorSubject([]);
                  }
                }),catchError(err => {
                  console.error(err)
                  return new BehaviorSubject([])
                })
              )
            })
          )
   
        } else {
          return new BehaviorSubject([]);
        }
      
      }),catchError(err => {
        console.error(err)
        return new BehaviorSubject([])
      })
    )
  
  }
}
