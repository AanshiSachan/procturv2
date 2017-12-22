import {
  Component, OnInit, ViewChild, Input, Output, EventEmitter, HostListener, 
  AfterViewInit, OnDestroy, ElementRef, Renderer2, ChangeDetectionStrategy, ChangeDetectorRef,
  SimpleChanges, OnChanges } 
from '@angular/core';
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

@Component({
  selector: 'app-sms-report',
  templateUrl: './sms-report.component.html',
  styleUrls: ['./sms-report.component.scss']
})
export class SmsReportComponent implements OnInit {

  isProfessional:boolean = false;

  constructor(private router: Router,private appC: AppComponent, private login: LoginService,private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.isProfessional = sessionStorage.getItem('institute_type') == 'LANG';
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));
  }

}
