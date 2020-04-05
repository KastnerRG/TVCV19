import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicianHeirachyComponent } from './physician-heirachy.component';

describe('PhysicianHeirachyComponent', () => {
  let component: PhysicianHeirachyComponent;
  let fixture: ComponentFixture<PhysicianHeirachyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicianHeirachyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicianHeirachyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
