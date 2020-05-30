import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommanderRootComponent } from './commander-root.component';

describe('CommanderRootComponent', () => {
  let component: CommanderRootComponent;
  let fixture: ComponentFixture<CommanderRootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommanderRootComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommanderRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
