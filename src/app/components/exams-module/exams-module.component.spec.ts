import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamsModuleComponent } from './exams-module.component';

describe('ExamsModuleComponent', () => {
  let component: ExamsModuleComponent;
  let fixture: ComponentFixture<ExamsModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamsModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamsModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
