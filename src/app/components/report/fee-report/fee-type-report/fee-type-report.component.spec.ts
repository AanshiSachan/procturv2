import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeTypeReportComponent } from './fee-type-report.component';

describe('FeeTypeReportComponent', () => {
  let component: FeeTypeReportComponent;
  let fixture: ComponentFixture<FeeTypeReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeTypeReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeTypeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
