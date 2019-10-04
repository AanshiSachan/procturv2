import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseWiseComponent } from './course-wise.component';

describe('CourseWiseComponent', () => {
  let component: CourseWiseComponent;
  let fixture: ComponentFixture<CourseWiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseWiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
