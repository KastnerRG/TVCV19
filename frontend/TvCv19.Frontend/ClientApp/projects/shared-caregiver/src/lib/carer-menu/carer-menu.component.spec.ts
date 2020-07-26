import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarerMenuComponent } from './carer-menu.component';

describe('CarerMenuComponent', () => {
  let component: CarerMenuComponent;
  let fixture: ComponentFixture<CarerMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CarerMenuComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarerMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
