import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCouponHomeComponent } from './manage-coupon-home.component';

describe('ManageCouponHomeComponent', () => {
  let component: ManageCouponHomeComponent;
  let fixture: ComponentFixture<ManageCouponHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageCouponHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCouponHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
