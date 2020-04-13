import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicianAdminComponent } from './physician-admin.component';

describe('PhyiscianAdminComponent', () => {
  let component: PhysicianAdminComponent;
  let fixture: ComponentFixture<PhysicianAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicianAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicianAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
