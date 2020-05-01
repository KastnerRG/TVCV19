import { TestBed } from '@angular/core/testing';

import { PhysicianMessagingChecklistService } from './physician-messaging-checklist.service';

describe('PhysicianMessagingChecklistService', () => {
  let service: PhysicianMessagingChecklistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhysicianMessagingChecklistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
