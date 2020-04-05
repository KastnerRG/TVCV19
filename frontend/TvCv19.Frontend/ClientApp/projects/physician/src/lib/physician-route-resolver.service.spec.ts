import { TestBed } from '@angular/core/testing';

import { PhysicianRouteResolverService } from './physician-route-resolver.service';

describe('PhysicianRouteResolverService', () => {
  let service: PhysicianRouteResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhysicianRouteResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
