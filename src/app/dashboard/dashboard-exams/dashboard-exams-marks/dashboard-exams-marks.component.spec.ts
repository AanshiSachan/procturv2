import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardExamsMarksComponent } from './dashboard-exams-marks.component';

describe('DashboardExamsMarksComponent', () => {
  let component: DashboardExamsMarksComponent;
  let fixture: ComponentFixture<DashboardExamsMarksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardExamsMarksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardExamsMarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
