import { Injectable } from '@angular/core';
import {
  Router,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { PhysicianService } from 'projects/shared/src/public-api';
import { CarerNode } from './hierarchy.component';

@Injectable({
  providedIn: 'root',
})
export class CarerHierarchyResolverService {
  constructor(
    private physicianService: PhysicianService,
    private router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<CarerNode> | Observable<never> {
    const id = parseInt(route.parent.params['id']);

    return this.physicianService.getHierarchy(id).pipe((hierachy) => {
      if (hierachy) {
        return hierachy;
      } else {
        this.router.navigate(['/patient']);
        return EMPTY;
      }
    });
  }
}
