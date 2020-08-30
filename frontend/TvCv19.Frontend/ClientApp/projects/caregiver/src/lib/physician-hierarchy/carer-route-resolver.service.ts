import { Injectable } from '@angular/core';
import {
  Router,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import {
  PatientService,
  PhysicianService,
  CaregiverRouteDataModel,
} from 'projects/shared/src/public-api';

@Injectable({
  providedIn: 'root',
})
export class CarerRouteResolverService {
  constructor(
    private patientService: PatientService,
    private physicianService: PhysicianService,
    private router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<CaregiverRouteDataModel> | Observable<never> {
    const id = route.parent.params['id'];
    const routeName = route.url.length > 0 ? route.url[0].path : '';

    return this.patientService.getPatientsByPhysicianId(id).pipe(
      mergeMap((patients) => {
        if (patients) {
          return this.physicianService.getPhysicians().pipe(
            mergeMap((physicians) => {
              const careTeam = physicians.filter((p) => p.supervisorId === id);
              const physician = physicians.find(x => x.id === id)
              return of({
                patients,
                careTeam,
                physician
              });
            })
          );
        } else {
          this.router.navigate(['/patient']);
          return EMPTY;
        }
      })
    );
  }


}
