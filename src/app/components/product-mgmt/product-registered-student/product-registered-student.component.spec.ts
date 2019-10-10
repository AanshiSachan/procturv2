import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteredStudentComponent } from './product-registered-student.component';

describe('RegisteredStudentComponent', () => {
  let component: RegisteredStudentComponent;
  let fixture: ComponentFixture<RegisteredStudentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisteredStudentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisteredStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
