import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignLeadSmsComponent } from './campaign-lead-sms.component';

describe('CampaignLeadSmsComponent', () => {
  let component: CampaignLeadSmsComponent;
  let fixture: ComponentFixture<CampaignLeadSmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignLeadSmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignLeadSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
