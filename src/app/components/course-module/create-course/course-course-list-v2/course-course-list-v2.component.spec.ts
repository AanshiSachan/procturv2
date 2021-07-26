import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseCourseListV2Component } from './course-course-list-v2.component';

describe('CourseCourseListV2Component', () => {
  let component: CourseCourseListV2Component;
  let fixture: ComponentFixture<CourseCourseListV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseCourseListV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseCourseListV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
