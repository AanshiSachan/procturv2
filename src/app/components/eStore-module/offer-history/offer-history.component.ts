import { Component, OnInit } from '@angular/core';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { MessageShowService } from '../../../services/message-show.service';
import { ProductService } from '../../../services/products.service';
import { TablePreferencesService } from '../../../services/table-preference/table-preferences.service';
import { ExcelService } from '../../../services/excel.service';
import { ExportToPdfService } from '../../../services/export-to-pdf.service';

@Component({
  selector: 'app-offer-history',
  templateUrl: './offer-history.component.html',
  styleUrls: ['./offer-history.component.scss']
})
export class OfferHistoryComponent implements OnInit {
  searchFilter: string = '';
  displayKeys: any = [];
  totalCount: any;
  offerHistoryData: any[] = [];
  offerHistoryDataSource: any[] = [];
  varJson: any = {
    PageIndex: 1,
    sizeArr: [25, 50, 100, 150, 200, 500],
    displayBatchSize: 25,
    total_items: 0
  };
  feeSettings1 = [
    { primaryKey: 'offer_code', header: 'Offer Code', priority: 1, allowSortingFlag: true },
    { primaryKey: 'product_name', header: 'Product Name', priority: 2, allowSortingFlag: true },
    { primaryKey: 'user_name', header: 'User Name', priority: 4, allowSortingFlag: true },
    { primaryKey: 'discount_amount', header: 'Discount Amount', priority: 5, allowSortingFlag: true },
  ];


  // tableSetting: any = {
  //   tableDetails: { title: 'Offer Report', key: 'products.offerReport', showTitle: false },
  //   search: { title: 'Search', showSearch: false },
  //   keys: this.displayKeys,
  //   selectAll: { showSelectAll: false, option: 'single', title: 'Display report', checked: true, key: 'title' },
  //   defaultSort: { primaryKey: 'user_id', sortingType: 'asc', header: 'User Id', priority: 4, allowSortingFlag: true },
  //   actionSetting:
  //   {
  //     showActionButton: false
  //   },
  //   displayMessage: 'Data Not Found'
  // };

  constructor(private _tablePreferencesService: TablePreferencesService,
    private _productService: ProductService,
    private auth: AuthenticatorService,
    private _msgService: MessageShowService,
    private _excelService: ExcelService,
    private _pdfService: ExportToPdfService
  ) { }

  ngOnInit() {
    this.setTableData();
    // this.setDefaultValues();
    this.fectchTableDataByPage(1);
    //this.getOfferHistory();
  }
  headerSetting: any;
  tableSetting: any;
  rowColumns: any;

  setTableData() {
    this.headerSetting = [
      {
        primary_key: 'order_id',
        value: "Order ID",
        charactLimit: 20,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'product_name',
        value: "Product Name",
        charactLimit: 15,
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'user_name',
        value: "Student Name",
        charactLimit: 15,
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'phone',
        value: "Phone No",
        charactLimit: 50,
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'purchase_date',
        value: "Purchase Date",
        charactLimit: 15,
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'actual_amount',
        value: "Product Price",
        charactLimit: 30,
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'paid_amount',
        value: "Paid",
        charactLimit: 30,
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'offer_code',
        value: "Offer Code",
        charactLimit: 30,
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'status',
        value: "Offer Status",
        charactLimit: 30,
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'offer_type',
        value: "Coupon/Voucher",
        charactLimit: 30,
        sorting: false,
        visibility: true
      },

    ]

    this.tableSetting = {
      width: "100%",
      height: "67vh"
    }

    this.rowColumns = [
      {
        width: "10%",
        textAlign: "left"
      },
      {
        width: "10%",
        textAlign: "left"
      },
      {
        width: "10%",
        textAlign: "left"
      },
      {
        width: "10%",
        textAlign: "left"
      },
      {
        width: "10%",
        textAlign: "left"
      },
      {
        width: "10%",
        textAlign: "left"
      },
      {
        width: "10%",
        textAlign: "left"
      },
      {
        width: "10%",
        textAlign: "left"
      },
      {
        width: "10%",
        textAlign: "left"
      },
      {
        width: "10%",
        textAlign: "left"
      },

    ]
  }
  // setDefaultValues() {
  //   this.tableSetting.keys = [
  //     // As per TS 632 . Column Added. Added By Ashwini Kumar Gupta
  //     { primaryKey: 'order_id', header: 'Order ID', priority: 1, allowSortingFlag: true },
  //     { primaryKey: 'product_name', header: 'Product Name', priority: 2, allowSortingFlag: true },
  //     { primaryKey: 'user_name', header: 'Student Name', priority: 3, allowSortingFlag: true },
  //     { primaryKey: 'phone', header: 'Phone No', priority: 4, allowSortingFlag: true },
  //     { primaryKey: 'purchase_date', header: 'Purchase Date', priority: 5, allowSortingFlag: true },
  //     { primaryKey: 'actual_amount', header: 'Product Price', priority: 6, allowSortingFlag: true },
  //     { primaryKey: 'paid_amount', header: 'Paid', priority: 7, allowSortingFlag: true },
  //     { primaryKey: 'offer_code', header: 'Offer Code', priority: 8, allowSortingFlag: true },
  //     { primaryKey: 'status', header: 'Offer Status', priority: 9, allowSortingFlag: true },
  //     { primaryKey: 'offer_type', header: 'Coupon/Voucher', priority: 10, allowSortingFlag: true },
  //     // End
  //   ];
  //   this.displayKeys = this.tableSetting.keys;
  //   this._tablePreferencesService.setTablePreferences(this.tableSetting.tableDetails.key, this.displayKeys);
  // }

  getOfferHistory() {
    const object = {
      //Interchange the sequence and rename the page_no to pageNo and no_of_records to noOfRecords   -- Ashwini Kumar Gupta
      'pageNo': this.varJson.PageIndex,
      'noOfRecords': this.varJson.displayBatchSize,
      'searchValue': this.searchFilter,
    }
    this.auth.showLoader();
    this._productService.getMethod('use-offer/search-filter', object).subscribe(
      (data: any) => {
        if (data.validate) {
          this.auth.hideLoader();
          this.offerHistoryData = data.result.results;
          this.totalCount = this.offerHistoryData.length; //Fetching the total count of record. Added by Ashwini Gupta
          console.log(this.totalCount);

        } else {
          this.auth.hideLoader();
          this._msgService.showErrorMessage('error', 'something went wrong, try again', '');
        }

      },
      err => {
        this.auth.hideLoader();
        this._msgService.showErrorMessage('error', '', err.error.message);
      }
    );
  }

  optionSelected($event) {
    console.log($event);
  }

  /** this function is used to download execel
   * written by laxmi
  */
  exportToExcel() {
    let exportedArray: any[] = [];
    this.offerHistoryData.map((data: any) => {
      let obj = {};
      obj["Order ID"] = data.order_id;
      obj["Product Name"] = data.product_name;
      obj["Student Name"] = data.user_name;
      obj["Phone No"] = data.phone;
      obj["Purchase Date"] = data.purchase_date;
      obj["Product Price"] = data.actual_amount;
      obj["Paid"] = data.paid_amount;
      obj["Offer Code"] = data.offer_code;
      obj["Offer Status"] = data.status;
      obj["Coupon/Voucher"] = data.offer_type;
      exportedArray.push(obj);
    })
    this._excelService.exportAsExcelFile(
      exportedArray,
      'eStore Offer History'
    )
  }

  /** this function is used to download pdf
   * written by Aswhini Kumar Gupta
  */
  exportToPdf() {
    let arr = [];
    this.offerHistoryData.map(
      (ele: any) => {
        console.log(ele.status);
        let json = [
          ele.order_id,
          ele.product_name,
          ele.user_name,
          ele.phone,
          ele.purchase_date,
          ele.actual_amount,
          ele.paid_amount,
          ele.offer_code,
          ele.status,
          ele.offer_type,
        ]
        arr.push(json);
      })

    let rows = [];
    rows = [['Order ID', "Product Name", "Student Name", 'Phone No', 'Purchase Date', 'Product Price', 'Paid', 'Offer Code', 'Offer Status', 'Coupon/Voucher']]
    let columns = arr;
    let columnStyles = {
      1: {
        columnWidth: 30
      },
      2: {
        columnWidth: 90
      },
      3: {
        columnWidth: 30
      },

    };
    this._pdfService.exportToPdf(rows, columns, 'eStore', columnStyles);
  }


  // pagination functions Added by ashwini gupta  - Server side pagination

  /* Fetch table data by page index */
  fectchTableDataByPage(index) {
    this.varJson.PageIndex = index;
    const object = {
      //Interchange the sequence and rename the page_no to pageNo and no_of_records to noOfRecords   -- Ashwini Kumar Gupta
      'pageNo': this.varJson.PageIndex,
      'noOfRecords': this.varJson.displayBatchSize,
      'searchValue': this.searchFilter,
    }
    this.auth.showLoader();
    this._productService.getMethod('use-offer/search-filter', object).subscribe(
      (resp: any) => {
        if (resp.validate) {
          this.auth.hideLoader();
          this.offerHistoryData = resp.result.results;
          this.varJson.total_items = resp.result.total_records;//Fetching the total count of record. Added by Ashwini Gupta
        } else {
          this.auth.hideLoader();
          this._msgService.showErrorMessage('error', 'something went wrong, try again', '');
        }

      },
      (err) => {
        this.auth.hideLoader();
        this._msgService.showErrorMessage('error', 'something went wrong, try again', '');
      });

  }
  fetchNext() {
    this.varJson.PageIndex++;
    this.fectchTableDataByPage(this.varJson.PageIndex);
  }

  fetchPrevious() {
    this.varJson.PageIndex--;
    this.fectchTableDataByPage(this.varJson.PageIndex);
  }
  updateTableBatchSize(num) {
    this.varJson.PageIndex = 1;
    this.varJson.displayBatchSize = parseInt(num);
    this.fectchTableDataByPage(this.varJson.PageIndex);
  }

  //End
}
