import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardFeesComponent } from './dashboard-fees.component';

describe('DashboardFeesComponent', () => {
  let component: DashboardFeesComponent;
  let fixture: ComponentFixture<DashboardFeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardFeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
