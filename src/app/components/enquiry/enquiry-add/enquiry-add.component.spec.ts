import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquiryAddComponent } from './enquiry-add.component';

describe('EnquiryAddComponent', () => {
  let component: EnquiryAddComponent;
  let fixture: ComponentFixture<EnquiryAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnquiryAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnquiryAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
