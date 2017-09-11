import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomAddEnquiryComponent } from './custom-add-enquiry.component';

describe('CustomAddEnquiryComponent', () => {
  let component: CustomAddEnquiryComponent;
  let fixture: ComponentFixture<CustomAddEnquiryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomAddEnquiryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomAddEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
