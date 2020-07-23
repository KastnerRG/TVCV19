import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPatientDeviceComponent } from './add-patient-device.component';

describe('AddPatientDeviceComponent', () => {
  let component: AddPatientDeviceComponent;
  let fixture: ComponentFixture<AddPatientDeviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPatientDeviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPatientDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
