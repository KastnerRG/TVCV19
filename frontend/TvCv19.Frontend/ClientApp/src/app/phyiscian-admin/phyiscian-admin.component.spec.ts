import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhyiscianAdminComponent } from './phyiscian-admin.component';

describe('PhyiscianAdminComponent', () => {
  let component: PhyiscianAdminComponent;
  let fixture: ComponentFixture<PhyiscianAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhyiscianAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhyiscianAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
