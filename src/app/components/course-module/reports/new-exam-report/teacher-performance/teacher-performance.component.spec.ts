import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherPerformanceComponent } from './teacher-performance.component';

describe('TeacherPerformanceComponent', () => {
  let component: TeacherPerformanceComponent;
  let fixture: ComponentFixture<TeacherPerformanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherPerformanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
