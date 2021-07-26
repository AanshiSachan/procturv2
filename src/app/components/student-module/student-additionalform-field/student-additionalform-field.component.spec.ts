import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAdditionalformFieldComponent } from './student-additionalform-field.component';

describe('StudentAdditionalformFieldComponent', () => {
  let component: StudentAdditionalformFieldComponent;
  let fixture: ComponentFixture<StudentAdditionalformFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentAdditionalformFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentAdditionalformFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
