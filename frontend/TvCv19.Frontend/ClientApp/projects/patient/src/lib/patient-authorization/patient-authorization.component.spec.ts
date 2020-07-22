import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientAuthorizationComponent } from './patient-authorization.component';

describe('PatientAuthorizationComponent', () => {
  let component: PatientAuthorizationComponent;
  let fixture: ComponentFixture<PatientAuthorizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientAuthorizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
