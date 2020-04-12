import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { physicianAdminComponent } from './physician-admin.component';

describe('PhyiscianAdminComponent', () => {
  let component: physicianAdminComponent;
  let fixture: ComponentFixture<physicianAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ physicianAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(physicianAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
