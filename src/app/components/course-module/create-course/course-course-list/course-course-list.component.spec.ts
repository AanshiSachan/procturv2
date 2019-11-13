import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseCourseListComponent } from './course-course-list.component';

describe('CourseCourseListComponent', () => {
  let component: CourseCourseListComponent;
  let fixture: ComponentFixture<CourseCourseListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseCourseListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseCourseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
