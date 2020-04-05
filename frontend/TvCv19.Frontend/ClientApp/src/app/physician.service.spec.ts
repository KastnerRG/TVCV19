import { TestBed } from '@angular/core/testing';

import { PhysicianService } from './physician.service';

describe('PatientAdminServiceService', () => {
  let service: PhysicianService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhysicianService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
