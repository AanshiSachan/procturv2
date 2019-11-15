
import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import 'rxjs/Rx';
import * as moment from 'moment';
import { document } from 'ngx-bootstrap-custome/utils/facade/browser';
import { MessageShowService } from '../../../../services/message-show.service';
import { getSMSService } from '../../../../services/report-services/get-sms.service';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { ExportToPdfService } from '../../../../services/export-to-pdf.service';
import { ExcelService } from '../../../../services/excel.service';
import { DataDisplayTableComponent } from '../../../shared/data-display-table/data-display-table.component';

@Component({
  selector: 'app-transctional-sms',
  templateUrl: './transctional-sms.component.html',
  styleUrls: ['./transctional-sms.component.scss']
})
export class TransctionalSmsComponent implements OnInit {

  @ViewChild('child') private child: DataDisplayTableComponent;
  busy: Subscription;
  projectSettings: any[] = [
    { primaryKey: 'name', header: 'Name', priority: 1, allowSortingFlag: true },
    { primaryKey: 'phone', header: 'Contact No.', priority: 2, allowSortingFlag: true },
    { primaryKey: 'message', header: 'Message', priority: 3, allowSortingFlag: true },
    { primaryKey: 'sentDateTime', header: 'Sent Date-Time', priority: 4, allowSortingFlag: true },
    { primaryKey: 'role', header: 'Role', priority: 5, allowSortingFlag: true },
    { primaryKey: 'sms_type', header: 'Type', priority: 6, allowSortingFlag: true },
    { primaryKey: 'func_type', header: 'Event', priority: 7, allowSortingFlag: true },
    { primaryKey: 'sentStatus', header: 'Status', priority: 8, allowSortingFlag: true }
  ];
  sizeArr: any[] = [25, 50, 100, 150, 200, 500, 1000];
  smsSource: any[] = [];
  searchData = [];
  currentDirection = 'desc';
  searchText = "";
  PageIndex: number = 1;
  maxPageSize: number = 0;
  totalRecords: number = 0;
  perPage: number = 10;
  isProfessional: boolean = false;
  searchflag: boolean = false;
  dataStatus: boolean = true;
  isRippleLoad: boolean = false;
  smsFetchForm: any = {
    institution_id: parseInt(sessionStorage.getItem('institute_id')),
    from_date: moment(new Date()).format('YYYY-MM-DD'),
    to_date: moment(new Date()).format('YYYY-MM-DD'),
    start_index: '-1',
    batch_size: '-1',
    sorted_by: "",
    order_by: "",
  }

  constructor(
    private _msgService: MessageShowService,
    private getSms: getSMSService,
    private auth: AuthenticatorService,
    private _excelService: ExcelService,
    private _pdfService: ExportToPdfService, ) {
    this.switchActiveView('sms');
  }

  tableSetting: any = {//inventory.item
    tableDetails: { title: 'Lead SMS Report', key: 'reports.fee.LeadSMSReport', showTitle: false },
    search: { title: 'Search', showSearch: false },
    defaultSort: { primaryKey: 'sentDateTime', sortingType: 'desc', header: 'Sent Date-Time', priority: 4, allowSortingFlag: true },
    keys: this.projectSettings,
    selectAll: { showSelectAll: false, option: 'single', title: 'Send Due SMS', checked: true, key: 'name' },
    actionSetting:
    {
      showActionButton: false,
      editOption: '',//or button 
      // options: this.menuOptions
    },
    displayMessage: "Enter Detail to Search"
  };

  ngOnInit() {
    this.auth.institute_type.subscribe(
      res => {
        if (res == 'LANG') {
          this.isProfessional = true;
        } else {
          this.isProfessional = false;
        }
      }
    )
    this.getSmsReport(this.smsFetchForm);
  }

  getSmsReport(obj) {
    this.isRippleLoad = true;
    this.dataStatus = true;
    if (obj.start_index == 0) {
      return this.getSms.fetchSmsReport(obj).subscribe(
        (res: any) => {
          this.isRippleLoad = false;
          if (res.length != 0) {
            this.smsSource = res;
            this.totalRecords = res[0].totalCount;
          }
          else {
            this.smsSource = [];
            this.dataStatus = false;
            this.totalRecords = 0;
          }
        },
        err => {
          this.isRippleLoad = false;
        }
      )
    }
    else {
      return this.getSms.fetchSmsReport(obj).subscribe(
        (res: any) => {
          this.isRippleLoad = false;
          this.smsSource = res;
        }
      )
    }
  }

  switchActiveView(id) {
    let classArray = ['home', 'attendance', 'sms', 'fee', 'exam', 'report', 'time', 'email', 'profit'];

    classArray.forEach((classname) => {
      document.getElementById(classname) && document.getElementById(classname).classList.remove('active');
    });
    document.getElementById(id) && document.getElementById(id).classList.add('active');
  }

  fetchSmsByDate() {
    this.getSmsReport(this.smsFetchForm);
  }

  getMin(): number {
    return ((this.perPage * this.PageIndex) - this.perPage) + 1;
  }

  getMax(): number {
    let max = this.perPage * this.PageIndex;
    if (max > this.totalRecords) {
      max = this.totalRecords;
    }
    return max;
  }

  searchDatabase() {
    if (this.searchText != "" && this.searchText != null) {
      let searchData: any;
      searchData = this.smsSource.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchText.toLowerCase()))
      );
      this.smsSource = searchData;
      this.searchflag = true;

    }
    else {
      this.getSms.fetchSmsReport(this.smsFetchForm).subscribe(
        (res: any) => {
          this.smsSource = res;
          this.searchflag = false;
        }
      )
    }
  }

  /** this function is used to download execel
   * written by laxmi 
  */
  exportToExcel() {
    let exportedArray: any[] = [];
    this.smsSource.map((data: any) => {
      let obj = {};
      obj["Name"] = data.name;
      obj["Contact No."] = data.phone;
      obj["Message"] = data.message;
      obj["Sent Date-Time"] = data.sentDateTime;
      obj["Role"] = data.role;
      obj["Type"] = data.sms_type;
      obj["Event"] = data.func_type;
      obj["Status"] = data.sentStatus;
      exportedArray.push(obj);
    })
    this._excelService.exportAsExcelFile(
      exportedArray,
      'SMS'
    )
  }

  /** this function is used to download pdf
   * written by laxmi 
  */
  exportToPdf() {
    let arr = [];
    this.smsSource.map(
      (ele: any) => {
        let json = [
          ele.name,
          ele.phone,
          ele.message,
          ele.sentDateTime,
          ele.role,
          ele.sms_type,
          ele.func_type,
          ele.sentStatus,
        ]
        arr.push(json);
      })

    let rows = [];
    rows = [['Name', "Contact No.", "Message", 'Sent Date-Time', 'Role', 'Type', 'Event', 'Status']]
    let columns = arr;
    this._pdfService.exportToPdf(rows, columns, 'SMS');
  }


  dateValidationForFuture(e) {
    //console.log(e);
    let today = moment(new Date);
    let selected = moment(e);
    let diff = moment(selected.diff(today))['_i'];
    if (diff <= 0) {

    }
    else {
      this.smsFetchForm.to_date = moment(new Date).format('YYYY-MM-DD');
      this.smsFetchForm.from_date = moment(new Date).format('YYYY-MM-DD');
      this._msgService.showErrorMessage(this._msgService.toastTypes.info, '', "Future date is not allowed");
    }
  }
}