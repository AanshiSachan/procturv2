import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocateSmsComponent } from './allocate-sms.component';

describe('AllocateSmsComponent', () => {
  let component: AllocateSmsComponent;
  let fixture: ComponentFixture<AllocateSmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllocateSmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllocateSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
