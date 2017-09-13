import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSentNotificationsComponent } from './dashboard-sent-notifications.component';

describe('DashboardSentNotificationsComponent', () => {
  let component: DashboardSentNotificationsComponent;
  let fixture: ComponentFixture<DashboardSentNotificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardSentNotificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardSentNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
