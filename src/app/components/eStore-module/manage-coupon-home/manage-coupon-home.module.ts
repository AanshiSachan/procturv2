import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageCouponHomeRoutingModule } from './manage-coupon-home-routing.module';
import { ManageCouponHomeComponent } from './manage-coupon-home.component';
import { CouponListComponent } from './coupon-list/coupon-list.component';
import { VoucherListComponent } from './voucher-list/voucher-list.component';
import { VoucherAddEditComponent } from './voucher-add-edit/voucher-add-edit.component';
import { CouponAddEditComponent } from './coupon-add-edit/coupon-add-edit.component';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap-custome';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SharedModule } from '../../shared/shared.module';
import { HomeComponent } from './home/home.component';

@NgModule({
  imports: [
    CommonModule,
    ManageCouponHomeRoutingModule,
    FormsModule,
    BsDatepickerModule,
    NgMultiSelectDropDownModule.forRoot(),
    SharedModule
  ],
  declarations: [ManageCouponHomeComponent,
     CouponListComponent,
     VoucherListComponent,
     VoucherAddEditComponent,
     CouponAddEditComponent,
     HomeComponent]
})
export class ManageCouponHomeModule { }
