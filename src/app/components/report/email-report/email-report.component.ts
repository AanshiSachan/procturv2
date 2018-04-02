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
export class EmailReportComponent implements OnInit {
  email_data: any;

  isProfessional: boolean = false;
  smsSource: any[] = [];
  



  projectSettings: ColumnSetting[] = [
    { primaryKey: 'em_name', header: 'Name' },
    { primaryKey: 'em_phone', header: 'Contact No.' },
    { primaryKey: 'em_Email', header: 'Email' },
    { primaryKey: 'em_sentDateTime', header: 'Sent Date' },
    { primaryKey: 'em_Email_type', header: 'Type' },
    { primaryKey: 'em_func_type', header: 'Event' },
    { primaryKey: 'em_sentStatus', header: 'Name' }
  ];
                  

  emailFetchForm: any = {
    institution_id: parseInt(sessionStorage.getItem('institute_id')),
    from_date: moment().format('YYYY-MM-DD'),
    to_date: moment().format('YYYY-MM-DD')
  }

  constructor(
    private fetchApiService: getEmailService,
    private login: LoginService) {
    this.switchActiveView('email');
  }

  ngOnInit() {
    this.getAllEmailMessages();
  }

  getAllEmailMessages() {
    this.fetchApiService.getEmailMessages(this.emailFetchForm).subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.log(err);
      }
    )
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
