import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { role } from '../../../model/role_features';
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
    isShowCampaignReport: false,
    isShowAddCampaign: false,
    isShowAddEnquiry: false,
    isShowReport: false
  }

  enquiryStatus: any[] = [];
  totalEnquiryCount: number;
  role_feature = role.features;

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
    this.fetchenquiry();
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
      if (this.role_feature.LEAD_MANAGE_ENQUIRY) {
        this.jsonRolesFlags.isShowManageEnquiry = true;
        this.jsonRolesFlags.isShowAddEnquiry = true;
      }
      // enquiry  admin --115
      // if (this.role_feature.LEAD_ADD_CAMPAIGN) {
      //   this.jsonRolesFlags.isShowAddCampaign = true;
      // }
      if(this.role_feature.LEAD_MANAGE_CAMPAIGN) {
        this.jsonRolesFlags.isShowCampaign = true;
      }
      if(this.role_feature.REPORTS_ENQUIRY_CAMPAIGN) {
        this.jsonRolesFlags.isShowCampaignReport = true;
      }
      // enquiry  report --722
      if (this.role_feature.REPORTS_ENQUIRY_REFFER_BY 
        || this.role_feature.REPORTS_ENQUIRY_SOURCE || this.role_feature.REPORT_ENQUIRY_COUNSELLOR) {
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
