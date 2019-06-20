import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamMarkUpdateComponent } from './exam-mark-update.component';

describe('ExamMarkUpdateComponent', () => {
  let component: ExamMarkUpdateComponent;
  let fixture: ComponentFixture<ExamMarkUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamMarkUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamMarkUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
