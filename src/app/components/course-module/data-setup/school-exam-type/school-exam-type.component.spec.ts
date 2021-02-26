import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolExamTypeComponent } from './school-exam-type.component';

describe('SchoolExamTypeComponent', () => {
  let component: SchoolExamTypeComponent;
  let fixture: ComponentFixture<SchoolExamTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchoolExamTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolExamTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
