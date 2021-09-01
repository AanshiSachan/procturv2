import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArpAutomationComponent } from './arp-automation.component';

describe('ArpAutomationComponent', () => {
  let component: ArpAutomationComponent;
  let fixture: ComponentFixture<ArpAutomationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArpAutomationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArpAutomationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
