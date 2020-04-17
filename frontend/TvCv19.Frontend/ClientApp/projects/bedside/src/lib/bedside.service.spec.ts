import { TestBed } from '@angular/core/testing';

import { BedsideService } from './bedside.service';

describe('BedsideService', () => {
  let service: BedsideService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BedsideService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
