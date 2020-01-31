import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignBaseReportComponent } from './campaign-base-report.component';

describe('CampaignBaseReportComponent', () => {
  let component: CampaignBaseReportComponent;
  let fixture: ComponentFixture<CampaignBaseReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignBaseReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignBaseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
