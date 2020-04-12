import { Injectable } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { MessageModel } from '../chat.service';
import { Observable, of, EMPTY, BehaviorSubject } from 'rxjs';
import { mergeMap, take, catchError } from 'rxjs/operators';
import { PatientService } from 'src/app/shared/services/patient.service';

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
