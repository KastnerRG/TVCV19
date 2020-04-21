import { TestBed } from '@angular/core/testing';

import { SharedCaregiverService } from './shared-caregiver.service';

describe('SharedCaregiverService', () => {
  let service: SharedCaregiverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedCaregiverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
