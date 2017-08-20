import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardBatchComponent } from './dashboard-batch.component';

describe('DashboardBatchComponent', () => {
  let component: DashboardBatchComponent;
  let fixture: ComponentFixture<DashboardBatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardBatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
