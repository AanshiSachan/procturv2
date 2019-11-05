import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignPopUpComponent } from './campaign-pop-up.component';

describe('CampaignPopUpComponent', () => {
  let component: CampaignPopUpComponent;
  let fixture: ComponentFixture<CampaignPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignPopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
