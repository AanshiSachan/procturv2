import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeAssignmentComponent } from './fee-assignment.component';

describe('FeeAssignmentComponent', () => {
  let component: FeeAssignmentComponent;
  let fixture: ComponentFixture<FeeAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
