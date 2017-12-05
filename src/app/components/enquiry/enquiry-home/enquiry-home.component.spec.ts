import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquiryHomeComponent } from './enquiry-home.component';

describe('EnquiryHomeComponent', () => {
  let component: EnquiryHomeComponent;
  let fixture: ComponentFixture<EnquiryHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnquiryHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnquiryHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
