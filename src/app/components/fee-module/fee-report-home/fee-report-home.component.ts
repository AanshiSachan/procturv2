import { Component, OnInit } from '@angular/core';
import { role } from '../../../model/role_features';
import { AuthenticatorService } from '../../../services/authenticator.service';

@Component({
  selector: 'fee-module-home',
  templateUrl: './fee-report-home.component.html',
  styleUrls: ['./fee-report-home.component.scss']
})
export class FeeReportHomeComponent implements OnInit {

  enable_online_payment: string = "";
  enable_online_payment_feature: number;
  showChart: boolean = false;
  jsonFlags = {
    moduleState: '',
    isFeeManageCheque: false,
    isAdmin: false,
    isProfitnloss: false,
    isFeeDues: false,
    isPaymentHistory: false,
    isCourseWise: false,
    isGstReport: false,
    isMonitoringDash: false,
    isOnlineFees: false
  }
  tax_type_without_percentage: String;
  is_tax_enabled: any;
  role_feature = role.features;
  constructor(private auth: AuthenticatorService) { }

  ngOnInit() {

    const userType = sessionStorage.getItem('userType');
    this.enable_online_payment = sessionStorage.getItem('enable_online_payment_feature');
    this.tax_type_without_percentage = sessionStorage.getItem('tax_type_without_percentage');
    this.is_tax_enabled = sessionStorage.getItem('enable_tax_applicable_fee_installments');
    if (userType == '3') {
      this.jsonFlags.isAdmin = false;
      this.jsonFlags.isProfitnloss = false;
    }
    else if (userType == '0') {
      if (sessionStorage.getItem('permissions') == "" || sessionStorage.getItem('permissions') == null) {
        // Changes done by Nalini - To handle role based conditions
        let array = Object.keys(this.jsonFlags);
        array.forEach((flag) => {
        this.jsonFlags[flag] = true;
      });
      }
    }
    if (sessionStorage.getItem('permissions')) {
      let permissions = JSON.parse(sessionStorage.getItem('permissions'));
      if (this.role_feature.FEE_CHEQUE_MANAGE) { //update payment and manage cheque,pdc  hide download
        this.showChart = false;
      }
      if (this.role_feature.FEE_MENU) {
        this.showChart = true;
      }
      // Changes done by Nalini - To handle role based conditions
      this.jsonFlags.isFeeManageCheque = this.role_feature.FEE_CHEQUE_MANAGE;
     this.jsonFlags.isFeeDues = this.role_feature.FEE_DUE_DETAILS;
      this.jsonFlags.isPaymentHistory = this.role_feature.FEE_PAYMENT_HISTORY;
      this.jsonFlags.isCourseWise = this.role_feature.REPORT_ENQUIRY_COURSE_WISE;
      this.jsonFlags.isMonitoringDash = this.role_feature.REPORT_FEE_MONITORING_DASHBOARD;
      this.jsonFlags.isGstReport = this.role_feature.REPORT_FEE_GST_REPORT;
      this.jsonFlags.isOnlineFees = this.role_feature.REPORT_FEES_ONLINE_FEES;

    }

    if (sessionStorage.getItem('userType') == '0') {
      if (sessionStorage.getItem('permissions') == undefined || sessionStorage.getItem('permissions') == '') {
        this.jsonFlags.isFeeManageCheque = true;
        this.jsonFlags.isProfitnloss = true;

      }
    }
    if (sessionStorage.getItem('permissions') == undefined || sessionStorage.getItem('permissions') == ''
      || sessionStorage.getItem('username') == 'admin') {
      this.showChart = true;
    }

    this.auth.institute_type.subscribe(
      res => {
        if (res == 'LANG') { ///batch 
          this.jsonFlags.moduleState = 'Batch';
        } else { ///course
          this.jsonFlags.moduleState = 'Course';
        }
      }
    )
  }

}
