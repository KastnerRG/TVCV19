import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientFeedComponent } from './patient-feed.component';

describe('PatientFeedComponent', () => {
  let component: PatientFeedComponent;
  let fixture: ComponentFixture<PatientFeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientFeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
