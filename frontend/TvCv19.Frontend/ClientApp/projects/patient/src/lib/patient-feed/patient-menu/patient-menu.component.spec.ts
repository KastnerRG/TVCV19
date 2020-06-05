import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientMenuComponent } from './patient-menu.component';

describe('PatientMenuComponent', () => {
  let component: PatientMenuComponent;
  let fixture: ComponentFixture<PatientMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
