import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeReportComponent } from './cheque-report.component';

describe('ChequeReportComponent', () => {
  let component: ChequeReportComponent;
  let fixture: ComponentFixture<ChequeReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChequeReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChequeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
