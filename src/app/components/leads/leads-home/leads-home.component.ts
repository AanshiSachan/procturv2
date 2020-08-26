import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { FetchenquiryService } from '../../../services/enquiry-services/fetchenquiry.service';
import { FetchprefilldataService } from '../../../services/fetchprefilldata.service';

@Component({
  selector: 'app-leads-home',
  templateUrl: './leads-home.component.html',
  styleUrls: ['./leads-home.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeadsHomeComponent implements OnInit {

  enquiryDate: any[] = [];

  jsonFlag = {
    isProfessional: false
  };

  jsonRolesFlags = {
    isShowManageEnquiry: false,
    isShowDataSetup: false,
    isShowCampaign: false,
    isShowAddEnquiry: false,
    isShowReport: false
  }

  enquiryStatus: any[] = [];
  totalEnquiryCount: number;

  constructor(
    private router: Router,
    private cd: ChangeDetectorRef,
    private auth: AuthenticatorService,
    private enquire: FetchenquiryService,
    private prefill: FetchprefilldataService,
  ) {
    this.enquiryDate[0] = new Date(moment().date(1).format("YYYY-MM-DD"));
    this.enquiryDate[1] = new Date();
  }

  ngOnInit() {
    this.auth.institute_type.subscribe(
      res => {
        if (res == 'LANG') {
          this.jsonFlag.isProfessional = true;
        } else {
          this.jsonFlag.isProfessional = false;
        }
      }
    )
    this.checkpermissinDetails();
  }

  checkpermissinDetails() {
    let userType = sessionStorage.getItem('userType');
    let username = sessionStorage.getItem('username');
    let array = Object.keys(this.jsonRolesFlags);
    if (sessionStorage.getItem('permissions') == '' && userType == '0' && username == 'admin') {// user role is admin
      array.forEach((flag) => {
        this.jsonRolesFlags[flag] = true;
      });
    }
    else {
      array.forEach((flag) => {
        this.jsonRolesFlags[flag] = false;
      });
      // quick enquiry  --110
      if (JSON.parse(sessionStorage.getItem('permissions')).includes('110')) {
        this.jsonRolesFlags.isShowManageEnquiry = true;
        this.jsonRolesFlags.isShowAddEnquiry = true;
        this.jsonRolesFlags.isShowReport = true;
      }
      // enquiry  admin --115
      if (JSON.parse(sessionStorage.getItem('permissions')).includes('115')) {
        this.jsonRolesFlags.isShowCampaign = true;
        this.jsonRolesFlags.isShowManageEnquiry = true;
        this.jsonRolesFlags.isShowAddEnquiry = true;
      }
      // enquiry  report --722
      if (JSON.parse(sessionStorage.getItem('permissions')).includes('722')) {
        this.jsonRolesFlags.isShowReport = true;
      }

    }
  }

  fetchenquiry() {
    let obj = {
      updateDateFrom: moment().date(1).format("YYYY-MM-DD"),
      updateDateTo: moment().format("YYYY-MM-DD")
    }
    this.auth.showLoader();
    this.enquire.fetchEnquiryWidgetView(obj).subscribe(
      res => {
        let result: any;
        result = res;
        this.enquiryStatus = result.statusMap;
        this.totalEnquiryCount = result.totalcount;
        console.log(res)
        this.auth.hideLoader();
      },
      err => {
        this.auth.hideLoader();
      }
    );
  }

  getEnqStartDate() {
    this.cd.markForCheck();
    let date = moment().date(1).format("YYYY-MM-DD");
    return this.enquiryDate[0];
  }

  getEnqEndDate() {
    this.cd.markForCheck();
    return this.enquiryDate[1];
  }

  updateEnqChartByDate(e) {
    this.cd.markForCheck();
    let obj = {
      updateDateFrom: moment(e[0]).format("YYYY-MM-DD"),
      updateDateTo: moment(e[1]).format("YYYY-MM-DD")
    }
    this.auth.showLoader();
    this.enquire.fetchEnquiryWidgetView(obj).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.cd.markForCheck();
        let result: any;
        result = res;
        this.enquiryStatus = result.statusMap;
        this.totalEnquiryCount = result.totalcount;
      }
    )
  }

  openCalendar(id) {
    document.getElementById(id).click();
  }
}
