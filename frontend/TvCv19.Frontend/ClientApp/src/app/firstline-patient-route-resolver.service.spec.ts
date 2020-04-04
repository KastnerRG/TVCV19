import { TestBed } from '@angular/core/testing';

import { FirstlinePatientRouteResolverService } from './firstline-patient-route-resolver.service';

describe('FirstlinePatientRouteResolverService', () => {
  let service: FirstlinePatientRouteResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirstlinePatientRouteResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
