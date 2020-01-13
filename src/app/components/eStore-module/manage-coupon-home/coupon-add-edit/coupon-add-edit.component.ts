import { Component, OnInit } from '@angular/core';
import { addCouponForm } from '../../../../model/add-coupon';
import { ProductService } from '../../../../services/products.service';
import { MessageShowService } from '../../../../services/message-show.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonServiceFactory } from '../../../../services/common-service';

@Component({
  selector: 'app-coupon-add-edit',
  templateUrl: './coupon-add-edit.component.html',
  styleUrls: ['./coupon-add-edit.component.scss']
})
export class CouponAddEditComponent implements OnInit {
  addCouponModel: addCouponForm = new addCouponForm();
  isRippleLoad = false;
  selectedCouponId: any = null;
  selected_products: any[] = [];
  productIds = [];
  productList: any[] = [];
  productSetting: {} = {};

  constructor(private _productService: ProductService,
    private _msgService: MessageShowService,
    private router: Router,
    private routeParam: ActivatedRoute,
    public _commService: CommonServiceFactory
  ) {
    this.routeParam.params.subscribe(params => {
      this.selectedCouponId = params['offer_id'];
    });
    console.log(this.selectedCouponId);
  }

  ngOnInit() {
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
    this.isRippleLoad = true;
    this._productService.getMethod('product/get-product-list', null).subscribe(
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
    if (((this.addCouponModel.discount_type === '1' && (this.addCouponModel.flat_discount_amount === ''
    || this.addCouponModel.minimum_amount_in_cart === '')) || (this.addCouponModel.discount_type === '2'
    && (this.addCouponModel.discount_percentage === '' || this.addCouponModel.maximum_percentage_discount === '')) ||
    this.addCouponModel.maximum_coupons_per_user === '' || this.addCouponModel.total_coupons_created === ''
    || this.addCouponModel.product_id_list.length === 0 || this.addCouponModel.offer_code === '' )) {
      return false;
    } else {
      return true;
    }
  }

  createCoupon() {
    this.productIds = [];
    this.productIds = Array.prototype.map.call(this.selected_products, product => product.id);
    this.addCouponModel.product_id_list = this.productIds;
    if (this.validateForm()) {
    this.isRippleLoad = true;
    this._productService.postMethod('offer/create', this.addCouponModel).then(
      (result: any) => {
        this.isRippleLoad = false;
        const response = result['body'];
        if (response.validate) {
          this._msgService.showErrorMessage('success', '', response.result);
          this.router.navigate(['view/e-store/manage-offers/coupon']);
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
    this.router.navigate(['view/e-store/manage-offers/coupon']);
  }

  getCouponById() {
    this.isRippleLoad = true;
    const url = `offer-map/get/${this.selectedCouponId}`;
    this._productService.getMethod(url, null).subscribe(
      (data: any) => {
        this.isRippleLoad = false;
        this.addCouponModel = data.result;
        this.addCouponModel.discount_type = String(this.addCouponModel.discount_type);
        this.addCouponModel.product_id_list = data.result.product_details_list;
        this.selected_products = this.addCouponModel.product_id_list;
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
    this.addCouponModel.product_id_list = this.productIds;
  if (this.validateForm()) {
    this.isRippleLoad = true;
    this._productService.postMethod('offer/update', this.addCouponModel).then(
      (result: any) => {
        this.isRippleLoad = false;
        const response = result['body'];
        if (response.validate) {
          this._msgService.showErrorMessage('success', '', response.result);
          this.router.navigate(['view/e-store/manage-offers/coupon']);
        } else {
          this._msgService.showErrorMessage('error', '', response.error[0].error_message);
        }
      },
      (err) => {
        this.isRippleLoad = false;
      }
    );
  } else {
    this._msgService.showErrorMessage('info', '', 'Please fill mandatory fields');
  }
}

}
