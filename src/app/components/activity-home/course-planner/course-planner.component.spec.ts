import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursePlannerComponent } from './course-planner.component';

describe('CoursePlannerComponent', () => {
  let component: CoursePlannerComponent;
  let fixture: ComponentFixture<CoursePlannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoursePlannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursePlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
