import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardEmployeeManagementComponent } from './dashboard-employee-management.component';

describe('DashboardEmployeeManagementComponent', () => {
  let component: DashboardEmployeeManagementComponent;
  let fixture: ComponentFixture<DashboardEmployeeManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardEmployeeManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardEmployeeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
