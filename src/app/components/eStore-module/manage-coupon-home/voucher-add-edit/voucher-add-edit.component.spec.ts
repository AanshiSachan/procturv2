import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherAddEditComponent } from './voucher-add-edit.component';

describe('VoucherAddEditComponent', () => {
  let component: VoucherAddEditComponent;
  let fixture: ComponentFixture<VoucherAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoucherAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
