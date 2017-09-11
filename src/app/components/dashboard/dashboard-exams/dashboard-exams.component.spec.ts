import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardExamsComponent } from './dashboard-exams.component';

describe('DashboardExamsComponent', () => {
  let component: DashboardExamsComponent;
  let fixture: ComponentFixture<DashboardExamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardExamsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardExamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
