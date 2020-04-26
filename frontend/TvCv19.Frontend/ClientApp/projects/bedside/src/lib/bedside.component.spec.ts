import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BedsideComponent } from './bedside.component';

describe('BedsideComponent', () => {
  let component: BedsideComponent;
  let fixture: ComponentFixture<BedsideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BedsideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BedsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
