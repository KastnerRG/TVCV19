import { TestBed } from '@angular/core/testing';

import { PatientAuthorizationService } from './patient-authorization.service';

describe('PatientAuthorizationService', () => {
  let service: PatientAuthorizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientAuthorizationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
