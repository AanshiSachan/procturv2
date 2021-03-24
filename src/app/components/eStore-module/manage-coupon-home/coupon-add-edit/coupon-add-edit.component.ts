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
  country: any = [];
  disableAll: boolean = false;
  productSetting: {} = {};
  offerStatus: any = false;
  countryDetails: any = [];
  constructor(private _productService: ProductService,
    private _msgService: MessageShowService,
    private router: Router,
    private routeParam: ActivatedRoute,
    public _commService: CommonServiceFactory,
    private auth: AuthenticatorService,
  ) {
    this.routeParam.params.subscribe(params => {
      this.selectedCouponId = params['offer_id'];
    });
    console.log(this.selectedCouponId);
  }

  ngOnInit() {
    let tempDate = new Date();
    this.addCouponModel.start_date = new Date();
    this.addCouponModel.end_date = new Date(tempDate.setMonth(tempDate.getMonth() + 1));
    this.fetchDataForCountryDetails();
    this.getProductList();
    this.productSetting = {
      singleSelection: false,
      idField: 'id',
      textField: 'title',
      itemsShowLimit: 4,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableCheckAll: false
    };
    if (this.selectedCouponId) {
      this.getCouponById();
    }
  }


  checkProduct(e) {
    this.country = [];
    for (let i = 0; i < this.productList.length; i++) {
      for (let j = 0; j < e.length; j++) {
        if (this.productList[i].id == e[j].id) {
          this.country.push(this.productList[i].country_id);
        }
      }
    }
    for (let i = 0; i < this.country.length; i++) {
      if (this.country[0] != this.country[i]) {
        this._msgService.showErrorMessage('error', '', "Add product of same country");
        this.disableAll = true;
      }
      else {
        this.disableAll = false;
      }
    }
    this.addCouponModel.country_id = this.country[0];
    // let index = (this.country.length = 1 ? (this.country.length) - 1 : this.country.length);
    // for (let i = 0; i < this.countryDetails.length; i++) {
    //   if (this.countryDetails[i].id == this.country[index])
    //     this.addCouponModel.country_id = this.countryDetails[i].id;
    // }
  }
  fetchDataForCountryDetails() {
    let encryptedData = sessionStorage.getItem('country_data');
    let data = JSON.parse(encryptedData);
    if (data.length > 0) {
      this.countryDetails = data;
      let defacult_Country = this.countryDetails.filter((country) => {
        return country.is_default == 'Y';
      })

      if (this.addCouponModel.country_id == "") {
        this.addCouponModel.country_id = defacult_Country[0].id;

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
    if (this.disableAll) {
      this._msgService.showErrorMessage('error', '', "Add product of same country");
    }
    else {
      if (this.selectedCouponId) {
        this.updateCoupon();
      } else {
        this.createCoupon();
      }
    }

  }

  validateForm() {
    if (((this.addCouponModel.discount_type === '1' && (this.addCouponModel.flat_discount_amount === ''))
      || (this.addCouponModel.discount_type === '2' && (this.addCouponModel.discount_percentage === ''
        || this.addCouponModel.maximum_percentage_discount === '')) || this.addCouponModel.minimum_amount_in_cart === '' ||
      this.addCouponModel.maximum_coupons_per_user === '' || this.addCouponModel.total_coupons_created === ''
      || this.addCouponModel.product_id_list.length === 0 || this.addCouponModel.offer_code === '' || this.addCouponModel.country_id === 0 || this.addCouponModel.end_date === null
      || this.addCouponModel.start_date === null)) {
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
    this.addCouponModel.start_date = moment(this.addCouponModel.start_date).format("YYYY-MM-DD");
    this.addCouponModel.end_date = moment(this.addCouponModel.end_date).format("YYYY-MM-DD");
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
        console.log("this.addCouponModel", this.addCouponModel);
        this.addCouponModel.start_date = moment(data.result.start_date).format("YYYY-MM-DD");
        this.addCouponModel.end_date = moment(data.result.end_date).format("YYYY-MM-DD");
        this.addCouponModel.discount_type = String(this.addCouponModel.discount_type);
        this.addCouponModel.product_id_list = data.result.product_details_list;
        this.selected_products = this.addCouponModel.product_id_list;
        this.addCouponModel.offer_status === 2 ? this.offerStatus = true : this.offerStatus = false;
        this.addCouponModel.country_id = this.addCouponModel.country_id;
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
    this.addCouponModel.start_date = moment(this.addCouponModel.start_date).format("YYYY-MM-DD");
    this.addCouponModel.end_date = moment(this.addCouponModel.end_date).format("YYYY-MM-DD");
    this.offerStatus === true ? this.addCouponModel.offer_status = 2 : this.addCouponModel.offer_status = 1;
    this.addCouponModel.end_date = moment(this.addCouponModel.end_date).format('YYYY-MM-DD');
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
