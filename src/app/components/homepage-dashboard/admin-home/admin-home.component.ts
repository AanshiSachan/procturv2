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
import { SelectItem } from 'primeng/components/common/api';
import { WidgetService } from '../../../services/widget.service';

@Component({
  selector: 'admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent implements OnInit {

  public isProfessional: boolean = false;
  public grid: any;
  public instituteSetting: any;
  public planListArr: any[] = [];
  public enquiryStat: any = {
    totalcount: null,
    statusMap: null
  };
  public home_work_notifn: number = 0;
  public topics_covered_notifn: number = 0;
  public teacherListArr: any[] = [];
  public isPopupOpened: boolean = false;
  public isAttendancePop: boolean = false;
  public isCancelExamPop: boolean = false;
  public isReminderPop: boolean = false;
  public isReschedulePop: boolean = false;
  public isRippleLoad: boolean = false;
  public AllPresent: boolean = true;
  public teacher_id: number = -1;
  public schedStat: any = {};
  public feeStat: any = null;
  is_notified: any = 'Y';
  public genralStats: any = {
    sms: 0,
    download: 0,
    expiry: moment().format('DD-MMM-YYYY'),
    total: 0
  }
  public selectedRow: number = null;
  public order: string[] = ['1', '2', '3', '4'];
  public schedSelected: boolean = false;
  public isOptionVisible: boolean = false;
  public enquiryDate: any[] = [];
  public feeDate: any[] = [];
  public schedDate: any[] = [];
  public currentPlan: any = null;
  public classMarkedForAction: any;
  public chart = new Chart({
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
  public attendanceNote: string = "";
  public homework: string = "";
  public studentAttList: any = [];
  public cancellationReason: string = '';
  resheduleNotified: any = "Y";
  hourArr: any[] = ['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  minArr: any[] = ['', '00', '15', '30', '45'];
  meridianArr: any[] = ['', "AM", "PM"];
  reschedDate: any = new Date();
  reschedReason: any = "";
  timepicker: any = {
    reschedStartTime: {
      hour: '',
      minute: '',
      meridian: ''
    },
    reschedEndTime: {
      hour: '',
      minute: '',
      meridian: ''
    },
  }
  isSubjectView: boolean = true;
  types: SelectItem[] = [
    { label: 'Course', value: 'course' },
    { label: 'Subject', value: 'subject' }
  ];

  selectedType: string = "subject";
  courseLevelSchedDate: any = new Date();
  courseLevelSchedule: any;
  isCourseAttendance: boolean = false;
  isCourseCancel: boolean = false;
  isCourseReminder: boolean = false;
  courseLevelStudentAtt: any;
  /* ===================================================================================== */
  /* ===================================================================================== */
  /* ===================================================================================== */
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
  /* ===================================================================================== */
  /* ===================================================================================== */
  /* ===================================================================================== */
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
  /* ===================================================================================== */
  /* ===================================================================================== */
  /* ===================================================================================== */
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
    this.isOptionVisible = false;
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
    this.isOptionVisible = false;
    this.widgetService.fetchSchedWidgetData(obj).subscribe(
      res => {
        this.grid.refreshItems().layout();
        this.schedStat = res;
      },
      err => { }
    )
  }

  getCheckedStatus(id: string) {
    if (id === "notifyCancel") {
      return true;
    }
    else if (id === 'resheduleNotified') {
      return true;
    }
  }

  /* ======================================================================================================= */
  /* ===================Wideget Fuctions====================== */
  /* ======================================================================================================= */

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
    this.generateOption(i, selected.class_date);
    this.classMarkedForAction = selected
  }

  generateOption(i, o) {
    let d = moment(o).format("YYYY-MM-DD");
    this.selectedRow = i;
    this.schedSelected = true;
    if (d >= moment(new Date()).format("YYYY-MM-DD")) {
      this.isOptionVisible = true;
    }
    else {
      this.isOptionVisible = false;
    }
  }

  getCourseHomeworkData(i): string {
    return this.courseLevelStudentAtt[i].dateLi[0].home_work_status;
  }

  isCourseHomeworkStatusChanged(ev, i) {
    this.courseLevelStudentAtt[i].dateLi[0].home_work_status = ev;
    this.courseLevelStudentAtt[i].dateLi[0].is_home_work_status_changed = "Y";
  }

  getDisability(s): boolean {
    if (s.dateLi[0].serverStatus == "L") {
      console.log(s.dateLi[0].is_home_work_status_changed === "Y" && s.dateLi[0].status === "L");
      return true;
    }
    else {
      return false;
    }
  }

  /* ======================================================================================================= */
  /* =================================Attendance PopUP===================================== */
  /* ======================================================================================================= */

  initiateMarkAttendance() {
    this.isRippleLoad = true;
    if (!this.isProfessional) {
      let obj = {
        batch_id: this.classMarkedForAction.batch_id,
        type: 2,
        attendanceSchdId: this.classMarkedForAction.schd_id
      }
      this.widgetService.getAttendance(obj).subscribe(
        res => {
          res.forEach(e => {
            e.attendance_note = "";
            e.date = "";
            e.home_work_status = "Y";
            e.homework_assigned = "";
            e.isStatusModified = "N";
            e.is_home_work_status_changed = "N";
            e.isStatusModified = "N";
            if (e.dateLi[0].status == "L") {
              e.dateLi[0].serverStatus = "L";
            } else {
              e.dateLi[0].serverStatus = "";
            }
          })
          this.studentAttList = res;
          this.home_work_notifn = res[0].home_work_notifn;
          this.topics_covered_notifn = res[0].topics_covered_notifn;
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
    else {
      let obj = {
        batch_id: this.classMarkedForAction.batch_id,
        type: 2,
        attendanceSchdId: this.classMarkedForAction.schd_id
      }
      this.widgetService.getAttendance(obj).subscribe(
        res => {
          res.forEach(e => {
            e.attendance_note = "";
            e.date = "";
            e.home_work_status = "Y";
            e.homework_assigned = "";
            e.isStatusModified = "N";
            e.is_home_work_status_changed = "N";
            e.isStatusModified = "N";
            if (e.dateLi[0].status == "L") {
              e.dateLi[0].serverStatus = "L";
            } else {
              e.dateLi[0].serverStatus = "";
            }
          })
          this.studentAttList = res;
          this.home_work_notifn = res[0].home_work_notifn;
          this.topics_covered_notifn = res[0].topics_covered_notifn;
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
  }


  closeAttendance() {
    this.isAttendancePop = false;
    this.attendanceNote = "";
    this.homework = "";
    this.studentAttList = [];
    this.home_work_notifn = null;
    this.topics_covered_notifn = null;
    this.teacher_id = null;
  }

  updateRadioAttendance(val, i, obj) {
    if (val === "L") {
      this.studentAttList[i].dateLi[0].home_work_status = "N";
    }
    else if (val === "A") {
      this.studentAttList[i].dateLi[0].home_work_status = "N";
    }
  }

  updateCourseRadioAttendance(val, i, obj) {
    if (val === "L") {
      this.courseLevelStudentAtt[i].dateLi[0].home_work_status = "N";
    }
    else if (val === "A") {
      this.courseLevelStudentAtt[i].dateLi[0].home_work_status = "N";
    }
  }

  updateHomework(e) {
    if (e.target.checked) {
      this.home_work_notifn = 1;
      this.studentAttList.forEach(e => {
        e.home_work_notifn = this.home_work_notifn;
      });
    }
    else {
      this.home_work_notifn = 0;
      this.studentAttList.forEach(e => {
        e.home_work_notifn = this.home_work_notifn;
      });
    }
  }

  updateTopicCovered(e) {
    if (e.target.checked) {
      this.topics_covered_notifn = 1;
      this.studentAttList.forEach(e => {
        e.topics_covered_notifn = this.topics_covered_notifn;
      });
    }
    else {
      this.topics_covered_notifn = 0;
      this.studentAttList.forEach(e => {
        e.topics_covered_notifn = this.topics_covered_notifn;
      });
    }
  }

  markAllPresent(e) {

    if (e.target.checked) {
      this.studentAttList.forEach(e => {
        e.dateLi[0].status = "P";
      });
    }
    else {
      this.studentAttList.forEach(e => {
        e.dateLi[0].status = "A";
      });
    }
  }

  updateAttendance() {
    let arr = [];
    this.studentAttList.forEach(e => {
      e.dateLi[0] = Object.assign({}, this.getCustomAttendanceObject(e.dateLi[0], e));
      let temp = {
        batch_id: this.classMarkedForAction.batch_id,
        dateLi: e.dateLi,
        home_work_notifn: e.home_work_notifn,
        isNotify: e.isNotify,
        is_home_work_enabled: e.is_home_work_enabled,
        student_id: e.student_id,
        topics_covered_notifn: e.topics_covered_notifn
      };
      arr.push(temp);
    });
    this.widgetService.updateAttendance(arr).subscribe(
      res => {
        let msg = {
          type: 'success',
          title: 'Attendance Updated',
          body: res.message
        }
        this.appC.popToast(msg);
        this.closeAttendance();
      },
      err => {
        let msg = {
          type: 'error',
          title: 'Failed To Update Attendance',
          body: err.message
        }
        this.appC.popToast(msg);
      }
    )
  }

  getCustomAttendanceObject(d, detail): any {
    let obj = {
      attendance_note: this.attendanceNote,
      date: moment(new Date()).format("YYYY-MM-DD"),
      home_work_status: detail.home_work_status,
      homework_assigned: this.homework,
      isStatusModified: "Y",
      is_home_work_status_changed: d.is_home_work_status_changed,
      schId: d.schId,
      status: d.status,
      teacher_id: d.teacher_id,
    }

    return obj;
  }

  getCustomCourseLevelAttendanceObject(d, detail): any {
    let obj = {
      date: moment(new Date()).format("YYYY-MM-DD"),
      home_work_status: detail.home_work_status,
      isStatusModified: "Y",
      is_home_work_status_changed: d.is_home_work_status_changed,
      status: d.status,
    }

    return obj;
  }

  isHomeworkStatusChanged(i) {
    this.studentAttList[i].dateLi[0].is_home_work_status_changed = "Y";
  }

  /* ======================================================================================================= */
  /* ===================================Cancel Class=================================== */
  /* ======================================================================================================= */

  initiateCancelClass() {
    this.isCancelExamPop = true;
  }

  notifyCancelUpdate(e) {
    if (e.target.checked) {
      this.is_notified = "Y";
    }
    else {
      this.is_notified = "N";
    }
  }

  cancelClass() {
    let obj = {
      batch_id: this.classMarkedForAction.batch_id,
      cancelSchd: []
    }
    let schd = {
      cancel_note: this.cancellationReason,
      schd_id: this.classMarkedForAction.schd_id,
      is_notified: this.is_notified
    }
    obj.cancelSchd.push(schd);
    this.widgetService.cancelClassSchedule(obj).subscribe(
      res => {
        let msg = {
          type: 'success',
          title: 'Schedule Cancelled',
          body: 'The requested scheduled has been cancelled'
        }
        this.appC.popToast(msg);
        this.closeCancelClass();
        this.fetchScheduleWidgetData();
      },
      err => {
        let msg = {
          type: 'error',
          title: 'Failed To Cancel Schedule',
          body: err.cancelResponseMessage
        }
        this.appC.popToast(msg);
      }
    )
  }

  closeCancelClass() {
    this.isCancelExamPop = false;
    this.cancellationReason = '';
  }

  /* ======================================================================================================= */
  /* =================================Reminder==================================== */
  /* ======================================================================================================= */

  initiateRemiderClass() {
    this.isReminderPop = true;
  }

  sendReminder() {
    let obj = {
      batch_id: this.classMarkedForAction.batch_id,
      class_schedule_id: this.classMarkedForAction.schd_id,
      is_exam_schedule: "N"
    };

    this.widgetService.notifyStudentSchedule(obj).subscribe(
      res => {
        let msg = {
          type: 'success',
          title: 'Reminder Sent',
          body: 'Students have been notified'
        }
        this.appC.popToast(msg);
        this.closeRemiderClass();
      },
      err => {
        let msg = {
          type: 'error',
          title: 'Failed To Notify',
          body: 'please contact support@proctur.com'
        }
        this.appC.popToast(msg);
      }
    )
  }

  closeRemiderClass() {
    this.isReminderPop = false;
  }

  /* ======================================================================================================= */
  /* =================================Reshedule===================================== */
  /* ======================================================================================================= */

  initiateRescheduleClass() {
    this.isReschedulePop = true;
  }

  rescheduleClass() {
    if (this.reSheduleFormValid()) {
      let temp1: any = {
        cancel_note: this.reschedReason,
        schd_id: this.classMarkedForAction.schd_id,
        is_notified: this.resheduleNotified
      }
      let temp2 = {
        class_date: moment(this.reschedDate).format("YYYY-MM-DD"),
        start_time: this.timepicker.reschedStartTime.hour + ":" + this.timepicker.reschedStartTime.minute + " " + this.timepicker.reschedStartTime.meridian,
        end_time: this.timepicker.reschedEndTime.hour + ":" + this.timepicker.reschedEndTime.minute + " " + this.timepicker.reschedEndTime.meridian,
        duration: this.getDifference()
      }
      let obj = {
        batch_id: this.classMarkedForAction.batch_id,
        cancelSchd: [],
        extraSchd: []
      }
      obj.cancelSchd.push(temp1);
      obj.extraSchd.push(temp2);

      this.widgetService.reScheduleClass(obj).subscribe(
        res => {
          let msg = {
            type: 'success',
            title: 'Class Rescheduled',
            body: 'The request has been processed'
          }
          this.appC.popToast(msg);
          this.closeRescheduleClass();
          this.fetchScheduleWidgetData();
        },
        err => {
          let msg = {
            type: 'error',
            title: 'Failed To Reschedule',
            body: err.message
          }
          this.appC.popToast(msg);
        }
      )
    }
  }

  getDifference(): any {
    let startTime = this.timepicker.reschedStartTime.hour + ":" + this.timepicker.reschedStartTime.minute + " " + this.timepicker.reschedStartTime.meridian;
    let endTime = this.timepicker.reschedEndTime.hour + ":" + this.timepicker.reschedEndTime.minute + " " + this.timepicker.reschedEndTime.meridian;
    let start = moment.utc(startTime, "HH:mm A");
    let end = moment.utc(endTime, "HH:mm A");
    if (end.isBefore(start)) {
      end.add(1, 'day');
    }
    let d: any = moment.duration(end.diff(start));
    return d._milliseconds / 60000;
  }

  reSheduleFormValid(): boolean {
    /* Date Validation */
    if (this.reschedDate != '' && this.reschedDate != 'Invalid Date') {
      /* Reschedule Reason */
      if (this.reschedReason.trim() != '') {
        /* Validate Time */
        if (this.isTimeValid()) {
          return true;
        }
        else {
          let msg = {
            type: 'error',
            title: 'Invalid Time',
            body: 'Please provide a complete start and end time for rescheduling'
          }
          this.appC.popToast(msg);
          return false;
        }
      }
      else {
        let msg = {
          type: 'error',
          title: 'Reschedule Reason Missing',
          body: 'Please mention a reason for rescheduling the class'
        }
        this.appC.popToast(msg);
        return false;
      }
    }
    /* Date not found */
    else {
      let msg = {
        type: 'error',
        title: 'Date Missing',
        body: 'Please select a date to reschedule class'
      }
      this.appC.popToast(msg);
      return false;
    }
  }

  isTimeValid() {

    if (this.timepicker.reschedStartTime.hour.trim() != '' && this.timepicker.reschedStartTime.minute.trim() != '' && this.timepicker.reschedStartTime.meridian.trim() != '' && this.timepicker.reschedEndTime.hour.trim() != '' && this.timepicker.reschedEndTime.minute.trim() != '' && this.timepicker.reschedEndTime.meridian.trim() != '') {
      let startTime = this.timepicker.reschedStartTime.hour + ":" + this.timepicker.reschedStartTime.minute + " " + this.timepicker.reschedStartTime.meridian;
      let endTime = this.timepicker.reschedEndTime.hour + ":" + this.timepicker.reschedEndTime.minute + " " + this.timepicker.reschedEndTime.meridian;
      let start = moment.utc(startTime, "HH:mm A");
      let end = moment.utc(endTime, "HH:mm A");
      if ((parseInt(start.format("HH")) < parseInt(end.format("HH")))) {
        return true;
      }
      else if ((parseInt(start.format("HH")) == parseInt(end.format("HH"))) && (parseInt(start.format("mm")) < parseInt(end.format("mm")))) {
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  }

  notifyRescheduleUpdate(e) {
    if (e.target.checked) {
      this.resheduleNotified = "Y";
    }
    else {
      this.resheduleNotified = "N";
    }
  }

  closeRescheduleClass() {
    this.isReschedulePop = false;
    this.reschedDate = new Date();
    this.reschedReason = "";
    this.timepicker = {
      reschedStartTime: {
        hour: '',
        minute: '',
        meridian: ''
      },
      reschedEndTime: {
        hour: '',
        minute: '',
        meridian: ''
      }
    }
  }

  /* ======================================================================================================= */
  /* =================================Course Level===================================== */
  /* ======================================================================================================= */


  onChanged(event) {
    if (event.value == 'subject') {
      this.isSubjectView = true;
      this.fetchScheduleWidgetData();
    }
    else if (event.value == 'course') {
      this.isRippleLoad = true;
      this.generateCourseLevelWidget();
    }
  }

  generateCourseLevelWidget() {
    let obj = {
      inst_id: sessionStorage.getItem('institute_id'),
      requested_date: moment(this.courseLevelSchedDate).format("YYYY-MM-DD")
    }
    this.widgetService.fetchCourseLevelWidgetData(obj).subscribe(
      res => {
        let tempArr: any[] = [];
        for (let o in res) {
          let temp = res[o].course_ids.split(',');
          if (temp.length > 1) {
            let length = temp.length;
            let nameArr = res[o].coursee_names.split(',');
            let idArr = res[o].course_ids.split(',');
            for (let i = 0; i < length; i++) {
              let tobj = {
                cancel_reason: res[o].cancel_reason,
                course_id: res[o].course_id,
                course_ids: "",
                coursee_names: "",
                coursesList: res[o].coursesList,
                end_date: res[o].end_date,
                inst_id: res[o].inst_id,
                is_cancel_notify: res[o].is_cancel_notify,
                master_course: res[o].master_course,
                requested_date: res[o].requested_date,
                standard_id: res[o].standard_id,
                standard_name: res[o].standard_name,
                start_date: res[o].start_date,
              }
              tobj.course_ids = idArr[i];
              tobj.coursee_names = nameArr[i];
              tempArr.push(tobj);
            }
          }
          else {
            tempArr.push(res[o]);
          }
        }
        this.courseLevelSchedule = tempArr;
        this.isRippleLoad = false;
        this.isSubjectView = false;
      }
    );
  }

  updateCourseLevelSched(e) {
    this.generateCourseLevelWidget();
  }

  initiateCourseMarkAttendance() {
    console.log(this.classMarkedForAction);
    let obj = {
      course_id: this.classMarkedForAction.course_ids,
      startdate: moment(this.courseLevelSchedDate).format("YYYY-MM-DD")
    }
    if (this.classMarkedForAction.course_ids != null && this.classMarkedForAction.course_ids != undefined) {
      this.widgetService.fetchCourseAttendance(obj).subscribe(
        (res: any) => {
          res.forEach(e => {
            if (e.dateLi[0].status == "L") {
              e.dateLi[0].serverStatus = "L";
            } else {
              e.dateLi[0].serverStatus = "";
            }
          })
          this.courseLevelStudentAtt = res;
          this.isCourseAttendance = true;
        },
        err => {

        }
      );
    } else {
      alert('This scenario is not being replicated please specify set of steps to replicate');
      console.log(this.classMarkedForAction);
    }
  }

  initiateCourseCancelClass() {
    this.isCourseCancel = true;
  }

  closeCourseCancelClass() {
    this.isCourseCancel = false;
    this.cancellationReason = '';
  }

  cancelCourseClass() {
    let obj = {
      cancel_reason: this.cancellationReason,
      course_ids: this.classMarkedForAction.course_ids,
      inst_id: sessionStorage.getItem('institute_id'),
      is_cancel_notify: this.is_notified,
      master_course: this.classMarkedForAction.master_course,
      requested_date: moment().format("YYYY-MM-DD")
    }
    this.widgetService.cancelCourseSchedule(obj).subscribe(
      res => {
        let msg = {
          type: 'success',
          title: 'Course Schedule Cancelled',
          body: 'The requested scheduled has been cancelled'
        }
        this.appC.popToast(msg);
        this.closeCourseCancelClass();
        this.generateCourseLevelWidget();
      },
      err => {
        let msg = {
          type: 'error',
          title: 'Failed To Cancel Schedule',
          body: err.cancelResponseMessage
        }
        this.appC.popToast(msg);
      }
    )
  }

  initiateCourseRemiderClass() {
    if (confirm("Are you sure, You want to notify?")) {
      let obj = {
        course_ids: this.classMarkedForAction.course_ids,
        inst_id: sessionStorage.getItem('institute_id'),
        master_course: this.classMarkedForAction.master_course,
        requested_date: moment().format("YYYY-MM-DD")
      }
      this.widgetService.remindCourseLevel(obj).subscribe(
        res => {
          let msg = {
            type: 'success',
            title: 'Reminder Sent',
            body: 'The student have been notified'
          }
          this.appC.popToast(msg);
        },
        err => {
          let msg = {
            type: 'error',
            title: 'Unable to Send Reminder',
            body: 'please contact support@proctur.com'
          }
          this.appC.popToast(msg);
        }
      )
    }
  }

  closeCourseLevelAttendance() {
    this.isCourseAttendance = false;
  }

  updateCourseAttendance() {
    let arr = [];
    this.courseLevelStudentAtt.forEach(e => {
      e.dateLi[0] = Object.assign({}, this.getCustomCourseLevelAttendanceObject(e.dateLi[0], e));
      let temp = {
        course_id: this.classMarkedForAction.course_ids,
        dateLi: e.dateLi,
        isNotify: e.isNotify,
        is_home_work_enabled: e.is_home_work_enabled,
        student_id: e.student_id,
      };
      arr.push(temp);
    });

    this.widgetService.updateCourseAttendance(arr).subscribe(
      res => {
        let msg = {
          type: 'success',
          title: 'Attendance Updated',
          body: res.message
        }
        this.appC.popToast(msg);
        this.closeCourseLevelAttendance();
      },
      err => {
        let msg = {
          type: 'error',
          title: 'Failed To Update Attendance',
          body: err.message
        }
        this.appC.popToast(msg);
      }
    )

  }

  /* ======================================================================================================= */
  /* ====================================================================== */
  /* ======================================================================================================= */


}
