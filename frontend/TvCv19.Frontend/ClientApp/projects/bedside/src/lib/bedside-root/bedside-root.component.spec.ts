import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BedsideRootComponent } from './bedside-root.component';

describe('BedsideRootComponent', () => {
  let component: BedsideRootComponent;
  let fixture: ComponentFixture<BedsideRootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BedsideRootComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BedsideRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
