import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamdeskCourseAssignmentComponent } from './examdesk-course-assignment.component';

describe('ExamdeskCourseAssignmentComponent', () => {
  let component: ExamdeskCourseAssignmentComponent;
  let fixture: ComponentFixture<ExamdeskCourseAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamdeskCourseAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamdeskCourseAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
