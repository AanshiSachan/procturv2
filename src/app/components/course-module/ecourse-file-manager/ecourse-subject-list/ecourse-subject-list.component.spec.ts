import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EcourseSubjectListComponent } from './ecourse-subject-list.component';

describe('EcourseSubjectListComponent', () => {
  let component: EcourseSubjectListComponent;
  let fixture: ComponentFixture<EcourseSubjectListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcourseSubjectListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcourseSubjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
