import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientQrComponent } from './patient-qr.component';

describe('PatientQrComponent', () => {
  let component: PatientQrComponent;
  let fixture: ComponentFixture<PatientQrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientQrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
