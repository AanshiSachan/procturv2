import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentHomev2Component } from './student-homev2.component';

describe('StudentHomev2Component', () => {
  let component: StudentHomev2Component;
  let fixture: ComponentFixture<StudentHomev2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentHomev2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentHomev2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
