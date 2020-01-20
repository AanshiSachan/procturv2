import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferHistoryComponent } from './offer-history.component';

describe('OfferHistoryComponent', () => {
  let component: OfferHistoryComponent;
  let fixture: ComponentFixture<OfferHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
