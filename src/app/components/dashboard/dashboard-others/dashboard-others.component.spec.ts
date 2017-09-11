import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardOthersComponent } from './dashboard-others.component';

describe('DashboardOthersComponent', () => {
  let component: DashboardOthersComponent;
  let fixture: ComponentFixture<DashboardOthersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardOthersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardOthersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
