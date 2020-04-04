import { TestBed } from '@angular/core/testing';

import { PatientRouteResolverService } from './patient-route-resolver.service';

describe('PatientRouteResolverService', () => {
  let service: PatientRouteResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientRouteResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
