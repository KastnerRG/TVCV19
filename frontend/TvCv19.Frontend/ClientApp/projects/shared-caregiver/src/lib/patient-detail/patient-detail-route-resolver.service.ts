import { Injectable } from '@angular/core';
import {
  Router,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { PatientService, PatientModel } from 'projects/shared/src/public-api';
import { ToolbarService } from 'src/app/toolbar.service';

@Injectable({
  providedIn: 'root',
})
export class PatientDetailRouteResolverService {
  constructor(private patientService: PatientService, private toolbarService: ToolbarService, private router: Router) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<PatientModel> | Observable<never> {
    const patientId = route.params['id'];
    return this.patientService.getPatient(patientId).pipe(
      mergeMap((patient) => {
        if (patient) {
          this.toolbarService.setToolbarData({back: true, title: patient.name, menu: undefined})
          return of(patient);
        } else {
          this.router.navigateByUrl('/');
          return EMPTY;
        }
      })
    );
  }

}
