import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquiryLeadsComponent } from './enquiry-leads.component';

describe('EnquiryLeadsComponent', () => {
  let component: EnquiryLeadsComponent;
  let fixture: ComponentFixture<EnquiryLeadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnquiryLeadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnquiryLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
