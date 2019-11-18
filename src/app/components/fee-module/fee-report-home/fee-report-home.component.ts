import { Component, OnInit } from '@angular/core';
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

  constructor(private auth: AuthenticatorService) { }

  ngOnInit() {

    const userType = sessionStorage.getItem('userType');
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
      if (permissions.includes('714')) { //update payment and manage cheque,pdc  hide download
        this.showChart = false;
      }
      if (permissions.includes('709')) {
        this.showChart = true;
      }
      if (permissions.indexOf('102') != -1) {
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
    let perm: any[] = JSON.parse(sessionStorage.getItem('permissions'));
      /* profit and lodd */
      if (perm.indexOf('208') != -1) {
        this.jsonFlags.isProfitnloss = true;
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
    this.enable_online_payment = JSON.parse(sessionStorage.getItem('institute_info')).enable_online_payment_feature
  }

}
