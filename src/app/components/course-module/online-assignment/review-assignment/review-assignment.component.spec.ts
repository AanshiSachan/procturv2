import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewAssignmentComponent } from './review-assignment.component';

describe('ReviewAssignmentComponent', () => {
  let component: ReviewAssignmentComponent;
  let fixture: ComponentFixture<ReviewAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
