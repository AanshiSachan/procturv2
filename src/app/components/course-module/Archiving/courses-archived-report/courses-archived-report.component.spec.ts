import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesArchivedReportComponent } from './courses-archived-report.component';

describe('CoursesArchivedReportComponent', () => {
  let component: CoursesArchivedReportComponent;
  let fixture: ComponentFixture<CoursesArchivedReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoursesArchivedReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursesArchivedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
