import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassroomClassComponent } from './classroom-class.component';

describe('ClassroomClassComponent', () => {
  let component: ClassroomClassComponent;
  let fixture: ComponentFixture<ClassroomClassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassroomClassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassroomClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
