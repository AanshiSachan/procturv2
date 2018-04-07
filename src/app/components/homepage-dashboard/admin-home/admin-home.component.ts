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
  isSubjectView: boolean = false;
  types: SelectItem[] = [
    { label: 'Course', value: 'course' },
    { label: 'Subject', value: 'subject' }
  ];

  selectedType: string = "course";
  courseLevelSchedDate: any = new Date();
  courseLevelSchedule: any = [];
  isCourseAttendance: boolean = false;
  isCourseCancel: boolean = false;
  isCourseReminder: boolean = false;
  courseLevelStudentAtt: any = [];
  absentCount: number = 0;
  presentCount: number = 0;
  leaveCount: number = 0;
  topicsList: any = [];
  showTopicList: boolean = false;
  notificationPopUp: boolean = false;
  combinedDataRes: any = {};
  batchList: any = [];
  masterCourseList: any = [];
  courseList: any = [];
  studentList: any = [];
  addNotification: boolean = false;
  showTableFlag: boolean = false;
  newMessageText: string = "";
  sendNotification = {
    standard_id: '-1',
    subject_id: '-1',
    batch_id: '-1',
  }
  showEmailSubject: boolean = false;
  studentSelected: boolean = false;
  messageList: any = [];
  selectedOption: any = "";
  sendNotificationCourse = {
    master_course: '',
    course_id: ''
  }
  loginField = {
    checkBox: ''
  }
  permissionArray = sessionStorage.getItem('permissions');
  settingInfo: any = [];
  times: any[] = ['', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM', '12 AM'];
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
    this.permissionArray = sessionStorage.getItem('permissions');
    this.isProfessional = sessionStorage.getItem('institute_type') == 'LANG';
    this.fetchWidgetPrefill();
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));
    this.grid = new Muuri('.grid', {
      dragEnabled: false,
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

    this.widgetService.getSettings().subscribe(
      res => {
        this.settingInfo = res;
      },
      err => {
        console.log(err);
      }
    )

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
        this.genralStats.student_limit = e.student_limit;
      }
    })
  }

  fetchEnqWidgetData() {
    let obj = {
      updateDateFrom: moment(this.enquiryDate[0]).date(1).format("YYYY-MM-DD"),
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
      master_course_name: '-1',
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
    if (this.chart.ref.series.length > 0) {
      // let data = this.generateEnqChartData();
      // let dataFound = false;
      // data.forEach(ele => {
      //   if (ele[1] > 0) {
      //     dataFound = true;
      //   }
      // })
      // if (dataFound) {
      //   this.chart.ref.series[0].setData(data);
      // } else {

      // }
      this.chart.ref.series[0].setData(this.generateEnqChartData());
    }
    this.chart.ref.redraw();
  }

  /* Date CHange events handled here */

  updateEnqChartByDate(e) {
    let obj = {
      updateDateFrom: moment(e[0]).date(1).format("YYYY-MM-DD"),
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
      type: 2,
      installment_id: -1,
      subject_id: -1,
      master_course_name: '-1',
      course_id: -1,
      is_fee_report_view: 1,
      from_date: moment(this.feeDate[0]).format('YYYY-MM-DD'),
      to_date: moment(this.feeDate[1]).format('YYYY-MM-DD')
    }
    this.isOptionVisible = false;
    this.widgetService.fetchFeeWidgetData(obj).subscribe(
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
      if (this.enquiryStat.statusMap[key] == 0) {
        temp[1] = 0;
      } else {
        temp[1] = Math.round(((this.enquiryStat.statusMap[key] / this.enquiryStat.totalcount) * 100));
      }
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
    let date = moment().date(1).format("YYYY-MM-DD");
    return date;
    // return this.enquiryDate;
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

    if (this.feeStat != null && this.feeStat != undefined && this.feeStat.length != 0) {
      if (id === 'total') {
        return this.feeStat[0].total_fees_collected;
      }
      else if (id === 'pending') {
        return this.feeStat[0].total_fees_collected_other;
      }
      else if (id === 'past') {
        return this.feeStat[0].total_dues_pending;
      }
    }
    else {
      return 0
    }
  }

  userScheduleSelected(i, selected) {
    this.selectedRow = i;
    this.classMarkedForAction = selected
  }


  /* deselectSelected() {
    console.log('fired');
    this.selectedRow = null;
     }
   */

  // generateOption(i, o) {
  //   let d = moment(o).format("YYYY-MM-DD");

  //   //this.schedSelected = true;
  //   if (d >= moment(new Date()).format("YYYY-MM-DD")) {
  //     this.isOptionVisible = true;
  //   }
  //   else {
  //     this.isOptionVisible = false;
  //   }
  // }

  getVisibility(c): boolean {
    let d = moment(c.class_date).format("YYYY-MM-DD");
    //this.schedSelected = true;
    if (d >= moment(new Date()).format("YYYY-MM-DD")) {
      return true;
    }
    else {
      return false;
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
      return true;
    }
    else {
      return false;
    }
  }

  /* ======================================================================================================= */
  /* =================================Attendance PopUP===================================== */
  /* ======================================================================================================= */

  initiateMarkAttendance(i, selected) {
    this.selectedRow = i;
    this.classMarkedForAction = selected;
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
          this.teacher_id = res[0].dateLi[0].teacher_id;
          this.isRippleLoad = false;
          this.isPopupOpened = true;
          this.isAttendancePop = true;
          this.attendanceNote = res[0].dateLi[0].attendance_note;
          this.homework = res[0].homework_assigned;
          this.getCountOfAbsentPresentLeave(res);
        },
        err => {
          this.isRippleLoad = false;
          let obj = {
            type: 'error',
            title: 'No Student In Batch',
            body: JSON.parse(err._body).message
          }
          this.appC.popToast(obj);
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
          this.teacher_id = res[0].dateLi[0].teacher_id;;
          this.isRippleLoad = false;
          this.isPopupOpened = true;
          this.isAttendancePop = true;
          this.attendanceNote = res[0].dateLi[0].attendance_note;
          this.homework = res[0].homework_assigned;
          this.getCountOfAbsentPresentLeave(res);
        },
        err => {
          this.isRippleLoad = false;
        }
      )
    }
  }


  getCountOfAbsentPresentLeave(data) {
    this.absentCount = 0;
    this.presentCount = 0;
    this.leaveCount = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i].dateLi[0].status == "P") {
        this.presentCount++;
      } else if (data[i].dateLi[0].status == "A") {
        this.absentCount++;
      } else {
        this.leaveCount++;
      }
    }
    if (this.studentAttList.length == this.presentCount) {
      this.AllPresent = true;
    } else {
      this.AllPresent = false;
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
    this.getCountOfAbsentPresentLeave(this.studentAttList);
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
        if (e.dateLi[0].status == "L" && e.dateLi[0].isStatusModified == "N") {
          //Do Nothing
        } else {
          document.getElementById('leaveBtn' + e.student_id).classList.remove('classLeaveBtn');
          document.getElementById('absentBtn' + e.student_id).classList.remove('classAbsentBtn');
          document.getElementById('presentBtn' + e.student_id).classList.remove('classPresentBtn');
          document.getElementById('presentBtn' + e.student_id).classList.add('classPresentBtn');
          e.dateLi[0].status = "P";
          e.dateLi[0].home_work_status = "Y"
          e.dateLi[0].isStatusModified = "Y"
        }
      });
    }
    else {
      this.studentAttList.forEach(e => {
        if (e.dateLi[0].status == "L" && e.dateLi[0].isStatusModified == "N") {
          //Do Nothing
        } else {
          document.getElementById('leaveBtn' + e.student_id).classList.remove('classLeaveBtn');
          document.getElementById('absentBtn' + e.student_id).classList.remove('classAbsentBtn');
          document.getElementById('presentBtn' + e.student_id).classList.remove('classPresentBtn');
          e.dateLi[0].status = "A";
          e.dateLi[0].home_work_status = "N"
          e.dateLi[0].isStatusModified = "Y"
        }
      });
    }
    this.getCountOfAbsentPresentLeave(this.studentAttList);
  }


  checkIfStudentIsAbsent() {
    for (let i = 0; i < this.studentAttList.length; i++) {
      if (this.studentAttList[i].dateLi[0].status == "A") {
        return true;
      }
    }
  }

  updateAttendance() {
    let sendSms = "N";
    let check = this.checkIfStudentIsAbsent();
    if (check) {
      let checkboxAbsentees = document.getElementById("EnableSmsAbsentees").checked;
      if (checkboxAbsentees) {
        sendSms = "Y";
        this.markAttendanceServerCall(sendSms);
      } else {
        sendSms = "N";
        this.markAttendanceServerCall(sendSms);
      }
    } else {
      this.markAttendanceServerCall(sendSms);
    }

  }

  markAttendanceServerCall(sendSms) {
    this.isRippleLoad = true;
    let arr = [];
    this.studentAttList.forEach(e => {
      e.dateLi[0] = Object.assign({}, this.getCustomAttendanceObject(e.dateLi[0], e));
      let temp = {
        batch_id: this.classMarkedForAction.batch_id,
        dateLi: e.dateLi,
        home_work_notifn: e.home_work_notifn,
        isNotify: sendSms,
        is_home_work_enabled: e.is_home_work_enabled,
        student_id: e.student_id,
        topics_covered_notifn: e.topics_covered_notifn
      };
      arr.push(temp);
    });
    this.widgetService.updateAttendance(arr).subscribe(
      res => {
        this.isRippleLoad = false;
        let msg = {
          type: 'success',
          title: 'Attendance Updated',
          body: res.message
        }
        this.appC.popToast(msg);
        this.closeAttendance();
        this.fetchScheduleWidgetData();
      },
      err => {
        this.isRippleLoad = false;
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

  initiateCancelClass(i, selected) {
    this.selectedRow = i;
    this.classMarkedForAction = selected;
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

  initiateRemiderClass(i, selected) {
    this.selectedRow = i;
    this.classMarkedForAction = selected;
    this.isReminderPop = true;
  }

  sendReminder() {
    if (!this.isProfessional && !this.isSubjectView) {
      this.initiateCourseRemiderClass();
    } else {
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
  }

  closeRemiderClass() {
    this.isReminderPop = false;
  }

  /* ======================================================================================================= */
  /* =================================Reshedule===================================== */
  /* ======================================================================================================= */

  initiateRescheduleClass(i, selected) {
    this.selectedRow = i;
    this.classMarkedForAction = selected;
    this.isReschedulePop = true;
  }

  checkIfTimeProvided(data) {
    if (data == "" || data == null) {
      let msg = {
        type: 'error',
        title: 'Error',
        body: 'Please provide correct time'
      }
      this.appC.popToast(msg);
      return false;
    } else {
      return true;
    }
  }

  rescheduleClass() {
    let check = this.checkIfTimeProvided(this.timepicker.reschedStartTime.hour);
    if (check) {
      let startTime = this.timepicker.reschedStartTime.hour.split(' ');
      this.timepicker.reschedStartTime.hour = startTime[0];
      this.timepicker.reschedStartTime.meridian = startTime[1];
    } else {
      return;
    }
    let check1 = this.checkIfTimeProvided(this.timepicker.reschedEndTime.hour);
    if (check1) {
      let endTime = this.timepicker.reschedEndTime.hour.split(' ');
      this.timepicker.reschedEndTime.hour = endTime[0];
      this.timepicker.reschedEndTime.meridian = endTime[1];
    } else {
      return;
    }
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
    } else {
      this.timepicker.reschedStartTime.hour = this.timepicker.reschedStartTime.hour + " " + this.timepicker.reschedStartTime.meridian;
      this.timepicker.reschedEndTime.hour = this.timepicker.reschedEndTime.hour + " " + this.timepicker.reschedEndTime.meridian;
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
    this.selectedRow = null;
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

  initiateCourseMarkAttendance(i, selected) {
    this.selectedRow = i;
    this.classMarkedForAction = selected;
    this.isCourseAttendance = true;
    this.courseLevelStudentAtt = [];
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
          this.getTotalCountForCourse(res);
        },
        err => {

        }
      );
    } else {
      alert('This scenario is not being replicated please specify set of steps to replicate');
      console.log(this.classMarkedForAction);
    }
  }

  getTotalCountForCourse(data) {
    this.absentCount = 0;
    this.presentCount = 0;
    this.leaveCount = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i].dateLi[0].status == "P") {
        this.presentCount++;
      } else if (data[i].dateLi[0].status == "A") {
        this.absentCount++;
      } else {
        this.leaveCount++;
      }
    }
  }

  initiateCourseCancelClass(i, selected) {
    this.selectedRow = i;
    this.classMarkedForAction = selected;
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
        this.closeRemiderClass();
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

  closeCourseLevelAttendance() {
    this.isCourseAttendance = false;
  }

  //   {
  //   "student_id": "11919",
  //     "course_id": "79",
  //       "dateLi": [{
  //         "date": "2018-03-14",
  //         "status": "P",
  //         "isStatusModified": "N",
  //         "home_work_status": "Y",
  //         "is_home_work_status_changed": "N"
  //       }],
  //         "isNotify": "Y",
  //           "is_home_work_enabled": "Y"
  // },

  updateCourseAttendance() {
    let arr = [];
    this.courseLevelStudentAtt.forEach(element => {
      let temp = {
        "student_id": element.student_id,
        "course_id": this.classMarkedForAction.course_ids,
        "dateLi": [{
          "date": moment(this.courseLevelSchedDate).format("YYYY-MM-DD"),
          "status": element.dateLi[0].status,
          "isStatusModified": element.dateLi[0].isStatusModified,
          "home_work_status": element.dateLi[0].home_work_status,
          "is_home_work_status_changed": element.dateLi[0].is_home_work_status_changed
        }],
        "isNotify": element.isNotify,
        "is_home_work_enabled": element.is_home_work_enabled,
      }
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

  getTopicsUpdate() {
    debugger
    this.isRippleLoad = true;
    this.topicsList = [];
    let obj = { batch_id: this.classMarkedForAction.batch_id.toString() };
    this.widgetService.getListOfTopics(obj).subscribe(
      res => {
        if (res.length == 0) {
          let msg = {
            type: 'error',
            title: 'Error',
            body: "No toppics list found"
          }
          this.appC.popToast(msg);
          this.isRippleLoad = false;
        } else {
          this.isRippleLoad = false;
          this.topicsList = res;
          this.showTopicList = true;
        }
      },
      err => {
        this.isRippleLoad = false;
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

  markAttendance(i) {

  }

  markAttendaceHide(row) {
    if (moment(row.class_date).format('DD-MM-YYYY') > moment().format('DD-MM-YYYY')) {
      return "hide";
    } else {
      return "";
    }
  }

  getClassStatus(row) {
    if (moment(row.class_date).format('DD-MM-YYYY') == moment().format('DD-MM-YYYY')) {
      let currentTime: any = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
      let startMinute = this.convertIntOMinutes(row.start_time);
      let endMinute = this.convertIntOMinutes(row.end_time);
      currentTime = this.convertIntOMinutes(currentTime);
      if (startMinute <= currentTime && currentTime <= endMinute) {
        return "";
      } else {
        return "hide";
      }
    } else {
      return "hide";
    }
  }

  getReminderAndCancel(row) {
    if (moment(row.class_date).format('DD-MM-YYYY') == moment().format('DD-MM-YYYY')) {
      let currentTime: any = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
      let startMinute = this.convertIntOMinutes(row.start_time);
      let endMinute = this.convertIntOMinutes(row.end_time);
      currentTime = this.convertIntOMinutes(currentTime);
      if (startMinute > currentTime) {
        return "";
      } else {
        return "hide";
      }
    } else {
      return "";
    }
  }


  convertIntOMinutes(time) {
    let data: any = '';
    let hr = time.split(':')[0];
    let min = time.split(':')[1].split(' ')[0];
    let meridian = time.split(':')[1].split(' ')[1];
    if (meridian == "AM") {
      if (hr == "12") {
        data = Number(min);
      } else {
        data = Number(hr) * 60 + Number(min);
      }
    } else {
      if (hr == "12") {
        data = Number(hr) * 60 + Number(min);
      } else {
        data = (Number(hr) + 12) * 60 + Number(min);
      }
    }
    return data;
  }

  markAttendaceBtnClick(event, rowData, index) {
    document.getElementById('leaveBtn' + rowData.student_id).classList.remove('classLeaveBtn');
    document.getElementById('absentBtn' + rowData.student_id).classList.remove('classAbsentBtn');
    document.getElementById('presentBtn' + rowData.student_id).classList.remove('classPresentBtn');
    if (event.target.innerText == "Leave") {
      document.getElementById('leaveBtn' + rowData.student_id).classList.add('classLeaveBtn');
      rowData.dateLi[0].status = "L";
      rowData.dateLi[0].home_work_status = "N";
    } else if (event.target.innerText == "Absent") {
      document.getElementById('absentBtn' + rowData.student_id).classList.add('classAbsentBtn');
      rowData.dateLi[0].status = "A";
      rowData.dateLi[0].home_work_status = "N";
    } else {
      document.getElementById('presentBtn' + rowData.student_id).classList.add('classPresentBtn');
      rowData.dateLi[0].status = "P";
      rowData.dateLi[0].home_work_status = "Y";
    }
    this.getCountOfAbsentPresentLeave(this.studentAttList);
  }

  getClassForLeave(data) {
    if (data.dateLi[0].status == "L") {
      return "classLeaveBtn";
    } else {
      return "";
    }
  }

  getClassForAbsent(data) {
    if (data.dateLi[0].status == "A") {
      return "classAbsentBtn";
    } else {
      return "";
    }
  }

  getClassForPresent(data) {
    if (data.dateLi[0].status == "P") {
      return "classPresentBtn";
    } else {
      return "";
    }
  }

  addSendNotification() {
    this.notificationPopUp = true;
    this.clearDropDownBinding();
    if (this.isProfessional) {
      this.getMasterCourseAndBatch(this.sendNotification);
    } else {
      this.getMaterCourseList();
    }
  }

  closeNotificationPopUp() {
    this.notificationPopUp = false;
    this.addNotification = false;
    this.showTableFlag = false;
  }

  flushData() {
    this.batchList = [];
    this.courseList = [];
    this.studentList = [];
  }

  getMaterCourseList() {
    this.flushData();
    this.isRippleLoad = true;
    this.widgetService.getAllMasterCourse().subscribe(
      res => {
        this.isRippleLoad = false;
        console.log(res);
        this.masterCourseList = res;
      },
      err => {
        this.isRippleLoad = false;
        console.log(err);
      }
    )
  }

  onMasterCourseChange(event) {
    document.getElementById('chkBoxActiveSelection').checked = false;
    document.getElementById('chkBoxTutorSelection').checked = false;
    document.getElementById('chkBoxInActiveSelection').checked = false;
    document.getElementById('chkBoxAluminiSelection').checked = false;
    this.flushData();
    if (this.sendNotificationCourse.master_course != "-1") {
      this.isRippleLoad = true;
      this.widgetService.getAllCourse(this.sendNotificationCourse.master_course).subscribe(
        (res: any) => {
          this.showTableFlag = false;
          this.isRippleLoad = false;
          this.courseList = res.coursesList;
        },
        err => {
          this.isRippleLoad = false;
          console.log(err);
        }
      )
    }
  }

  fetchDataFromFields() {
    if (this.sendNotificationCourse.course_id != "-1") {
      this.isRippleLoad = true;
      let obj = {
        course_id: this.sendNotificationCourse.course_id,
        master_course_name: this.sendNotificationCourse.master_course
      }
      this.widgetService.getStudentListOfCourse(obj).subscribe(
        res => {
          this.isRippleLoad = false;
          this.showTableFlag = true;
          this.studentList = this.addKeys(res, true);
        },
        err => {
          this.isRippleLoad = false;
          console.log(err);
        }
      )
    }
  }

  getMasterCourseAndBatch(data) {
    this.isRippleLoad = true;
    this.widgetService.fetchCombinedData(data.standard_id, data.subject_id).subscribe(
      (res: any) => {
        this.isRippleLoad = false;
        this.combinedDataRes = res;
        if (res.standardLi != null) {
          this.masterCourseList = res.standardLi;
        }
        if (res.batchLi != null) {
          this.batchList = res.batchLi;
        }
        if (res.subjectLi != null) {
          this.courseList = res.subjectLi;
        }

      },
      err => {
        this.isRippleLoad = false;
        console.log(err);
      }
    )
  }

  addNewNotification() {
    this.addNotification = true;
  }

  saveNewMessage() {
    let obj = { message: this.newMessageText };
    this.widgetService.saveMessageTOServer(obj).subscribe(
      res => {
        console.log(res);
        let msg = {
          type: 'success',
          title: 'Message',
          body: "Saved Successfully"
        };
        this.appC.popToast(msg);
        this.closeNewMessageDiv();
        this.getAllMessageFromServer();
      },
      err => {
        console.log(err);
        let msg = {
          type: 'error',
          title: 'Failed To Save Message',
          body: err.message
        };
        this.appC.popToast(msg);
      }
    )
  }

  closeNewMessageDiv() {
    this.addNotification = false;
    this.newMessageText = "";
  }

  selectTabMenu(id, div) {
    document.getElementById('liAdd').classList.add('hide');
    document.getElementById('divAudience').classList.add('hide');
    document.getElementById('divSendMessage').classList.add('hide');
    document.getElementById('idAudience').classList.remove('active');
    document.getElementById('idSendMessage').classList.remove('active');
    document.getElementById(id).classList.add('active');
    document.getElementById(div).classList.remove('hide');
    document.getElementById('divParentOrGaurdian').classList.remove('hide');
    if (div == "divSendMessage") {
      this.showViewContent();
      this.getAllMessageFromServer();
      document.getElementById('liAdd').classList.remove('hide');
      if (document.getElementById('chkBoxTutorSelection').checked) {
        document.getElementById('divParentOrGaurdian').classList.add('hide');
      } else {
        document.getElementById('divParentOrGaurdian').classList.remove('hide');
      }
      this.whichCheckBoxSelected();
    }
  }


  whichCheckBoxSelected() {
    if (document.getElementById('chkBoxActiveSelection').checked) {
      this.selectedOption = "showTable";
      return;
    } else {
      this.selectedOption = "";
    }

    if (document.getElementById('chkBoxTutorSelection').checked) {
      this.selectedOption = "showTutor";
      return
    } else {
      this.selectedOption = "";
    }

    if (document.getElementById('chkBoxInActiveSelection').checked || document.getElementById('chkBoxAluminiSelection').checked) {
      this.selectedOption = "showTextBox";
      return
    } else {
      this.selectedOption = "";
    }

  }


  showViewContent() {
    for (let t = 0; t < this.studentList.length; t++) {
      if (this.studentList[t].assigned == true) {
        this.studentSelected = true;
        break;
      } else {
        this.studentSelected = false;
      }
    }
  }

  onMasterCourseSelection(event) {
    document.getElementById('chkBoxActiveSelection').checked = false;
    document.getElementById('chkBoxTutorSelection').checked = false;
    document.getElementById('chkBoxInActiveSelection').checked = false;
    document.getElementById('chkBoxAluminiSelection').checked = false;
    this.batchList = [];
    this.courseList = [];
    this.showTableFlag = false;
    this.getMasterCourseAndBatch(this.sendNotification);
  }

  onCourseSelection(event) {
    document.getElementById('chkBoxActiveSelection').checked = false;
    document.getElementById('chkBoxTutorSelection').checked = false;
    document.getElementById('chkBoxInActiveSelection').checked = false;
    document.getElementById('chkBoxAluminiSelection').checked = false;
    this.showTableFlag = false;
    this.batchList = [];
    this.sendNotification.batch_id = "-1";
    this.getMasterCourseAndBatch(this.sendNotification);
  }

  fetchDataOnBatchBasis(event) {
    document.getElementById('chkBoxActiveSelection').checked = false;
    document.getElementById('chkBoxTutorSelection').checked = false;
    document.getElementById('chkBoxInActiveSelection').checked = false;
    document.getElementById('chkBoxAluminiSelection').checked = false;
    this.widgetService.fetchStudentListData(this.sendNotification.batch_id).subscribe(
      res => {
        this.showTableFlag = true;
        console.log(res);
        this.studentList = this.addKeys(res, true);
      },
      err => {
        console.log(err);
      }
    )
  }

  checkCheckAllChkboxStatus(data) {
    data.forEach(element => {
      if (element.assigned == false) {
        return false;
      }
    });
    return true;
  }

  addKeys(data, val) {
    data.forEach(
      element => {
        element.assigned = val;
      }
    )
    return data;
  }

  checkAllChechboxes(event, data) {
    data.forEach(
      element => {
        element.assigned = event.target.checked;
      }
    )
  }

  clearCheckBoxSelction(id) {
    document.getElementById('chkBoxActiveSelection').checked = false;
    document.getElementById('chkBoxTutorSelection').checked = false;
    document.getElementById('chkBoxInActiveSelection').checked = false;
    document.getElementById('chkBoxAluminiSelection').checked = false;
    document.getElementById(id).checked = true;
    this.whichCheckBoxSelected();
  }

  chkBoxAllActiveStudent(event) {
    this.clearDropDownBinding();
    if (event.target.checked) {
      this.clearCheckBoxSelction(event.target.id);
      this.isRippleLoad = true;
      this.studentList = [];
      this.widgetService.getAllActiveStudentList().subscribe(
        res => {
          this.showTableFlag = true;
          this.isRippleLoad = false;
          this.studentList = this.addKeys(res, true);
        },
        err => {
          this.isRippleLoad = false;
          console.log(err);
        }
      )
    } else {
      this.flushData();
      this.showTableFlag = false;
    }
  }

  chkBoxAllTeacher(event) {
    this.clearDropDownBinding();
    if (event.target.checked) {
      this.clearCheckBoxSelction(event.target.id);
      this.isRippleLoad = true;
      this.studentList = [];
      this.widgetService.getAllTeacherList().subscribe(
        res => {
          this.showTableFlag = true;
          this.isRippleLoad = false;
          this.studentList = this.addKeys(res, true);
        },
        err => {
          this.isRippleLoad = false;
          console.log(err);
        }
      )
    } else {
      this.flushData();
      this.showTableFlag = false;

    }
  }

  chkBoxAllInActiveStudent(event) {
    this.clearDropDownBinding();
    if (event.target.checked) {
      this.clearCheckBoxSelction(event.target.id);
      this.isRippleLoad = true;
      this.studentList = [];
      this.widgetService.getAllInActiveList().subscribe(
        res => {
          this.isRippleLoad = false;
          this.showTableFlag = true;
          this.studentList = this.addKeys(res, true);
        },
        err => {
          this.isRippleLoad = false;
          console.log(err);
        }
      )
    } else {
      this.flushData();
      this.showTableFlag = false;

    }
  }

  chkBoxAllAluminiStudent(event) {
    this.clearDropDownBinding();
    if (event.target.checked) {
      this.clearCheckBoxSelction(event.target.id);
      this.isRippleLoad = true;
      this.studentList = [];
      this.widgetService.getAllAluminiList().subscribe(
        res => {
          this.showTableFlag = true;
          this.isRippleLoad = false;
          this.studentList = this.addKeys(res, true);
        },
        err => {
          this.isRippleLoad = false;
          console.log(err);
        }
      )
    } else {
      this.flushData();
      this.showTableFlag = false;

    }
  }

  clearDropDownBinding() {
    if (this.isProfessional) {
      this.sendNotification = {
        standard_id: '-1',
        subject_id: '-1',
        batch_id: '-1',
      };
    } else {
      this.sendNotificationCourse = {
        master_course: '',
        course_id: '-1'
      }
    }
  }

  emailCheckBoxClick(event) {
    if (event.target.checked) {
      this.showEmailSubject = true;
    } else {
      this.showEmailSubject = false;
    }
  }

  getAllMessageFromServer() {
    this.messageList = [];
    this.isRippleLoad = true;
    let obj = {
      from_date: moment().subtract(1, 'months').format("YYYY-MM-DD"),
      status: 1,
      to_date: moment().format("YYYY-MM-DD")
    }
    this.widgetService.getMessageList(obj).subscribe(
      res => {
        this.isRippleLoad = false;
        this.messageList = this.addKeys(res, false);
      },
      err => {
        this.isRippleLoad = false;
      }
    )
  }

  getAllSavedMessages() {
    this.messageList = [];
    this.widgetService.getMessageList({ status: 1 }).subscribe(
      res => {
        console.log(res);
        this.messageList = this.addKeys(res, false);
      },
      err => {
        console.log(err);
      }
    )
  }

  getListOfIds(key) {
    let id: any = [];
    for (let t = 0; t < this.studentList.length; t++) {
      if (this.studentList[t].assigned == true) {
        id.push(this.studentList[t][key]);
      }
    }
    return id.join(',');
  }

  validateAllFields() {
    if (this.showEmailSubject) {
      let text = document.getElementById('divSubjectMessage').value;
      if (text.trim() == "" && text.trim() == null) {
        let msg = {
          type: 'error',
          title: 'Error',
          body: "Please enter subject for email"
        };
        this.appC.popToast(msg);
        return false;
      } else {
        return text;
      }
    }

    if (this.selectedOption == "showTextBox") {
      let text = document.getElementById('divMessageTextbox').value;
      if (text.trim() == "" && text.trim() == null) {
        let msg = {
          type: 'error',
          title: 'Error',
          body: "Please enter subject for email"
        };
        this.appC.popToast(msg);
        return false;
      } else {
        return text;
      }
    }
    return "";
  }

  getNotificationMessage() {
    let count = 0;
    for (let t = 0; t < this.messageList.length; t++) {
      if (this.messageList[t].assigned == true) {
        return {
          message: this.messageList[t].message, messageId: this.messageList[t].message_id
        };
      } else {
        count++;
      }
    }
    if (this.messageList.length == count) {
      let msg = {
        type: 'error',
        title: 'Error',
        body: "Please select message"
      };
      this.appC.popToast(msg);
      return false;
    }
  }

  getDeliveryModeValue() {
    let sms = document.getElementById('chkbxSmsSend').checked;
    let email = document.getElementById('chkbxEmailSend').checked;
    if (sms == true && email == true) {
      return 2;
    } else if (sms == true && email == false) {
      return 0;
    } else if (sms == false && email == true) {
      return 1;
    } else {
      let msg = {
        type: 'error',
        title: 'Error',
        body: "Please select Delivery Mode(SMS , Email)"
      };
      this.appC.popToast(msg);
      return false;
    }

  }

  getDestinationValue() {
    let student = document.getElementById('chkBoxStudent').checked;
    let parent = document.getElementById('chkBoxParent').checked;
    let gaurdian = document.getElementById('chkBoxGaurdian').checked;
    if (student == true && parent == false && gaurdian == false) {
      return 0;
    } else if (student == false && parent == true && gaurdian == false) {
      return 1;
    } else if (student = false && parent == false && gaurdian == true) {
      return 3;
    } else if (student && parent && gaurdian == false) {
      return 2;
    } else if (student && gaurdian && parent == false) {
      return 5;
    } else if (parent && gaurdian && student == false) {
      return 6;
    }
    else if (student && parent && gaurdian) {
      return 4;
    } else {
      let msg = {
        type: 'error',
        title: 'Error',
        body: "Please correct option in Send SMS To.."
      };
      this.appC.popToast(msg);
      return false;
    }
  }

  sendNotificationMessage() {
    let messageSelected: any;
    let configuredMessage: boolean = false;
    if (this.selectedOption == "showTextBox") {
      messageSelected = { message: '', messageId: '' };
      configuredMessage = false;
    } else {
      messageSelected = this.getNotificationMessage();
      configuredMessage = true;
    }
    if (messageSelected === false) {
      return
    }
    let check = this.validateAllFields();
    if (check === false) {
      return;
    }
    let delivery_mode = this.getDeliveryModeValue();
    if (delivery_mode === false) {
      return;
    }
    let destination = this.getDestinationValue();
    if (destination === false) {
      return;
    }

    let batch_id;
    if (this.isProfessional) {
      batch_id = this.sendNotification.batch_id;
    } else {
      batch_id = this.sendNotificationCourse.course_id;
    }
    let obj = {
      delivery_mode: Number(delivery_mode),
      notifn_message: messageSelected.message,
      notifn_subject: check,
      destination: Number(destination),
      student_ids: this.getListOfIds('student_id'),
      batch_id: batch_id,
      cancel_date: '',
      isEnquiry_notifn: 0,
      isAlumniSMS: 0,
      isTeacherSMS: 0,
      configuredMessage: configuredMessage,
      message_id: messageSelected.messageId
    }

    this.widgetService.sendNotification(obj).subscribe(
      res => {
        console.log(res);
        let msg = {
          type: 'success',
          title: 'Message',
          body: "Send Successfully"
        };
        this.appC.popToast(msg);
      },
      err => {
        console.log(err);
      }
    )
  }

  sendPushNotification() {
    let messageSelected: any;
    if (this.selectedOption == "showTextBox") {
      messageSelected = { message: '', messageId: '' };
    } else {
      messageSelected = this.getNotificationMessage();
    }
    if (messageSelected === false) {
      return
    }
    let obj = {
      notifn_message: messageSelected.message,
      message_id: messageSelected.messageId,
      student_ids: this.getListOfIds('student_id'),
    }
    this.widgetService.sendPushNotificationToServer(obj).subscribe(
      res => {
        console.log(res);
        let msg = {
          type: 'success',
          title: 'Message',
          body: "Send Successfully"
        };
        this.appC.popToast(msg);
      },
      err => {
        console.log(err);
      }
    )
  }

  changeCurrentView(event) {
    if (event.target.checked) {
      document.getElementById('divDeliveryMode').classList.remove('show');
      document.getElementById('divDeliveryMode').classList.add('hide');
      document.getElementById('divLoginMode').classList.remove('hide');
      document.getElementById('divLoginMode').classList.add('show');
    } else {
      document.getElementById('divDeliveryMode').classList.remove('remove');
      document.getElementById('divDeliveryMode').classList.add('show');
      document.getElementById('divLoginMode').classList.remove('show');
      document.getElementById('divLoginMode').classList.add('hide');
    }
  }

  sendSmsForApp(value) {
    if (confirm("Are you sure you want to send SMS to selected users?")) {
      let obj = {
        app_sms_type: Number(value),
        studentArray: this.getListOfIds('student_id'),
        userArray: this.getListOfIds('user_id'),
        user_role: this.loginField.checkBox
      }
      this.widgetService.smsForAddDownload(obj).subscribe(
        res => {
          console.log(res);
          let msg = {
            type: 'success',
            title: 'Message',
            body: "Send Successfully"
          };
          this.appC.popToast(msg);
        },
        err => {
          console.log(err);
        }
      )

    }
  }

  onCheckBoxSelection(index, data) {
    this.messageList.map(ele => {
      if (ele.message_id == data.message_id) {
        ele.assigned = true;
      } else {
        ele.assigned = false;
      }
    })
  }


  //  Role Based Access
  checkIfUserHadAccess(id) {
    this.permissionArray = sessionStorage.getItem('permissions');
    if (this.permissionArray == "" || this.permissionArray == null) {
      return false;
    } else {
      let data = JSON.parse(this.permissionArray);
      if (id != "" && data != null && data != "") {
        if (data.indexOf(id) == "-1") {
          return true;
        } else {
          return false;
        }
      } else {
        return '';
      }
    }
  }


  markAttendaceBtnClickCourse(event, rowData, index) {
    document.getElementById('leaveBtnCourse' + rowData.student_id).classList.remove('classLeaveBtn');
    document.getElementById('absentBtnCourse' + rowData.student_id).classList.remove('classAbsentBtn');
    document.getElementById('presentBtnCourse' + rowData.student_id).classList.remove('classPresentBtn');
    if (event.target.innerText == "Leave") {
      document.getElementById('leaveBtnCourse' + rowData.student_id).classList.add('classLeaveBtn');
      this.courseLevelStudentAtt[index].dateLi[0].status = "L";
      this.courseLevelStudentAtt[index].dateLi[0].home_work_status = "N";
      this.courseLevelStudentAtt[index].dateLi[0].isStatusModified = "Y";
    } else if (event.target.innerText == "Absent") {
      document.getElementById('absentBtnCourse' + rowData.student_id).classList.add('classAbsentBtn');
      this.courseLevelStudentAtt[index].dateLi[0].status = "A";
      this.courseLevelStudentAtt[index].dateLi[0].home_work_status = "N";
      this.courseLevelStudentAtt[index].dateLi[0].isStatusModified = "Y";
    } else {
      document.getElementById('presentBtnCourse' + rowData.student_id).classList.add('classPresentBtn');
      this.courseLevelStudentAtt[index].dateLi[0].status = "P";
      this.courseLevelStudentAtt[index].dateLi[0].isStatusModified = "Y";

    }
    this.getTotalCountForCourse(this.courseLevelStudentAtt);
  }

}

