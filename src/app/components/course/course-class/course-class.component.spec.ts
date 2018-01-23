import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseClassComponent } from './course-class.component';

describe('CourseClassComponent', () => {
  let component: CourseClassComponent;
  let fixture: ComponentFixture<CourseClassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseClassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
