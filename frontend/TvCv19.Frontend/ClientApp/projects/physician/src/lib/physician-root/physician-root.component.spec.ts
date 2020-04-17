import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicianRootComponent } from './physician-root.component';

describe('PhysicianRootComponent', () => {
  let component: PhysicianRootComponent;
  let fixture: ComponentFixture<PhysicianRootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicianRootComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicianRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
