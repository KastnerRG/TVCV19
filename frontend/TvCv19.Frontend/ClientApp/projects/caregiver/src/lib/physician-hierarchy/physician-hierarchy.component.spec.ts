import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicianHierarchyComponent } from './physician-hierarchy.component';

describe('PhysicianHeirachyComponent', () => {
  let component: PhysicianHierarchyComponent;
  let fixture: ComponentFixture<PhysicianHierarchyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicianHierarchyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicianHierarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
