import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquiryUpdatePopupComponent } from './enquiry-update-popup.component';

describe('EnquiryUpdatePopupComponent', () => {
  let component: EnquiryUpdatePopupComponent;
  let fixture: ComponentFixture<EnquiryUpdatePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnquiryUpdatePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnquiryUpdatePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
