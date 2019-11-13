import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseSubjectComponent } from './course-subject.component';

describe('CourseSubjectComponent', () => {
  let component: CourseSubjectComponent;
  let fixture: ComponentFixture<CourseSubjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseSubjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
