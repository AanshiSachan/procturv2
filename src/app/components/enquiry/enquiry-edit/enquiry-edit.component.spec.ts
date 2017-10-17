import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquiryEditComponent } from './enquiry-edit.component';

describe('EnquiryEditComponent', () => {
  let component: EnquiryEditComponent;
  let fixture: ComponentFixture<EnquiryEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnquiryEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnquiryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
