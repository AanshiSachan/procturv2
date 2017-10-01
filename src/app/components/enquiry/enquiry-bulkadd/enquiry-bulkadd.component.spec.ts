import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquiryBulkaddComponent } from './enquiry-bulkadd.component';

describe('EnquiryBulkaddComponent', () => {
  let component: EnquiryBulkaddComponent;
  let fixture: ComponentFixture<EnquiryBulkaddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnquiryBulkaddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnquiryBulkaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
