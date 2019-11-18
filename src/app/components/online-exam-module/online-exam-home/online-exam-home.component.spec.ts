import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineExamHomeComponent } from './online-exam-home.component';

describe('OnlineExamHomeComponent', () => {
  let component: OnlineExamHomeComponent;
  let fixture: ComponentFixture<OnlineExamHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlineExamHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineExamHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
