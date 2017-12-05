import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignBulkComponent } from './campaign-bulk.component';

describe('CampaignBulkComponent', () => {
  let component: CampaignBulkComponent;
  let fixture: ComponentFixture<CampaignBulkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignBulkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignBulkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
