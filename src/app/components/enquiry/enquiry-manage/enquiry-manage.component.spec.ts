import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquiryManageComponent } from './enquiry-manage.component';

describe('EnquiryManageComponent', () => {
  let component: EnquiryManageComponent;
  let fixture: ComponentFixture<EnquiryManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnquiryManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnquiryManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
