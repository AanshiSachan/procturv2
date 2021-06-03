import { Component, OnInit } from '@angular/core';
import { AuthenticatorService } from '../../../app/services/authenticator.service';
import { role } from '../../model/role_features';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  facultyAccount: boolean = false;
  isShowEnqReport: boolean = false;
  isShowCampaignReport: boolean = false;
  role_feature = role.features;
  isCourseWise: boolean = false;
  isFeeDues: boolean = false;
  is_tax_enabled: any;
  isGstReport: boolean = false;
  isOnlineFees: boolean = false;
  enable_online_payment: any;
  showSMSReport: boolean = false;
  showEmailReport: boolean = false;
  isShowExpense: any = false;
  schoolModel: any = false;
  JsonFlags = {
    biometricAttendanceEnable: false,
    isShowAttendanceReport: false,
    isShowExamReport: false,
    isShowExamDash: false,
    showBiomentricR: false

  }
  jsonEstoreFlags = {
    isEstoreMenu: false,
    isSalesReport: false,
    isCouponReport: false
  }

  constructor(
    private auth: AuthenticatorService
  ) { 
    this.auth.schoolModel.subscribe(
      res => {
        this.schoolModel = false;
        if (res) {
          this.schoolModel = true;
        }
      }
    )
  }

  ngOnInit(): void {
    if (sessionStorage.getItem('userType') == '3') {
      this.facultyAccount = true;
    }
    this.checkRoleAccess();
    this.fetchAndUpdatePermissions();
    this.is_tax_enabled = sessionStorage.getItem('enable_tax_applicable_fee_installments');
    this.enable_online_payment = sessionStorage.getItem('enable_online_payment_feature');
    this.isShowExpense = sessionStorage.getItem('isShowExpense');
  }

  checkRoleAccess() {
    if (this.role_feature.REPORTS_ENQUIRY_REFFER_BY
      || this.role_feature.REPORTS_ENQUIRY_SOURCE || this.role_feature.REPORT_ENQUIRY_COUNSELLOR) {
      this.isShowEnqReport = true;
    }
    this.isShowCampaignReport = this.role_feature.REPORTS_ENQUIRY_CAMPAIGN;
    // Changes done by Nalini - To handle role based fee menu conditions
    this.isFeeDues = this.role_feature.FEE_DUE_DETAILS;
    this.isCourseWise = this.role_feature.REPORT_ENQUIRY_COURSE_WISE;
    this.isGstReport = this.role_feature.REPORT_FEE_GST_REPORT;
    this.isOnlineFees = this.role_feature.REPORT_FEES_ONLINE_FEES;
  }

  fetchAndUpdatePermissions() {
    let permissions = sessionStorage.getItem('permissions');

    /* Admin Account Detected */
    if (permissions == '' || permissions == null || permissions == undefined) {
      if (sessionStorage.getItem('userType') == '0') {
        this.JsonFlags.isShowExamReport = true;
        this.JsonFlags.isShowAttendanceReport = true;
        // Changes done by Nalini - To handle role based conditions
        this.JsonFlags.isShowExamDash = true;
        this.JsonFlags.showBiomentricR = true;
        this.showSMSReport = true;
        this.isShowEnqReport = true;
        this.showEmailReport = true;
        this.isFeeDues = true;
        this.isCourseWise = true;
        this.isGstReport = true;
        this.isOnlineFees = true;
        this.isShowCampaignReport = true;
        if (sessionStorage.getItem('enable_eLearn_feature') == '1') {
          this.jsonEstoreFlags.isEstoreMenu = true;
          this.jsonEstoreFlags.isSalesReport = true;
          this.jsonEstoreFlags.isCouponReport = true;
        }
      }
      else if (sessionStorage.getItem('userType') == '3') { // reaport 
        this.JsonFlags.isShowExamReport = true;
        this.JsonFlags.isShowAttendanceReport = true;
        this.JsonFlags.isShowExamDash = true;
        this.JsonFlags.showBiomentricR = true;
      }
    }
    else {
      /* attendance */
      // Changes done by Nalini - To handle role based conditions
      this.JsonFlags.isShowAttendanceReport = this.role_feature.REPORT_COURSE_ATTENDANCE;

      if (this.role_feature.REPORTS_MENU && this.role_feature.REPORT_COURSE_EXAM_R) {
        this.JsonFlags.isShowExamReport = true;
      }
      if (this.role_feature.REPORTS_MENU && this.role_feature.REPORT_COURSE_EXAM_DASHBOARD) {
        this.JsonFlags.isShowExamDash = true;
      }
      this.JsonFlags.showBiomentricR = this.role_feature.REPORT_COURSE_BIOMETRIC;
      this.showSMSReport = (this.role_feature.REPORT_MISC_SMS) ? true : false;//sms visiblity
      this.showEmailReport = (this.role_feature.REPORTS_MISC_EMAIL) ? true : false; //email visiblity
      if (sessionStorage.getItem('enable_eLearn_feature') == '1') {
        this.jsonEstoreFlags.isEstoreMenu = this.role_feature.ESTORE_MENU;
        this.jsonEstoreFlags.isSalesReport = this.role_feature.REPORT_PRODUCT_SALES;
        this.jsonEstoreFlags.isCouponReport = this.role_feature.REPORT_PRODUCT_COUPON;
      }

    }
  }

  checkIfUserHadAccess(id) {
    let permissionArray = sessionStorage.getItem('permissions');
    if (permissionArray == "" || permissionArray == null || !permissionArray) {
      return true;
    } else {
      if (id) {
        return true;
      } else {
        return false;
      }
    }
  }

}
