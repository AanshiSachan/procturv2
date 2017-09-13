import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardManageChequesComponent } from './dashboard-manage-cheques.component';

describe('DashboardManageChequesComponent', () => {
  let component: DashboardManageChequesComponent;
  let fixture: ComponentFixture<DashboardManageChequesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardManageChequesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardManageChequesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
