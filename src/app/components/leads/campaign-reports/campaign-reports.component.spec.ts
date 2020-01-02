import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignReportsComponent } from './campaign-reports.component';

describe('CampaignReportsComponent', () => {
  let component: CampaignReportsComponent;
  let fixture: ComponentFixture<CampaignReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
