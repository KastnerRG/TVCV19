import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedCaregiverComponent } from './shared-caregiver.component';

describe('SharedCaregiverComponent', () => {
  let component: SharedCaregiverComponent;
  let fixture: ComponentFixture<SharedCaregiverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedCaregiverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedCaregiverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
