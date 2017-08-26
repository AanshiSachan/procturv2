import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomEditEnquiryComponent } from './custom-edit-enquiry.component';

describe('CustomEditEnquiryComponent', () => {
  let component: CustomEditEnquiryComponent;
  let fixture: ComponentFixture<CustomEditEnquiryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomEditEnquiryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomEditEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
