import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeShiftComponent } from './change-shift.component';

describe('ChangeShiftComponent', () => {
  let component: ChangeShiftComponent;
  let fixture: ComponentFixture<ChangeShiftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeShiftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
