import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ColumnData2 } from '../../shared/data-display-table/data-display-table.model';
import { MessageShowService } from '../../../services/message-show.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { TablePreferencesService } from '../../../services/table-preference/table-preferences.service';
import { ExportToPdfService } from '../../../services/export-to-pdf.service';
import { DataDisplayTableComponent } from '../../shared/data-display-table/data-display-table.component';
import { HttpService } from '../../../services/http.service';
import { ProductService } from '../../../services/products.service';
import * as moment from 'moment';
@Component({
  selector: 'app-sales-reportcls',
  templateUrl: './sales-reportcls.component.html',
  styleUrls: ['./sales-reportcls.component.scss']
})
export class SalesReportclsComponent implements OnInit {

  @ViewChild('child') private child: DataDisplayTableComponent;
  @ViewChild('form') form: any;
  feeDataSource: any[] = [];
  displayKeys: any = [];//need for selected keys
  private slotIdArr: any[] = [];
  salesDataSource: any[] = [];
  private selectedSlots: any[] = [];
  private selectedSlotsString: string = '';
  private selectedSlotsID: string = '';
  filterDataKeys = {
    to_date: moment().format("YYYY-MM-DD"),
    from_date: moment().format("YYYY-MM-DD")
  }
  showPopupKeys: any = {
    showPreference: false,
    isProfessional: false,
    isRippleLoad: false
  }
  feeSettings1: ColumnData2[] = [
    { primaryKey: 'title', header: 'Product Name', priority: 1, allowSortingFlag: true },
    { primaryKey: 'valid_from_date', header: 'Start Date', priority: 2, allowSortingFlag: true },
    { primaryKey: 'valid_to_date', header: 'End Date', priority: 3, allowSortingFlag: true },
    { primaryKey: 'publish_date', header: 'Publish Date', priority: 4, amountValue: true, allowSortingFlag: true },
    { primaryKey: 'price', header: 'Price', priority: 5, amountValue: true, allowSortingFlag: true },
    { primaryKey: 'status', header: 'Status', priority: 6, allowSortingFlag: true }];

  tableSetting: any = {//inventory.item
    tableDetails: { title: 'Sales Report', key: 'products.salesReports', showTitle: false },
    search: { title: 'Search', showSearch: false },
    keys: this.displayKeys,
    selectAll: { showSelectAll: false, title: 'Sales report', checked: true, key: 'title' },
    actionSetting:
    {
      showActionButton: false
    },
    displayMessage: "Enter Detail to Search"
  };

  constructor(private auth: AuthenticatorService,
    private _tablePreferencesService: TablePreferencesService,
    private pdf: ExportToPdfService,
    private ref: ChangeDetectorRef,
    private _msgService: MessageShowService,
    private _http: HttpService,
    private http: ProductService, ) { }

  ngOnInit() {

    this.tableSetting.keys = this.feeSettings1;
    if (this._tablePreferencesService.getTablePreferences(this.tableSetting.tableDetails.key) != null) {
      this.displayKeys = this._tablePreferencesService.getTablePreferences(this.tableSetting.tableDetails.key);

      this.tableSetting.keys = this.displayKeys;
      if (this.displayKeys.length == 0) {
        this.setDefaultValues();
      }
    }
    else {
      this.setDefaultValues();
    }
    console.log(this.tableSetting);
    this.fectchTableDataByPage(0);
  }

  optionSelected($event) {
    console.log($event)
  }

  /* Fetch table data by page index */
  fectchTableDataByPage(index) {
    let object = {
      "page_no": 1,
      "no_of_records": 100
    }

    this.showPopupKeys.isRippleLoad = true;
    this.http.postMethod('product/get', object).then(
      (resp: any) => {
        this.showPopupKeys.isRippleLoad = false;
        let response = resp['body'];
        console.log(response);
        if (response.validate) {
          this.salesDataSource = response.result.results;
        }
        else {
          this._msgService.showErrorMessage('error', "something went wrong, try again", '');
        }
      },
      (err) => {
        this.showPopupKeys.isRippleLoad = false;
        this._msgService.showErrorMessage('error', "something went wrong, try again", '');
      });

  }

  multiselectVisible(elid) {
    let targetid = elid + "multi";
    if (elid != null && elid != '') {
      if (document.getElementById(targetid).classList.contains('hide')) {
        document.getElementById(targetid).classList.remove('hide');
      }
      else {
        document.getElementById(targetid).classList.add('hide');
      }
    }
  }

  /* =================================================================================================== */
  /* =================================================================================================== */
  updateSlotSelected(data) {
    /* slot checked */
    if (data.status) {
      this.slotIdArr.push(data.inst_acad_year_id);
      this.selectedSlots.push(data.inst_acad_year);
      if (this.selectedSlots.length != 0) {
        document.getElementById('slotwrapper').classList.add('has-value');
      }
      else {
        document.getElementById('slotwrapper').classList.remove('has-value');
      }
      this.selectedSlotsID = this.slotIdArr.join(',')
      this.selectedSlotsString = this.selectedSlots.join(',');
    }
    /* slot unchecked */
    else {
      if (this.selectedSlots.length < 0) {
        document.getElementById('slotwrapper').classList.add('has-value');
      }
      else if (this.selectedSlots.length == 0) {
        document.getElementById('slotwrapper').classList.remove('has-value');
      }
      else if (this.selectedSlots.length == 1) {
        document.getElementById('slotwrapper').classList.remove('has-value');
      }
      var index = this.selectedSlots.indexOf(data.inst_acad_year);
      if (index > -1) {
        this.selectedSlots.splice(index, 1);
      }
      this.selectedSlotsString = this.selectedSlots.join(',');
      var index2 = this.slotIdArr.indexOf(data.inst_acad_year_id);
      if (index2 > -1) {
        this.slotIdArr.splice(index, 1);
      }
      this.selectedSlotsID = this.slotIdArr.join(',');
    }

  }


  setDefaultValues() {
    this.tableSetting.keys = [{ primaryKey: 'title', header: 'Product Name', priority: 1, allowSortingFlag: true },
    { primaryKey: 'valid_from_date', header: 'Start Date', priority: 2, allowSortingFlag: true },
    { primaryKey: 'valid_to_date', header: 'End Date', priority: 3, allowSortingFlag: true },
    { primaryKey: 'publish_date', header: 'Publish Date', priority: 4, amountValue: true, allowSortingFlag: true }
    ];
    this.displayKeys = this.tableSetting.keys;
    this._tablePreferencesService.setTablePreferences(this.tableSetting.tableDetails.key, this.displayKeys);
  }

  getColumns() {
    let arr2 = [];
    let arr3 = [];
    this.tableSetting.keys.map((ele) => {
      arr2.push(ele.header);
    })
    arr3.push(arr2);
    return arr3;
  }

  getRows() {
    let obj = {}
    let arr = [];
    this.tableSetting.keys.map((ele, index) => {
      obj[ele.primaryKey] = index
    })
    this.salesDataSource.map(
      (ele) => {
        let json2 = []
        for (let i in obj) {
          json2.push(ele[i])
        }
        arr.push(json2);
      }
    )
    return arr;
  }

  exportToPdf() {
    let rows = this.getColumns();
    let columns = this.getRows();
    this.pdf.exportToPdf(rows, columns, 'All_dues_Report');
  }

  fetchSalesReportDetails() {
    console.log('sales Details');
  }

  openPreferences($event) {
    this.showPopupKeys.showPreference = !this.showPopupKeys.showPreference;
  }


  closePopup(e) {
    this.openPreferences(false);
    if (e) {
      if (this._tablePreferencesService.getTablePreferences(this.tableSetting.tableDetails.key) != null) {
        this.displayKeys = this._tablePreferencesService.getTablePreferences(this.tableSetting.tableDetails.key);
        this.tableSetting.keys = this.displayKeys;
        if (e.callNotify) {
          this.child.notifyMe(this.tableSetting);
        }
        this.ref.markForCheck();
        this.ref.detectChanges();
      }
    }
    console.log(this.displayKeys);
  }

}
