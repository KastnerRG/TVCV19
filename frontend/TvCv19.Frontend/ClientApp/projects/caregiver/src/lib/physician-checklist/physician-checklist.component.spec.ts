import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicianChecklistComponent } from './physician-checklist.component';

describe('PhysicianChecklistComponent', () => {
  let component: PhysicianChecklistComponent;
  let fixture: ComponentFixture<PhysicianChecklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicianChecklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicianChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
