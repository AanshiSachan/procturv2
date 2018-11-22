import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaignSmsComponent } from './compaign-sms.component';

describe('CompaignSmsComponent', () => {
  let component: CompaignSmsComponent;
  let fixture: ComponentFixture<CompaignSmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompaignSmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaignSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
