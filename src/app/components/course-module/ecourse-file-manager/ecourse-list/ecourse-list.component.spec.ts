import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EcourseListComponent } from './ecourse-list.component';

describe('EcourseListComponent', () => {
  let component: EcourseListComponent;
  let fixture: ComponentFixture<EcourseListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcourseListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcourseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
