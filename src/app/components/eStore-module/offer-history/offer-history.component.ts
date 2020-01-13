import { Component, OnInit } from '@angular/core';
import { TablePreferencesService } from '../../../services/table-preference/table-preferences.service';
import { ProductService } from '../../../services/products.service';
import { MessageShowService } from '../../../services/message-show.service';

@Component({
  selector: 'app-offer-history',
  templateUrl: './offer-history.component.html',
  styleUrls: ['./offer-history.component.scss']
})
export class OfferHistoryComponent implements OnInit {
  searchFilter: string = '';
  displayKeys: any = [];
  offerHistoryData: any[] = [];
  varJson: any = {
    PageIndex: 1,
    sizeArr: [5, 25, 50, 100, 150, 200, 500],
    displayBatchSize: 25,
    total_items: 0
  };
  isRippleLoad: boolean = false;

  feeSettings1 = [
    { primaryKey: 'offer_code', header: 'Offer Code', priority: 1, allowSortingFlag: true },
    { primaryKey: 'product_name', header: 'Product Name', priority: 2, allowSortingFlag: true },
    { primaryKey: 'user_id', header: 'User Id', priority: 3, allowSortingFlag: true },
    { primaryKey: 'user_name', header: 'User Name', priority: 4, allowSortingFlag: true },
    { primaryKey: 'discount_amount', header: 'Discount Amount', priority: 5, allowSortingFlag: true },
  ];


  tableSetting: any = {
    tableDetails: { title: 'Offer Report', key: 'products.offerReport', showTitle: false },
    search: { title: 'Search', showSearch: false },
    keys: this.displayKeys,
    selectAll: { showSelectAll: false, option: 'single', title: 'Display report', checked: true, key: 'title' },
    defaultSort: { primaryKey: 'user_id', sortingType: 'asc', header: 'User Id', priority: 4, allowSortingFlag: true },
    actionSetting:
    {
      showActionButton: false
    },
    displayMessage: 'Data Not Found'
  };

  constructor(private _tablePreferencesService: TablePreferencesService,
    private _productService: ProductService,
    private _msgService: MessageShowService
  ) { }

  ngOnInit() {
    this.setDefaultValues();
    this.getOfferHistory(1);
  }

  setDefaultValues() {
    this.tableSetting.keys = [
      { primaryKey: 'offer_code', header: 'Offer Code', priority: 1, allowSortingFlag: true },
      { primaryKey: 'product_name', header: 'Product Name', priority: 2, allowSortingFlag: true },
      { primaryKey: 'user_id', header: 'User Id', priority: 3, allowSortingFlag: true },
      { primaryKey: 'user_name', header: 'User Name', priority: 4, allowSortingFlag: true },
      { primaryKey: 'discount_amount', header: 'Discount Amount', priority: 5, allowSortingFlag: true },
    ];
    this.displayKeys = this.tableSetting.keys;
    this._tablePreferencesService.setTablePreferences(this.tableSetting.tableDetails.key, this.displayKeys);
  }

  getOfferHistory(index) {
    this.varJson.PageIndex = index;
    const object = {
      'searchValue': this.searchFilter,
      'page_no': this.varJson.PageIndex,
      'no_of_records': this.varJson.displayBatchSize,
    }
    this.isRippleLoad = true;
    this._productService.getMethod('use-offer/search-filter', object).subscribe(
      (data: any) => {
        if (data.validate) {
          this.isRippleLoad = false;
          this.offerHistoryData = data.result;
        } else {
          this.isRippleLoad = false;
          this._msgService.showErrorMessage('error', 'something went wrong, try again', '');
        }
      },
      err => {
        this.isRippleLoad = false;
        this._msgService.showErrorMessage('error', '', err.error.message);
      }
    );
  }


  optionSelected($event) {
    console.log($event);
  }

}
