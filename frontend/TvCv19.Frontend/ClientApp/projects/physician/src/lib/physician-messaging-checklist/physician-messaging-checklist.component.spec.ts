import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicianMessagingChecklistComponent } from './physician-messaging-checklist.component';

describe('PhysicianMessagingChecklistComponent', () => {
  let component: PhysicianMessagingChecklistComponent;
  let fixture: ComponentFixture<PhysicianMessagingChecklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicianMessagingChecklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicianMessagingChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
