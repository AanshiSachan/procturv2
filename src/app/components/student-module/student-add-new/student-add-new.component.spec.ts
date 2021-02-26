import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAddNewComponent } from './student-add-new.component';

describe('StudentAddNewComponent', () => {
  let component: StudentAddNewComponent;
  let fixture: ComponentFixture<StudentAddNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentAddNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentAddNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
