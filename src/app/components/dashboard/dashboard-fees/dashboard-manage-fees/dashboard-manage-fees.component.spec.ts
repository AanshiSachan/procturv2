import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardManageFeesComponent } from './dashboard-manage-fees.component';

describe('DashboardManageFeesComponent', () => {
  let component: DashboardManageFeesComponent;
  let fixture: ComponentFixture<DashboardManageFeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardManageFeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardManageFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
