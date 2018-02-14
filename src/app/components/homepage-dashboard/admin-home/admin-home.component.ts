import {
  Component, OnInit, ViewChild, Input, Output, EventEmitter, HostListener,
  AfterViewInit, OnDestroy, ElementRef, Renderer2, ChangeDetectionStrategy, ChangeDetectorRef,
  SimpleChanges, OnChanges
} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
import { AppComponent } from '../../../app.component';
import * as moment from 'moment';
import { MenuItem } from 'primeng/primeng';
import { Pipe, PipeTransform } from '@angular/core';
import { LoginService } from '../../../services/login-services/login.service';
import { document } from '../../../../assets/imported_modules/ngx-bootstrap/utils/facade/browser';
import { ColumnSetting } from '../../shared/custom-table/layout.model';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs';
import 'rxjs/Rx';
import * as Muuri from 'muuri/muuri';
import { FetchenquiryService } from '../../../services/enquiry-services/fetchenquiry.service'
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent implements OnInit {

  isProfessional: boolean = false;
  grid: any;
  order: string[] = ['1', '2', '3', '4'];

  enquiryDate:string = moment().format("YYYY-MM-DD");

  chart = new Chart({
    chart: {
      type: 'pie',
      renderTo: 'enqChart',
      margin: [0, 0, 0, 0],
      spacingTop: 0,
      spacingBottom: 0,
      spacingLeft: 0,
      spacingRight: 0
    },
    title: {
      text: null
    },
    plotOptions: {
      pie: {
        size: '100%',
        dataLabels: {
          enabled: false
        }
      }
    },
    credits: {
      enabled: false
    },
    series: [{
      type: 'pie',
      name: 'Count',
      data: [
        ['Open', 45.0],
        ['In Progress', 26.8],
        ['Admitted', 8.5],
        ['Closed', 6.2],
        ['Registered', 21.0]
      ]
    }]
  });

  constructor(private router: Router, private fb: FormBuilder, private appC: AppComponent, private login: LoginService, private rd: Renderer2, private enquiryService: FetchenquiryService) {

    if (sessionStorage.getItem('Authorization') == null) {
      this.router.navigate(['/authPage']);
    }



  }

  ngOnInit() {
    this.isProfessional = sessionStorage.getItem('institute_type') == 'LANG';
    this.fetchWidgetPrefill();
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));
    this.grid = new Muuri('.grid', {
      dragEnabled: true,
      layout: {
        fillGaps: false,
        rounding: true
      },
      layoutOnInit: false,
      sortData: {
        id: (item, element) => {
          // return parseFloat(element.getAttribute('data-id'));
          return this.order.indexOf(element.getAttribute('data-id'));
        }
      }
    });
    this.grid.sort('id');
    this.grid.on('dragEnd', (item, event) => {
      this.getOrder();
    });

  }

  fetchWidgetPrefill() {
    this.enquiryService.fetchEnquiryWidgetView(this.enquiryDate)
  }

  getOrder() {
    this.order = this.grid.getItems().map(item => item.getElement().getAttribute('data-id'));
  }

  getDataId(text: String): number {
    let id: number;

    switch (text) {
      case 'enquiry': {
        id = 1;
        break;
      }

      case 'fee': {
        id = 2;
        break;
      }

      case 'general': {
        id = 3;
        break;
      }

      case 'schedule': {
        id = 4;
        break;
      }
    }

    return id;
  }



}
