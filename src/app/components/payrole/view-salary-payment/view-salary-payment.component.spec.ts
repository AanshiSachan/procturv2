import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSalaryPaymentComponent } from './view-salary-payment.component';

describe('ViewSalaryPaymentComponent', () => {
  let component: ViewSalaryPaymentComponent;
  let fixture: ComponentFixture<ViewSalaryPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSalaryPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSalaryPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
