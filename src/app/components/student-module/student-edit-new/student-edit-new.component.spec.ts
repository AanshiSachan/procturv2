import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentEditNewComponent } from './student-edit-new.component';

describe('StudentEditNewComponent', () => {
  let component: StudentEditNewComponent;
  let fixture: ComponentFixture<StudentEditNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentEditNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentEditNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
