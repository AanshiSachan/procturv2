import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignReportsHomeComponent } from './campaign-reports-home.component';

describe('CampaignReportsHomeComponent', () => {
  let component: CampaignReportsHomeComponent;
  let fixture: ComponentFixture<CampaignReportsHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignReportsHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignReportsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
