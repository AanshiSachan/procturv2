import { Component, OnInit } from '@angular/core';
import { AuthenticatorService } from '../../../services/authenticator.service';

@Component({
  selector: 'app-fee-report-home',
  templateUrl: './fee-report-home.component.html',
  styleUrls: ['./fee-report-home.component.scss']
})
export class FeeReportHomeComponent implements OnInit {

  enable_online_payment: string = "";
  enable_online_payment_feature: number;
  showChart: boolean = false;
  jsonFlags = {
    moduleState:'',
    isFeeActivity: false,
  }

  constructor(private auth: AuthenticatorService) { }

  ngOnInit() {
   
    if (sessionStorage.getItem('permissions')) {    
      let permissions = JSON.parse(sessionStorage.getItem('permissions'))  ;
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
        
      }
    }
    if (sessionStorage.getItem('permissions') == undefined || sessionStorage.getItem('permissions') == ''
      || sessionStorage.getItem('username') == 'admin') {
      this.showChart = true;
    }

    this.auth.institute_type.subscribe(
      res => {
        if (res == 'LANG') { ///batch 
          this.jsonFlags.moduleState ='Batch';
        } else { ///course
          this.jsonFlags.moduleState ='Course';
        }
      }
    )
    this.enable_online_payment = JSON.parse(sessionStorage.getItem('institute_info')).enable_online_payment_feature
  }

}
