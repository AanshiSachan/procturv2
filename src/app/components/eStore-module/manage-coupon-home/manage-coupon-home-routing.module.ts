import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageCouponHomeComponent } from './manage-coupon-home.component';
import { CouponListComponent } from './coupon-list/coupon-list.component';
import { CouponAddEditComponent } from './coupon-add-edit/coupon-add-edit.component';
import { VoucherListComponent } from './voucher-list/voucher-list.component';
import { VoucherAddEditComponent } from './voucher-add-edit/voucher-add-edit.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
      path: '',
      component: ManageCouponHomeComponent,
      pathMatch: 'prefix',
      children: [
          {
              path: '',
              redirectTo: 'coupon'
          },
          {
              path: 'coupon',
              component: CouponListComponent
          },
          {
              path: 'coupon/add',
              component: CouponAddEditComponent
          },
          {
            path: 'coupon/edit/:offer_id',
            component: CouponAddEditComponent
          },
          {
            path: 'voucher',
            component: VoucherListComponent
          },
          {
            path: 'voucher/add',
            component: VoucherAddEditComponent
          },
          {
            path: 'voucher/edit/:offer_id',
            component: VoucherAddEditComponent
          }
      ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageCouponHomeRoutingModule { }
