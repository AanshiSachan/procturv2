import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignSmsComponent } from './campaign-sms.component';

describe('CampaignSmsComponent', () => {
  let component: CampaignSmsComponent;
  let fixture: ComponentFixture<CampaignSmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignSmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
