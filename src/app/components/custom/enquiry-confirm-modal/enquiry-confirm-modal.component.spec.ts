import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquiryConfirmModalComponent } from './enquiry-confirm-modal.component';

describe('EnquiryConfirmModalComponent', () => {
  let component: EnquiryConfirmModalComponent;
  let fixture: ComponentFixture<EnquiryConfirmModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnquiryConfirmModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnquiryConfirmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
