import {
  Component, OnInit, ViewChild, Input, Output, EventEmitter, HostListener,
  AfterViewInit, OnDestroy, ElementRef, Renderer2, ChangeDetectionStrategy, ChangeDetectorRef,
  SimpleChanges, OnChanges
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs';
import 'rxjs/Rx';
import { AppComponent } from '../../../app.component';
import * as moment from 'moment';
import { MenuItem } from 'primeng/primeng';
import { Pipe, PipeTransform } from '@angular/core';
import { LoginService } from '../../../services/login-services/login.service';
import { document } from '../../../../assets/imported_modules/ngx-bootstrap/utils/facade/browser';
import { ColumnSetting } from '../../shared/custom-table/layout.model';
import { getSMSService } from '../../../services/report-services/get-sms.service';
import { postSMSService } from '../../../services/report-services/post-sms.service';

@Component({
  selector: 'app-sms-report',
  templateUrl: './sms-report.component.html',
  styleUrls: ['./sms-report.component.scss']
})
export class SmsReportComponent implements OnInit {

  isProfessional: boolean = false;
  smsSource: any[] = [];
  sizeArr: any[] = [25, 50, 100, 150, 200, 500, 1000];
  displayBatchSize: number = 1000;
  PageIndex: number = 1;
  maxPageSize: number = 0; 
  totalRecords: number = 0;
  currentDirection = 'desc';
  busy: Subscription;
  perPage:number = 10;



  projectSettings: ColumnSetting[] = [
    { primaryKey: 'name', header: 'Name' },
    { primaryKey: 'phone', header: 'Contact No.' },
    { primaryKey: 'message', header: 'Message' },
    { primaryKey: 'sentDateTime', header: 'Sent Date' },
    { primaryKey: 'sms_type', header: 'Type' },
    { primaryKey: 'func_type', header: 'Event' },
    { primaryKey: 'sentStatus', header: 'Status' }
  ];

  smsFetchForm: any = {
    institution_id: parseInt(sessionStorage.getItem('institute_id')),
    from_date: moment().format('YYYY-MM-DD'),
    to_date: moment().format('YYYY-MM-DD'),
    start_index: 0,
    batch_size: this.displayBatchSize,
    sorted_by: "",
    order_by: "",
  }

  constructor(private router: Router, private appC: AppComponent, private login: LoginService, private cd: ChangeDetectorRef,
    private getSms: getSMSService, private postSms: postSMSService) {
    this.switchActiveView('sms');
  }


  
  ngOnInit() {
    this.isProfessional = sessionStorage.getItem('institute_type') == 'LANG';
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));
     this.getSmsReport(this.smsFetchForm);
  }




  getSmsReport(obj) {

    if(obj.start_index == 0){
      return this.getSms.fetchSmsReport(obj).subscribe(
        res => {
          if(res.length != 0){
            this.smsSource = res;
            this.totalRecords = res[0].totalCount;
          }
          else{
            this.smsSource = [];
            this.totalRecords = 0;
          }
        }
      )
    }
    else{
      return this.getSms.fetchSmsReport(obj).subscribe(
        res => {
          this.smsSource = res;
        }
      )
    }
  }
 


  /* Customiized click detection strategy */
  inputClicked(ev) {
    if (ev.target.classList.contains('form-ctrl')) {
      if (ev.target.classList.contains('bsDatepicker')) {
        var nodelist = document.querySelectorAll('.bsDatepicker');
        [].forEach.call(nodelist, (elm) => {
          elm.addEventListener('focusout', function (event) {
            event.target.parentNode.classList.add('has-value');
          });
        });
      }
      else if ((ev.target.classList.contains('form-ctrl')) && !(ev.target.classList.contains('bsDatepicker'))) {
        //document.getElementById(ev.target.id).click();
        ev.target.addEventListener('blur', function (event) {
          if (event.target.value != '') {
            event.target.parentNode.classList.add('has-value');
          } else {
            event.target.parentNode.classList.remove('has-value');
          }
        });
      }
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
    switch (id) {
      case 'home': { document.getElementById('home').classList.add('active'); break; }
      case 'attendance': { document.getElementById('attendance').classList.add('active'); break; }
      case 'sms': { document.getElementById('sms').classList.add('active'); break; }
      case 'fee': { document.getElementById('fee').classList.add('active'); break; }
      case 'exam': { document.getElementById('exam').classList.add('active'); break; }
      case 'report': { document.getElementById('report').classList.add('active'); break; }
      case 'time': { document.getElementById('time').classList.add('active'); break; }
      case 'email': { document.getElementById('email').classList.add('active'); break; }
      case 'profit': { document.getElementById('profit').classList.add('active'); break; }
    }

  }



  fetchSmsByDate() {
    this.getSmsReport(this.smsFetchForm);
  }




  fectchTableDataByPage() {

  }




  fetchNext() {

  }



  fetchPrevious() {

  }




  getMin(): number {
    return ((this.perPage * this.PageIndex) - this.perPage) + 1;
  }





  getMax(): number {
    let max = this.perPage * this.PageIndex;
    if (max > this.totalRecords) {
      max = this.totalRecords;
    }
    return max;
  }




}
