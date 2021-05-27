import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSalaryPaymentComponent } from './add-salary-payment.component';

describe('AddSalaryPaymentComponent', () => {
  let component: AddSalaryPaymentComponent;
  let fixture: ComponentFixture<AddSalaryPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSalaryPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSalaryPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
