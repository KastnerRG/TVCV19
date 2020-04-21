import { Injectable } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { PatientService, MessageModel } from 'projects/shared/src/public-api'

@Injectable({
  providedIn: 'root',
})
export class ChatRouteResolverService {
  constructor(private patientService: PatientService, private router: Router) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Array<MessageModel>> {
    let patientId = route.paramMap.get('patient-id');
    
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
  }
}
