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

  projectSettings: ColumnSetting[] = [
    { primaryKey: 'name', header: 'Name' },
    { primaryKey: 'phone', header: 'Contact No.' },
    { primaryKey: 'message', header: 'Message' },
    { primaryKey: 'sentDateTime', header: 'Sent Date' },
    { primaryKey: 'sms_type', header: 'Type' },
    { primaryKey: 'func_type', header: 'Event' },
    /* { primaryKey: 'totalCount', header: 'Total' },
    { primaryKey: 'successCount', header: 'Success' }, */
    { primaryKey: 'sentStatus', header: 'Name' }
  ];

  smsFetchForm: any = {
    institution_id: sessionStorage.getItem('institute_id'),
    from_date: '',
    to_date: ''
  }

  constructor(private router: Router, private appC: AppComponent, private login: LoginService, private cd: ChangeDetectorRef,
  private getSms: getSMSService, private postSms: postSMSService) {

   }

  ngOnInit() {
    this.isProfessional = sessionStorage.getItem('institute_type') == 'LANG';
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));
    this.getSmsReport(this.smsFetchForm);
  }


  getSmsReport(obj) {

    this.getSms.fetchSmsReport(obj).subscribe(
      res => {
        res.forEach(el => {
          let obj = {
            isSelected: false,
            data: el
          }
          this.smsSource.push(obj); 
        });
      }
    )

  }

  
}
