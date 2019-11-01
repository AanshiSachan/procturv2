import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentModuleComponent } from './student-module.component';

describe('StudentModuleComponent', () => {
  let component: StudentModuleComponent;
  let fixture: ComponentFixture<StudentModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
