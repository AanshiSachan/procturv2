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
    isFeeActivity: false,
    isAdmin: false,
    isProfitnloss: false,
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
        this.jsonFlags.isAdmin = true;
        this.jsonFlags.isProfitnloss = true;
      }
    }
    if (sessionStorage.getItem('permissions')) {
      let permissions = JSON.parse(sessionStorage.getItem('permissions'));
      if (this.role_feature.FEE_CHEQUE_MANAGE) { //update payment and manage cheque,pdc  hide download
        this.showChart = false;
      }
      if (this.role_feature.FEE_MANAGE || this.role_feature.FEE_MENU) {
        this.showChart = true;
      }
      if (this.role_feature.FEE_CHEQUE_MANAGE) {
        this.jsonFlags.isFeeActivity = true;
      }

    }

    if (sessionStorage.getItem('userType') == '0') {
      if (sessionStorage.getItem('permissions') == undefined || sessionStorage.getItem('permissions') == '') {
        this.jsonFlags.isFeeActivity = true;
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
