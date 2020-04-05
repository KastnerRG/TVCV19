import { Injectable } from '@angular/core';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { PhysicianService, PhysicianModel } from './physician.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PhysicianRouteResolverService {

  constructor(private physicianService: PhysicianService) { }

  // resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PhysicianModel> | Observable<never> {
  //   // const id = route.paramMap.get('physician-id') || route.parent.parent.paramMap.get('physician-id');

  //   // return this.physicianService.getPhysician(id).pipe(map(p => p as PhysicianModel));
  // }
}
