import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavePermissionComponent } from './leave-permission.component';

describe('LeavePermissionComponent', () => {
  let component: LeavePermissionComponent;
  let fixture: ComponentFixture<LeavePermissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeavePermissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeavePermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
