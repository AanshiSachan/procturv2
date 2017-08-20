import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardExamsAttendanceComponent } from './dashboard-exams-attendance.component';

describe('DashboardExamsAttendanceComponent', () => {
  let component: DashboardExamsAttendanceComponent;
  let fixture: ComponentFixture<DashboardExamsAttendanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardExamsAttendanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardExamsAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
