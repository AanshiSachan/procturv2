import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReportCardComponent } from './view-report-card.component';

describe('ViewReportCardComponent', () => {
  let component: ViewReportCardComponent;
  let fixture: ComponentFixture<ViewReportCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewReportCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewReportCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
