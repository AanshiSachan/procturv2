
import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import 'rxjs/Rx';
import * as moment from 'moment';
import { document } from 'ngx-bootstrap-custome/utils/facade/browser';
import { MessageShowService } from '../../../../services/message-show.service';
import { getSMSService } from '../../../../services/report-services/get-sms.service';
import { ExportToPdfService } from '../../../../services/export-to-pdf.service';
import { ExcelService } from '../../../../services/excel.service';
import { DataDisplayTableComponent } from '../../../shared/data-display-table/data-display-table.component';
import { Router } from '../../../../../../node_modules/@angular/router';

/**
  * written by laxmi 
 */
@Component({
  selector: 'app-compaign-sms',
  templateUrl: './compaign-sms.component.html',
  styleUrls: ['./compaign-sms.component.scss']
})
export class CompaignSmsComponent implements OnInit {

  @ViewChild('child') private child: DataDisplayTableComponent;
  busy: Subscription;
  projectSettings: any[] = [
    { primaryKey: 'campaign_list_name', header: 'List Name', priority: 1, allowSortingFlag: true },
    { primaryKey: 'message', header: 'Message', priority: 2, allowSortingFlag: true },
    { primaryKey: 'date', header: 'Schedule Date Time', priority: 3, allowSortingFlag: true },
    { primaryKey: 'running_date', header: 'Craeted Date', priority: 4, allowSortingFlag: true },
    { primaryKey: 'statusValue', header: 'Status', priority: 5, allowSortingFlag: true }
  ];

  smsSource: any[] = [];
  searchData = [];
  searchText = "";
  totalRecords: number = 0;
  searchflag: boolean = false;
  dataStatus: boolean = true;
  isRippleLoad: boolean = false;

  tableSetting: any = {//inventory.item
    tableDetails: { title: 'Campaign SMS Report', key: 'reports.fee.campaignReport', showTitle: false },
    search: { title: 'Search', showSearch: false },
    keys: this.projectSettings,
    selectAll: { showSelectAll: false, title: 'Send Due SMS', checked: true, key: 'name' },
    actionSetting:
    {
      showActionButton: true,
      editOption: 'icon',//or button 
      options: [{viewName:'delete',key:'statusValue',condition:'==',value:'Pending'},
      {viewName:'view',key:'statusValue',condition:'==',value:'Completed'} ]
    },
    displayMessage: "Campaign details does not exist"
  };

  constructor(
    private _msgService: MessageShowService,
    private getSms: getSMSService,
    private _excelService: ExcelService,
    private _pdfService: ExportToPdfService,
    private router: Router, ) {
    this.switchActiveView('sms');
  }

  ngOnInit() {
    this.fetchCampainSMSReport();
  }


  fetchCampainSMSReport() {
    this.isRippleLoad = true;
    return this.getSms.fetchCampainSMSReport().subscribe(
      (res: any) => {
        this.isRippleLoad = false;
        this.smsSource = res;
      },
      err => {
        this.isRippleLoad = false;
      }
    )
  }

  deleteCampainSMS(obj) {
    this.isRippleLoad = true;

    return this.getSms.deleteCampaign(obj.campaign_list_message_id).subscribe(
      (res: any) => {
        this.isRippleLoad = false;
       this._msgService.showErrorMessage('success','','campaign deleted successfully');
      },
      err => {
        this._msgService.showErrorMessage('error','','error while deleting campaign');
        this.isRippleLoad = false;
      }
    )
  }

  switchActiveView(id) {
    let classArray = ['home', 'attendance', 'sms', 'fee', 'exam', 'report', 'time', 'email', 'profit'];

    classArray.forEach((classname) => {
      document.getElementById(classname).classList.remove('active');
    });
    document.getElementById(id).classList.add('active');
  }


  optionSelected($event) {
    console.log($event)
    switch ($event.type) {
      case "delete": {
      if (confirm('Are you sure, you want to delete?')) {
        this.deleteCampainSMS($event.data);
        this.fetchCampainSMSReport();
      }
        break;
      }
      case "view": {        
        this.router.navigate(['/view/reports/sms/compaign/' + $event.data.campaign_list_message_id],{ queryParams: { data: JSON.stringify($event.data)}});
        break;
      }
    }
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
      this.fetchCampainSMSReport();
    }
  }

  /** this function is used to download execel
   * written by laxmi 
  */
  exportToExcel() {
    let exportedArray: any[] = [];
    this.smsSource.map((data: any) => {
      let obj = {};
      obj["List Name"] = data.campaign_list_name;
      obj["Message"] = data.message;
      obj["Schedule Date Time"] = data.date;
      obj["Craeted Date"] = data.running_date;
      obj["Status"] = data.statusValue;
      exportedArray.push(obj);
    })
    this._excelService.exportAsExcelFile(
      exportedArray,
      'Campaign_SMS'
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
          ele.campaign_list_name,
          ele.message,
          ele.date,
          ele.running_date,
          ele.statusValue,
        ]
        arr.push(json);
      })

    let rows = [];
    rows = [['List Name', "Message", 'Schedule Date Time', 'Craeted Date', 'Status']]
    let columns = arr;
    this._pdfService.exportToPdf(rows, columns, 'SMS');
  }



}