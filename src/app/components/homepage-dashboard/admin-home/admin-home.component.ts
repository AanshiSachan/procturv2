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
import { } from '../../../model/enquirycampaign'
import * as Muuri from 'muuri/muuri';
import { FetchenquiryService } from '../../../services/enquiry-services/fetchenquiry.service'
import { Chart } from 'angular-highcharts';
import { } from '../../../services/'
import { WidgetService } from '../../../services/widget.service';

@Component({
  selector: 'admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent implements OnInit {

  isProfessional: boolean = false;
  grid: any;
  instituteSetting: any;
  planListArr: any[] = [];
  enquiryStat: any = {
    totalcount: null,
    statusMap: null
  };
  home_work_notifn:number = 0;
  topics_covered_notifn:number = 0;
  teacherListArr:any[] = [];
  isPopupOpened: boolean = false;
  isAttendancePop: boolean = false;
  isCancelExamPop: boolean = false;
  isReminderPop: boolean = false;
  isReschedulePop: boolean = false;
  isRippleLoad: boolean = false;
  AllPresent:boolean = true;
  teacher_id:number = -1;
  schedStat: any = {};
  feeStat: any = null;
  genralStats: any = {
    sms: 0,
    download: 0,
    expiry: moment().format('DD-MMM-YYYY'),
    total: 0
  }
  selectedRow: number = null;
  order: string[] = ['1', '2', '3', '4'];
  schedSelected: boolean = false;
  enquiryDate: any[] = [];
  feeDate: any[] = [];
  schedDate: any[] = [];
  currentPlan: any = null;
  classMarkedForAction: any;
  chart = new Chart({
    chart: {
      type: 'pie',
      options3d: {
        enabled: true,
        alpha: 45,
        beta: 0
      },
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
        allowPointSelect: true,
        cursor: 'pointer',
        colors: [
          '#568bf4',
          '#f456b0',
          '#ffcc3c',
          '#56cff4'
        ],
        size: '80%',
        depth: 35,
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
      name: '%',
      data: [
        ['Open', 0],
        ['In Progress', 0],
        ['Admitted', 0],
        ['Closed', 0],
        ['Converted', 0],
        ['Registered', 0]
      ]
    }]
  });
  studentAttList:any = [];
  constructor(private router: Router, private fb: FormBuilder, private appC: AppComponent, private login: LoginService, private rd: Renderer2, private enquiryService: FetchenquiryService, private widgetService: WidgetService) {
    if (sessionStorage.getItem('Authorization') == null) {
      this.router.navigate(['/authPage']);
    }
    this.enquiryDate[0] = new Date();
    this.enquiryDate[1] = new Date();
    this.feeDate[0] = new Date();
    this.feeDate[1] = new Date();
    this.schedDate[0] = new Date();
    this.schedDate[1] = new Date();
  }

  ngOnInit() {
    this.isProfessional = sessionStorage.getItem('institute_type') == 'LANG';
    this.fetchWidgetPrefill();
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));
    this.grid = new Muuri('.grid', {
      dragEnabled: true,
      layout: {
        fillGaps: true,
        rounding: true
      },
      layoutOnResize: true,
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

    this.widgetService.getAllplan().subscribe(
      res => {
        this.planListArr = res;
        this.widgetService.getInstituteSettings().subscribe(
          res => {
            this.instituteSetting = res;
            this.generatePlan();
          },
          err => { }
        );
      },
      err => { }
    );

    this.widgetService.getAllteachers().subscribe(
      res => {
        this.teacherListArr = res;
      },
      err => {
        
      }
    )

    this.fetchEnqWidgetData();
    this.fetchFeeWidgetData();

    if (this.isProfessional) {
      this.fetchBatchWidgetData();
    }
    else {
      this.fetchScheduleWidgetData();
    }
  }

  generatePlan() {
    this.planListArr.forEach(e => {
      if (e.id === this.instituteSetting.plan_id) {
        this.genralStats.download = e.download_limit;
        this.genralStats.expiry = this.instituteSetting.institute_expiry_date;
        this.genralStats.total = this.instituteSetting.total_students;
        this.genralStats.sms = this.instituteSetting.institute_sms_quota_available;
      }
    })
  }

  fetchEnqWidgetData() {
    let obj = {
      updateDateFrom: moment(this.enquiryDate[0]).format("YYYY-MM-DD"),
      updateDateTo: moment(this.enquiryDate[1]).format("YYYY-MM-DD")
    }
    this.enquiryService.fetchEnquiryWidgetView(obj).subscribe(
      res => {

        this.grid.refreshItems().layout();
        this.enquiryStat = res;
        this.updateEnqChart();
      }
    )
  }

  fetchScheduleWidgetData() {
    let obj = {
      from_date: moment(this.schedDate[0]).format('YYYY-MM-DD'),
      to_date: moment(this.schedDate[1]).format('YYYY-MM-DD')
    }
    this.widgetService.fetchSchedWidgetData(obj).subscribe(
      res => {
        this.grid.refreshItems().layout();
        this.schedStat = res;
      },
      err => { }
    );
  }

  fetchFeeWidgetData() {
    let obj = {
      standard_id: -1,
      batch_id: -1,
      type: 0,
      installment_id: -1,
      subject_id: -1,
      master_course_name: -1,
      course_id: -1,
      is_fee_report_view: 1,
      from_date: moment(this.feeDate[0]).format('YYYY-MM-DD'),
      to_date: moment(this.feeDate[1]).format('YYYY-MM-DD')
    }
    this.widgetService.fetchFeeWidgetData(obj).subscribe(
      res => {
        this.grid.refreshItems().layout();
        this.feeStat = res;
      },
      err => { }
    );
  }

  fetchBatchWidgetData() {

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

  getDetails(id: string): number {
    if (id === 'total') {
      if (this.enquiryStat.totalcount != null && this.enquiryStat.totalcount != undefined) {
        return this.enquiryStat.totalcount;
      }
      else {
        return 0;
      }
    }
    else if (id === 'open') {
      if (this.enquiryStat.statusMap != null && this.enquiryStat.statusMap != undefined) {
        return this.enquiryStat.statusMap['Open'];
      }
      else {
        return 0;
      }
    }
    else if (id === 'ip') {
      if (this.enquiryStat.statusMap != null && this.enquiryStat.statusMap != undefined) {
        return this.enquiryStat.statusMap['In Progress'];
      }
      else {
        return 0;
      }
    }
    else if (id === 'admitted') {
      if (this.enquiryStat.statusMap != null && this.enquiryStat.statusMap != undefined) {
        return this.enquiryStat.statusMap['Student Admitted'];
      }
      else {
        return 0;
      }
    }
    else if (id === 'closed') {
      if (this.enquiryStat.statusMap != null && this.enquiryStat.statusMap != undefined) {
        return this.enquiryStat.statusMap['Closed'];
      }
      else {
        return 0;
      }
    }
  }

  updateEnqChart() {
    this.chart.ref.series[0].setData(this.generateEnqChartData())
    this.chart.ref.redraw();
  }

  /* Date CHange events handled here */

  updateEnqChartByDate(e) {
    let obj = {
      updateDateFrom: moment(e[0]).format("YYYY-MM-DD"),
      updateDateTo: moment(e[1]).format("YYYY-MM-DD")
    }
    this.enquiryService.fetchEnquiryWidgetView(obj).subscribe(
      res => {
        this.enquiryStat = res;
        this.updateEnqChart();
      }
    )
  }

  updateFeeByDate(e) {
    let obj = {
      standard_id: -1,
      batch_id: -1,
      type: 0,
      installment_id: -1,
      subject_id: -1,
      master_course_name: -1,
      course_id: -1,
      is_fee_report_view: 1,
      from_date: moment(this.feeDate[0]).format('YYYY-MM-DD'),
      to_date: moment(this.feeDate[1]).format('YYYY-MM-DD')
    }
    this.widgetService.fetchFeeWidgetData(e).subscribe(
      res => {
        this.grid.refreshItems().layout();
        this.selectedRow = null;
        this.feeStat = res;
      },
      err => { }
    )
  }

  updateschedByDate(e) {
    let obj = {
      from_date: moment(e[0]).format('YYYY-MM-DD'),
      to_date: moment(e[1]).format('YYYY-MM-DD')
    }
    this.widgetService.fetchSchedWidgetData(obj).subscribe(
      res => {
        this.grid.refreshItems().layout();
        this.schedStat = res;
      },
      err => { }
    )
  }

  /* ========================================= */

  generateEnqChartData(): any[] {
    let tempArr: any[] = [];
    for (let key in this.enquiryStat.statusMap) {
      let temp: any[] = [];
      temp[0] = key;
      temp[1] = Math.round(((this.enquiryStat.statusMap[key] / this.enquiryStat.totalcount) * 100));
      tempArr.push(temp);
    }
    return tempArr;
  }

  openCalendar(id) {
    document.getElementById(id).click();
  }

  getClassCount(): number {
    if (this.schedStat.otherSchd != null && this.schedStat.otherSchd != undefined) {
      return this.schedStat.otherSchd.length;
    }
    else {
      return 0;
    }

  }

  getEnqStartDate() {
    return this.enquiryDate[0];
  }

  getEnqEndDate() {
    return this.enquiryDate[1];
  }

  getFeeStartDate() {
    return this.feeDate[0];
  }

  getFeeEndDate() {
    return this.feeDate[1];
  }

  getSchedStartDate() {
    return this.schedDate[0];
  }

  getSchedEndDate() {
    return this.schedDate[1];
  }

  getClassListDetails() {
    if (this.schedStat.otherSchd != null && this.schedStat.otherSchd != undefined) {
      return this.schedStat.otherSchd;
    }
    else {
      return [];
    }
  }

  getFeeAmount(id: String): number {

    if (this.feeStat != null && this.feeStat != undefined) {
      if (id === 'total') {
        return 100000
      }
      else if (id === 'pending') {
        return 10000
      }
      else if (id === 'past') {
        return 200000
      }
    }
    else {
      return 0
    }
  }

  userScheduleSelected(i, selected) {
    this.selectedRow = i;
    this.schedSelected = true;
    this.classMarkedForAction = selected
  }

  initiateMarkAttendance() {
    this.isRippleLoad = true;
    let obj = {
      batch_id: this.classMarkedForAction.batch_id,
      type: 2,
      attendanceSchdId: this.classMarkedForAction.schd_id 
    }
    this.widgetService.getAttendance(obj).subscribe(
      res => {
        this.studentAttList = res;
        this.home_work_notifn = res.home_work_notifn;
        this.topics_covered_notifn = res.topics_covered_notifn;
        this.teacher_id = res.teacher_id;
        this.isRippleLoad = false;
        this.isPopupOpened = true;
        this.isAttendancePop = true;
      },
      err => {
        this.isRippleLoad = false;
      }
    )

  }

  closeAttendance() {
    this.isPopupOpened = false;
    this.isAttendancePop = false;
  }

  updateRadioAttendance(val, i, obj){
  }

  updateHomework(e){
    if(e.target.checked){
      this.home_work_notifn = 1;
    }
    else{
      this.home_work_notifn = 0;
    }
  }

  updateTopicCovered(e){
    if(e.target.checked){
      this.topics_covered_notifn = 1;
    }
    else{
      this.topics_covered_notifn = 0;
    }
  }

  markAllPresent(e){
    console.log(e.target.checke);
    if(e.target.checked){
      this.studentAttList.forEach(e => {
        e.dateLi[0].status = "P";
      });
    }
    else{
      this.studentAttList.forEach(e => {
        e.dateLi[0].status = "A";
      });
    }
  }

}
