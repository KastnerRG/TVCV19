import { TestBed } from '@angular/core/testing';

import { CaregiverService } from './caregiver.service';

describe('CaregiverService', () => {
  let service: CaregiverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaregiverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
