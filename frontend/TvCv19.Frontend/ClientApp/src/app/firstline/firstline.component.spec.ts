import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstlineComponent } from './firstline.component';

describe('FirstlineComponent', () => {
  let component: FirstlineComponent;
  let fixture: ComponentFixture<FirstlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirstlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
