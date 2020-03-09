import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { addCouponForm } from '../../../../model/add-coupon';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { CommonServiceFactory } from '../../../../services/common-service';
import { MessageShowService } from '../../../../services/message-show.service';
import { ProductService } from '../../../../services/products.service';

@Component({
  selector: 'app-coupon-add-edit',
  templateUrl: './coupon-add-edit.component.html',
  styleUrls: ['./coupon-add-edit.component.scss']
})
export class CouponAddEditComponent implements OnInit {
  addCouponModel: addCouponForm = new addCouponForm();
  selectedCouponId: any = null;
  selected_products: any[] = [];
  productIds = [];
  productList: any[] = [];
  productSetting: {} = {};
  offerStatus: any = false;

  constructor(private _productService: ProductService,
    private _msgService: MessageShowService,
    private router: Router,
    private routeParam: ActivatedRoute,
    public _commService: CommonServiceFactory,
    private auth:AuthenticatorService,
  ) {
    this.routeParam.params.subscribe(params => {
      this.selectedCouponId = params['offer_id'];
    });
    console.log(this.selectedCouponId);
  }

  ngOnInit() {
    let tempDate = new Date();
    this.addCouponModel.start_date = new Date();
    this.addCouponModel.end_date = new Date(tempDate.setMonth( tempDate.getMonth() + 1 ));
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
      this.getCouponById();
    }
  }

  getProductList() {
    this.auth.showLoader();
    this._productService.getMethod('product/get-product-list?status=30', null).subscribe(
      (data: any) => {
        this.productList = data.result;
        this.auth.hideLoader();
      },
      err => {
        this.auth.hideLoader();
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
    if (((this.addCouponModel.discount_type === '1' && (this.addCouponModel.flat_discount_amount === ''))
    || (this.addCouponModel.discount_type === '2' && (this.addCouponModel.discount_percentage === ''
    || this.addCouponModel.maximum_percentage_discount === '')) || this.addCouponModel.minimum_amount_in_cart === '' ||
    this.addCouponModel.maximum_coupons_per_user === '' || this.addCouponModel.total_coupons_created === ''
    || this.addCouponModel.product_id_list.length === 0 || this.addCouponModel.offer_code === '' || this.addCouponModel.end_date === null
    || this.addCouponModel.start_date === null )) {
      this._msgService.showErrorMessage('info', '', 'Please fill mandatory fields');
      return false;
    } else {
      const start_date = moment(this.addCouponModel.start_date);
      const end_date = moment(this.addCouponModel.end_date);
      if (start_date > end_date) {
        this._msgService.showErrorMessage('error', '', 'Start date can not be greater than end date');
        return false;
      }
      return true;
    }
  }

  createCoupon() {
    this.productIds = [];
    this.productIds = Array.prototype.map.call(this.selected_products, product => product.id);
    this.addCouponModel.product_id_list = this.productIds;
    if (this.validateForm()) {
    this.auth.showLoader();
    this._productService.postMethod('offer/create', this.addCouponModel).then(
      (result: any) => {
        this.auth.hideLoader();
        const response = result['body'];
        if (response.validate) {
          this._msgService.showErrorMessage('success', '', response.result);
          this.router.navigate(['view/e-store/manage-offers/coupon']);
        } else {
          this._msgService.showErrorMessage('error', response.error[0].error_message, '');
        }
      },
      (err) => {
        this.auth.hideLoader();
        console.log(err);
      }
    );
    }
  }

  cancel() {
    this.router.navigate(['view/e-store/manage-offers/coupon']);
  }

  getCouponById() {
    this.auth.showLoader();
    const url = `offer-map/get/${this.selectedCouponId}`;
    this._productService.getMethod(url, null).subscribe(
      (data: any) => {
        this.auth.hideLoader();
        this.addCouponModel = data.result;
        this.addCouponModel.discount_type = String(this.addCouponModel.discount_type);
        this.addCouponModel.product_id_list = data.result.product_details_list;
        this.selected_products = this.addCouponModel.product_id_list;
        this.addCouponModel.offer_status === 2 ? this.offerStatus = true : this.offerStatus = false;
      },
      err => {
        this.auth.hideLoader();
        this._msgService.showErrorMessage('error', '', err.error.message);
      }
    );
  }

  updateCoupon() {
    this.productIds = [];
    this.productIds = Array.prototype.map.call(this.selected_products, product => product.id);
    this.addCouponModel.product_id_list = this.productIds;
    this.offerStatus === true ? this.addCouponModel.offer_status = 2 : this.addCouponModel.offer_status = 1;
  if (this.validateForm()) {
    this.auth.showLoader();
    this._productService.postMethod('offer/update', this.addCouponModel).then(
      (result: any) => {
        this.auth.hideLoader();
        const response = result['body'];
        if (response.validate) {
          this._msgService.showErrorMessage('success', '', response.result);
          this.router.navigate(['view/e-store/manage-offers/coupon']);
        } else {
          this._msgService.showErrorMessage('error', '', response.error[0].error_message);
        }
      },
      (err) => {
        this.auth.hideLoader();
      }
    );
  }
}

}
