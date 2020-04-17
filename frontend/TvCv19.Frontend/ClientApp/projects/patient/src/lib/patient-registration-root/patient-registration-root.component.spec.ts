import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientRegistrationRootComponent } from './patient-registration-root.component';

describe('PatientRegistrationRootComponent', () => {
  let component: PatientRegistrationRootComponent;
  let fixture: ComponentFixture<PatientRegistrationRootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientRegistrationRootComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientRegistrationRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
