import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { addCouponForm } from '../../../../model/add-coupon';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { CommonServiceFactory } from '../../../../services/common-service';
import { MessageShowService } from '../../../../services/message-show.service';
import { ProductService } from '../../../../services/products.service';

@Component({
  selector: 'app-voucher-add-edit',
  templateUrl: './voucher-add-edit.component.html',
  styleUrls: ['./voucher-add-edit.component.scss']
})
export class VoucherAddEditComponent implements OnInit {

  addVoucherModel: addCouponForm = new addCouponForm();
  productList: any[] = [];
  productSetting: {} = {};
  productIds = [];
  selectedCouponId: any = null;
  offerStatus: any = false;
  selected_products: any[] = [];
  countryDetails: any = [];
  constructor(private _productService: ProductService,
    private _msgService: MessageShowService,
    private router: Router,
    private routeParam: ActivatedRoute,
    private auth: AuthenticatorService,
    private _commService: CommonServiceFactory) {
    this.routeParam.params.subscribe(params => {
      this.selectedCouponId = params['offer_id'];
    });
    console.log(this.selectedCouponId);
  }

  ngOnInit() {
    this.fetchDataForCountryDetails();
    this.addVoucherModel.offer_type = 2;
    this.addVoucherModel.total_coupons_created = 1;
    let tempDate = new Date();
    this.addVoucherModel.start_date = new Date();
    this.addVoucherModel.end_date = new Date(tempDate.setMonth(tempDate.getMonth() + 1));
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
  fetchDataForCountryDetails() {
    let encryptedData = sessionStorage.getItem('country_data');
    let data = JSON.parse(encryptedData);
    if (data.length > 0) {
      this.countryDetails = data;
      let defacult_Country = this.countryDetails.filter((country) => {
        return country.is_default == 'Y';
      })

      if (this.addVoucherModel.country_id == "") {
        this.addVoucherModel.country_id = defacult_Country[0].id;

      }
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
    if (this.addVoucherModel.flat_discount_amount === ''
      || this.addVoucherModel.product_id_list.length === 0 || this.addVoucherModel.offer_code === ''
      || this.addVoucherModel.start_date === null || this.addVoucherModel.end_date === null) {
      this._msgService.showErrorMessage('info', '', 'Please fill mandatory fields');
      return false;
    } else {
      const start_date = moment(this.addVoucherModel.start_date);
      const end_date = moment(this.addVoucherModel.end_date);
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
    this.addVoucherModel.product_id_list = this.productIds;
    this.addVoucherModel.product_id_list = this.productIds;
    this.addVoucherModel.start_date = moment(this.addVoucherModel.start_date).format("YYYY-MM-DD");
    this.addVoucherModel.end_date = moment(this.addVoucherModel.end_date).format("YYYY-MM-DD");
    if (this.validateForm()) {
      this.auth.showLoader();
      this._productService.postMethod('offer/create', this.addVoucherModel).then(
        (result: any) => {
          this.auth.hideLoader();
          const response = result['body'];
          if (response.validate) {
            this._msgService.showErrorMessage('success', '', response.result);
            this.router.navigate(['view/e-store/manage-offers/voucher']);
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
    this.router.navigate(['view/e-store/manage-offers/voucher']);
  }

  getVoucherById() {
    this.auth.showLoader();
    const url = `offer-map/get/${this.selectedCouponId}`;
    this._productService.getMethod(url, null).subscribe(
      (data: any) => {
        this.auth.hideLoader();
        this.addVoucherModel = data.result;
        this.addVoucherModel.start_date = moment(data.result.start_date).format("MM-DD-YYYY");
        this.addVoucherModel.end_date = moment(data.result.end_date).format("MM-DD-YYYY");
        this.addVoucherModel.discount_type = String(this.addVoucherModel.discount_type);
        this.addVoucherModel.product_id_list = data.result.product_details_list;
        this.selected_products = this.addVoucherModel.product_id_list;
        this.addVoucherModel.offer_status === 2 ? this.offerStatus = true : this.offerStatus = false;
        this.addVoucherModel.country_id = this.addVoucherModel.country_id;
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
    this.addVoucherModel.product_id_list = this.productIds;
    this.addVoucherModel.start_date = moment(this.addVoucherModel.start_date).format("YYYY-MM-DD");
    this.addVoucherModel.end_date = moment(this.addVoucherModel.end_date).format("YYYY-MM-DD");
    this.offerStatus === true ? this.addVoucherModel.offer_status = 2 : this.addVoucherModel.offer_status = 1;
    this.addVoucherModel.end_date = moment(this.addVoucherModel.end_date).format('YYYY-MM-DD');
    if (this.validateForm()) {
      this.auth.showLoader();
      this._productService.postMethod('offer/update', this.addVoucherModel).then(
        (result: any) => {
          this.auth.hideLoader();
          const response = result['body'];
          if (response.validate) {
            this._msgService.showErrorMessage('success', '', response.result);
            this.router.navigate(['view/e-store/manage-offers/voucher']);
          } else {
            this._msgService.showErrorMessage('error', '', response.error[0].error_message);
          }
        },
        (err) => {
          this.auth.hideLoader();
          console.log(err);
        }
      );
    }
  }

}
