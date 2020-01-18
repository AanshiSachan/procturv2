import { Component, OnInit } from '@angular/core';
import { addCouponForm } from '../../../../model/add-coupon';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageShowService } from '../../../../services/message-show.service';
import { ProductService } from '../../../../services/products.service';
import { CommonServiceFactory } from '../../../../services/common-service';

@Component({
  selector: 'app-voucher-add-edit',
  templateUrl: './voucher-add-edit.component.html',
  styleUrls: ['./voucher-add-edit.component.scss']
})
export class VoucherAddEditComponent implements OnInit {
  addVoucherModel: addCouponForm = new addCouponForm();
  isRippleLoad = false;
  productList: any[] = [];
  productSetting: {} = {};
  productIds = [];
  selectedCouponId: any = null;
  offerStatus: any = false;
  selected_products: any[] = [];

  constructor(private _productService: ProductService,
    private _msgService: MessageShowService,
    private router: Router,
    private routeParam: ActivatedRoute,
    private _commService: CommonServiceFactory) {
    this.routeParam.params.subscribe(params => {
      this.selectedCouponId = params['offer_id'];
    });
    console.log(this.selectedCouponId);
  }

  ngOnInit() {
    this.addVoucherModel.offer_type = 2;
    this.addVoucherModel.total_coupons_created = 1;
    let tempDate = new Date();
    this.addVoucherModel.start_date = new Date();
    this.addVoucherModel.end_date = new Date(tempDate.setMonth( tempDate.getMonth() + 1 ));
    this.getProductList();
    this.productSetting = {
      singleSelection: false,
      idField: 'id',
      textField: 'title',
      itemsShowLimit: 4,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableCheckAll: true
    };
    if (this.selectedCouponId) {
      this.getVoucherById();
    }
  }

  getProductList() {
    this.isRippleLoad = true;
    this._productService.getMethod('product/get-product-list?status=30', null).subscribe(
      (data: any) => {
        this.productList = data.result;
        this.isRippleLoad = false;
      },
      err => {
        this.isRippleLoad = false;
        this._msgService.showErrorMessage('error', '', err.error.message);
      }
    );
  }

  saveData() {
    if (this.selectedCouponId) {
      this.updateCoupon();
    } else {
      this.createCoupon();
    }
  }

  validateForm() {
    if (this.addVoucherModel.flat_discount_amount === ''
    || this.addVoucherModel.product_id_list.length === 0 || this.addVoucherModel.offer_code === ''
     || this.addVoucherModel.start_date === null || this.addVoucherModel.end_date === null) {
      return false;
    } else {
      return true;
    }
  }

  createCoupon() {
    this.productIds = [];
    this.productIds = Array.prototype.map.call(this.selected_products, product => product.id);
    this.addVoucherModel.product_id_list = this.productIds;
    if (this.validateForm()) {
      this.isRippleLoad = true;
      this._productService.postMethod('offer/create', this.addVoucherModel).then(
        (result: any) => {
          this.isRippleLoad = false;
          const response = result['body'];
          if (response.validate) {
            this._msgService.showErrorMessage('success', '', response.result);
            this.router.navigate(['view/e-store/manage-offers/voucher']);
          } else {
            this._msgService.showErrorMessage('error', response.error[0].error_message, '');
          }
        },
        (err) => {
          this.isRippleLoad = false;
          console.log(err);
        }
      );
    } else {
      this._msgService.showErrorMessage('info', '', 'Please fill mandatory fields');
    }
  }

  cancel() {
    this.router.navigate(['view/e-store/manage-offers/voucher']);
  }

  getVoucherById() {
    this.isRippleLoad = true;
    const url = `offer-map/get/${this.selectedCouponId}`;
    this._productService.getMethod(url, null).subscribe(
      (data: any) => {
        this.isRippleLoad = false;
        this.addVoucherModel = data.result;
        this.addVoucherModel.discount_type = String(this.addVoucherModel.discount_type);
        this.addVoucherModel.product_id_list = data.result.product_details_list;
        this.selected_products = this.addVoucherModel.product_id_list;
        this.addVoucherModel.offer_status === 2 ? this.offerStatus = true : this.offerStatus = false;
      },
      err => {
        this.isRippleLoad = false;
        this._msgService.showErrorMessage('error', '', err.error.message);
      }
    );
  }

  updateCoupon() {
      this.productIds = [];
    this.productIds = Array.prototype.map.call(this.selected_products, product => product.id);
    this.addVoucherModel.product_id_list = this.productIds;
    this.offerStatus === true ? this.addVoucherModel.offer_status = 2 : this.addVoucherModel.offer_status = 1;
    if (this.validateForm()) {
      this.isRippleLoad = true;
      this._productService.postMethod('offer/update', this.addVoucherModel).then(
        (result: any) => {
          this.isRippleLoad = false;
          const response = result['body'];
          if (response.validate) {
            this._msgService.showErrorMessage('success', '', response.result);
            this.router.navigate(['view/e-store/manage-offers/voucher']);
          } else {
            this._msgService.showErrorMessage('error', '', response.error[0].error_message);
          }
        },
        (err) => {
          this.isRippleLoad = false;
          console.log(err);
        }
      );
    } else {
      this._msgService.showErrorMessage('info', '', 'Please fill mandatory fields');
    }
  }

}
