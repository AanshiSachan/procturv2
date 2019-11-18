import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineExamModuleComponent } from './online-exam-module.component';

describe('OnlineExamModuleComponent', () => {
  let component: OnlineExamModuleComponent;
  let fixture: ComponentFixture<OnlineExamModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlineExamModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineExamModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
