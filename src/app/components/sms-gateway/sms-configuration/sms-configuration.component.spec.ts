import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsConfigurationComponent } from './sms-configuration.component';

describe('SmsConfigurationComponent', () => {
  let component: SmsConfigurationComponent;
  let fixture: ComponentFixture<SmsConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
