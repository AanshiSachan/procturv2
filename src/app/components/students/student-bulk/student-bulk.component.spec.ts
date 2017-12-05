import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentBulkComponent } from './student-bulk.component';

describe('StudentBulkComponent', () => {
  let component: StudentBulkComponent;
  let fixture: ComponentFixture<StudentBulkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentBulkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentBulkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
