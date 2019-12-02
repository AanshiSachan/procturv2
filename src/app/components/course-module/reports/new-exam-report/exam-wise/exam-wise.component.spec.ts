import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamWiseComponent } from './exam-wise.component';

describe('ExamWiseComponent', () => {
  let component: ExamWiseComponent;
  let fixture: ComponentFixture<ExamWiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamWiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
