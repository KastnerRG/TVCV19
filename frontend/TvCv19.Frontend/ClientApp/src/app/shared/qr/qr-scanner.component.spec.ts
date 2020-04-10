import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QrScanComponent } from './qr-scanner.component';

describe('QrComponent', () => {
  let component: QrScanComponent;
  let fixture: ComponentFixture<QrScanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QrScanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
