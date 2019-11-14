import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransctionalSmsComponent } from './transctional-sms.component';

describe('TransctionalSmsComponent', () => {
  let component: TransctionalSmsComponent;
  let fixture: ComponentFixture<TransctionalSmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransctionalSmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransctionalSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
