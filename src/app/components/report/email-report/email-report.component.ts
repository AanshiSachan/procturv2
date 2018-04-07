import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../../../app.component';
import { LoginService } from '../../../services/login-services/login.service';
import { document } from '../../../../assets/imported_modules/ngx-bootstrap/utils/facade/browser';
import { ColumnSetting } from '../../shared/custom-table/layout.model';
import { getEmailService } from '../../../services/report-services/get-email.service';
import * as moment from 'moment';
@Component({
  selector: 'app-email-report',
  templateUrl: './email-report.component.html',
  styleUrls: ['./email-report.component.scss']
})
export class EmailReportComponent {
  email_data: any;
  email_fromDate:string= "";
  email_toDate:string= "";

  isProfessional: boolean = false;
  emailSource: any[] = [];
  
  projectSettings: ColumnSetting[] = [
    { primaryKey: 'sentDateTime', header: 'Sent Date' },
    { primaryKey: 'emailId', header: 'Email' },
    { primaryKey: 'subject', header: 'Subject' },
    { primaryKey: 'name', header: 'Name' },
    { primaryKey: 'role', header: 'Role' },
    { primaryKey: 'sms_type', header: 'Type' }
  ];
                  
   
    emailFetchForm: any = {
    institution_id: parseInt(sessionStorage.getItem('institute_id')),
    from_date: moment('01 March 2018').format('YYYY-MM-DD'),
    to_date: moment('30 March 2018').format('YYYY-MM-DD')

  }

  constructor(
    private fetchApiService: getEmailService, 
    private login: LoginService ,private appC :AppComponent) {
    this.switchActiveView('email');
  }

  ngOnInit() {
    this.getAllEmailMessages();
  }

  getAllEmailMessages() {
    this.emailSource = [];
    this.fetchApiService.getEmailMessages(this.emailFetchForm).subscribe(
      res => {
        this.emailSource = res;
        console.log(res);
      },
      err => {
        console.log(err);
      }
    )
  }

  isTimeValid():boolean{
   let v= moment(this.email_fromDate).diff(moment(this.email_toDate))
   
    if(v<=0){
      return true;
    }
  else{
    return false;
  }
  }


  fetchemailByDate(){
    if(this.isTimeValid()){
      let email_value={
       institution_id : parseInt(sessionStorage.getItem('institute_id')),
       from_date: moment(this.email_fromDate).format('YYYY-MM-DD'),
       to_date: moment(this.email_toDate).format('YYYY-MM-DD')

      }
       this.fetchApiService.getEmailMessages(email_value)
       .subscribe((store)=>console.log(store));
 
    }
    else{
      let obj={
        type:"error",
        title:"Invalid Date Range Selected",
        Body: "From date cannot be greater than To date"
       }
   this.appC.popToast(obj);

    }
  }

switchActiveView(id) {
    document.getElementById('home').classList.remove('active');
    document.getElementById('attendance').classList.remove('active');
    document.getElementById('sms').classList.remove('active');
    document.getElementById('fee').classList.remove('active');
    document.getElementById('exam').classList.remove('active');
    document.getElementById('report').classList.remove('active');
    document.getElementById('time').classList.remove('active');
    document.getElementById('email').classList.remove('active');
    document.getElementById('profit').classList.remove('active');
    document.getElementById('email').classList.add('active');
  }}
