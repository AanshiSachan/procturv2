import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../../services/products.service';
import { MessageShowService } from '../../../../services/message-show.service';

@Component({
  selector: 'app-coupon-list',
  templateUrl: './coupon-list.component.html',
  styleUrls: ['./coupon-list.component.scss']
})
export class CouponListComponent implements OnInit {
  searchFilter: {
    productId: string,
    status: string
  };
  varJson: any = {
    PageIndex: 1,
    sizeArr: [5, 25, 50, 100, 150, 200, 500],
    displayBatchSize: 25,
    total_items: 0
  };
  productList: any[] = [];
  couponData: any[] = [];
  isRippleLoad: boolean = false;
  tempData: any = {};

  constructor(
    private _productService: ProductService,
    private _msgService: MessageShowService
  ) { }

  ngOnInit() {
    this.searchFilter = {
      productId: 'All',
      status: '-1'
    };
    this.fectchTableDataByPage(1);
    this.getProductList();
  }

  getProductList() {
    this.isRippleLoad = true;
    this._productService.getMethod('product/get-product-list?status=30', null).subscribe(
      (data: any) => {
        this.isRippleLoad = false;
        this.productList = data.result;
      },
      err => {
        this.isRippleLoad = false;
        this._msgService.showErrorMessage('error', '', err.error.message);
      }
    );
  }

  setdelete(data) {
    this.tempData = data;
  }

  deleteCoupon(obj) {
    this.isRippleLoad = true;
    const url = `offer/delete/${obj.offer_id}`;
    this._productService.getMethod(url, null).subscribe(
      (res: any) => {
        this.isRippleLoad = false;
        this._msgService.showErrorMessage('success', '', res.result);
        this.couponData = this.couponData.filter(s => s.offer_id !== obj.offer_id);
      },
      (err) => {
        this.isRippleLoad = false;
        console.log(err);
      }
    );

  }

  /*** pagination functions */
  /* Fetch next set of data from server and update table */
  fetchNext() {
    this.varJson.PageIndex++;
    this.fectchTableDataByPage(this.varJson.PageIndex);
  }

  /* Fetch previous set of data from server and update table */
  fetchPrevious() {
    this.varJson.PageIndex--;
    this.fectchTableDataByPage(this.varJson.PageIndex);
  }

  updateTableBatchSize(num) {
    this.varJson.PageIndex = 1;
    this.varJson.displayBatchSize = parseInt(num);
    this.fectchTableDataByPage(this.varJson.PageIndex);
  }

  /* Fetch table data by page index */
  fectchTableDataByPage(index) {
    this.varJson.PageIndex = index;
    const object = {
      'productId': this.searchFilter.productId,
      'status': this.searchFilter.status,
      'pageNo': this.varJson.PageIndex,
      'noOfRecord': this.varJson.displayBatchSize,
      'offerType': 1
    };
    this.isRippleLoad = true;
    this._productService.getMethod('offer-map/advance-filter', object).subscribe(
      (resp: any) => {
        this.isRippleLoad = false;
        if (resp.validate) {
          this.couponData = resp.result.results;
          if (this.couponData) {
            this.couponData.forEach(element => {
              if (element.status === '1') {
                element.status = 'Active';
              } else if (element.status === '2') {
                element.status = 'Inactive';
              } else {
                element.status = 'Expired';
              }
            });
          }
          this.varJson.total_items = resp.result.total_records;
        } else {
          this.isRippleLoad = false;
          this._msgService.showErrorMessage('error', 'something went wrong, try again', '');
        }
      },
      (err) => {
        this.isRippleLoad = false;
        this._msgService.showErrorMessage('error', 'something went wrong, try again', '');
      });

  }

  clearFilter() {
    this.searchFilter = {
      productId: 'All',
      status: '-1'
    };
  }


}