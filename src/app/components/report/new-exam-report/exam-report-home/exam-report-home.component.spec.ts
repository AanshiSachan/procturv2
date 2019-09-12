import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamReportHomeComponent } from './exam-report-home.component';

describe('ExamReportHomeComponent', () => {
  let component: ExamReportHomeComponent;
  let fixture: ComponentFixture<ExamReportHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamReportHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamReportHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
