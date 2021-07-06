import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReportCardV2Component } from './view-report-card-v2.component';

describe('ViewReportCardV2Component', () => {
  let component: ViewReportCardV2Component;
  let fixture: ComponentFixture<ViewReportCardV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewReportCardV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewReportCardV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
