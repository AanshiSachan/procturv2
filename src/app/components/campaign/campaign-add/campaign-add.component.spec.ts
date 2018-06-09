import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignAddComponent } from './campaign-add.component';

describe('CampaignAddComponent', () => {
  let component: CampaignAddComponent;
  let fixture: ComponentFixture<CampaignAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
