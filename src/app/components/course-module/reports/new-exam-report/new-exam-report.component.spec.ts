import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewExamReportComponent } from './new-exam-report.component';

describe('NewExamReportComponent', () => {
  let component: NewExamReportComponent;
  let fixture: ComponentFixture<NewExamReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewExamReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewExamReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
