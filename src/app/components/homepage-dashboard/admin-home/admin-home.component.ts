import { Component, OnInit, ViewChild, ElementRef, Renderer2, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
import { AppComponent } from '../../../app.component';
import * as moment from 'moment';
import { LoginService } from '../../../services/login-services/login.service';
import { document } from 'ngx-bootstrap-custome/utils/facade/browser';
import 'rxjs/Rx';
import * as Muuri from 'muuri/muuri';
import { FetchenquiryService } from '../../../services/enquiry-services/fetchenquiry.service'
import { SelectItem } from 'primeng/components/common/api';
import { WidgetService } from '../../../services/widget.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { BiometricStatusServiceService } from '../../../services/biometric-status/biometric-status-service.service';
// import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdminHomeComponent implements OnInit {

  @ViewChild('ref') private ref: ElementRef;
  permissionArray = sessionStorage.getItem('permissions');
  public order: string[] = ['1', '2', '3', '4', '5'];
  times: any[] = ['', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM', '12 AM'];
  minArr: any[] = ['', '00', '15', '30', '45'];
  public enquiryDate: any[] = [];
  public studentAttList: any = [];
  public schedDate: any[] = [];
  public teacherListArr: any[] = [];
  batchList: any = [];
  topicsList: any = [];
  courseLevelStudentAtt: any = [];
  courseLevelSchedule: any = [];
  masterCourseList: any = [];
  courseList: any = [];
  studentList: any = [];
  viewDetTable: any = [];
  settingInfo: any = [];
  gradesList: any = [];
  openMessageList: any = [];
  tempData: any = [];
  messageList: any = [];
  public teacher_id: number = -1;
  public home_work_notifn: number = 0;
  public topics_covered_notifn: number = 0;


  public schedStat: any = {};
  public grid: any;
  is_notified: any = 'Y';
  reschedDate: any = new Date();
  reschedReason: any = "";
  resheduleNotified: any = "Y";
  public classMarkedForAction: any;
  selectedOption: any = "";
  selectedViewDet: any;
  examData: any = "";
  examGradeFeature: any;
  courseLevelSchedDate: any = new Date();
  showReasonSection: any = '';
  courseTempData: any = '';
  searchData: string = "";
  public attendanceNote: string = "";
  public homework: string = "";
  public cancellationReason: string = '';
  selectedType: string = "course";
  biometricEnable: string = "0";
  newMessageText: string = "";
  messageCount: number = 0;

  courseCommonExamCancelPopUP = false;

  isCourseAttendance: boolean = false;
  isCourseCancel: boolean = false;
  isCourseReminder: boolean = false;
  showTopicList: boolean = false;
  showExpenseToDo: boolean = false;
  showToDo: boolean = false;
  showExpenses: boolean = false;
  userTypeForExpenses: boolean = true;
  notificationPopUp: boolean = false;
  addNotification: boolean = false;
  showTableFlag: boolean = false;
  showEmailSubject: boolean = false;
  studentSelected: boolean = false;
  public isPopupOpened: boolean = false;
  public isAttendancePop: boolean = false;
  public isCancelExamPop: boolean = false;
  public isReminderPop: boolean = false;
  public isReschedulePop: boolean = false;
  public isRippleLoad: boolean = false;
  public AllPresent: boolean = true;
  public isProfessional: boolean = false;
  isSubjectView: boolean = false;
  public schedSelected: boolean = false;
  public isOptionVisible: boolean = false;
  markExamAttendancePopUp: boolean = false;
  examMarksPopup: boolean = false;
  allChecked: boolean = true;
  biometricWidget: boolean;
  cancelExamPopUP: boolean = false;
  viewDetailsPopUp: boolean = false;
  classScheduleCount: number = 0;
  absentCount: number = 0;
  presentCount: number = 0;
  leaveCount: number = 0;
  public selectedRow: number = null;
  jsonFlag: any = {
    smsTabType: 'approved',
    showAllMessage: false,
    openMessageFlag: false,
    editMessage: false,
    messageObject: {}
  };
  timepicker: any = {
    reschedStartTime: {
      hour: '12 PM',
      minute: '00',
      meridian: ''
    },
    reschedEndTime: {
      hour: '1 PM',
      minute: '00',
      meridian: ''
    },
  }
  types: SelectItem[] = [
    { label: 'Course', value: 'course' },
    { label: 'Subject', value: 'subject' }
  ];
  combinedDataRes: any = {};
  sendNotification = {
    standard_id: '-1',
    subject_id: '-1',
    batch_id: '-1',
  }
  sendNotificationCourse = {
    master_course: '',
    course_id: ''
  }
  loginField = {
    checkBox: '0'
  }
  cancelPopUpData = {
    reason: "",
    notify: true
  };

  reminderRemarks: string = '';
  remarksLimit: number = 50;

  /* ===================================================================================== */
  /* ===================================================================================== */
  /* ===================================================================================== */
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private appC: AppComponent,
    private login: LoginService,
    private rd: Renderer2,
    private enquiryService: FetchenquiryService,
    private widgetService: WidgetService,
    private auth: AuthenticatorService,
    private biometric: BiometricStatusServiceService
  ) {
    if (sessionStorage.getItem('userid') == null) {
      this.router.navigate(['/authPage']);
    }
    this.schedDate[0] = new Date();
    this.schedDate[1] = new Date();
  }
  /* ===================================================================================== */
  /* ===================================================================================== */
  /* ===================================================================================== */
  ngOnInit() {

    this.auth.institute_type.subscribe(
      res => {
        if (res == 'LANG') {
          this.isProfessional = true;
        } else {
          this.isProfessional = false;
        }
      }
    )

    this.checkForSubjectWiseView();

    this.biometricEnable = sessionStorage.getItem('biometric_attendance_feature');
    this.examGradeFeature = sessionStorage.getItem('is_exam_grad_feature');
    this.permissionArray = sessionStorage.getItem('permissions');
    let userType: any = Number(sessionStorage.getItem('userType'));
    let username = sessionStorage.getItem('username');
    let permissionArraypermissions: any = [];
    if(userType == 0 && username == "admin"){
      this.userTypeForExpenses = false;
    }
    else if( this.permissionArray && (this.permissionArray.includes("715") || this.permissionArray.includes("716"))){
      this.userTypeForExpenses = false;
    }
    else{
      this.userTypeForExpenses = true;
    }

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

    this.fetchWidgetPrefill();
  }

  checkForSubjectWiseView(){
    let subjectView = sessionStorage.getItem('isSubjectView');
    let scheduleDate = sessionStorage.getItem('scheduleDate');   // For schedule date from session storage
    if(subjectView == 'true'){
      this.onChanged('subject');
      this.schedDate[0] = new Date(scheduleDate);
      this.schedDate[1] = new Date(scheduleDate);
    }
    else if(subjectView == 'false'){
      if(this.isProfessional){
        this.schedDate[0] = new Date(scheduleDate);
        this.schedDate[1] = new Date(scheduleDate);
      }
      else{
        this.courseLevelSchedDate = new Date(scheduleDate);
      }
    }
    sessionStorage.setItem('isSubjectView', '');
    sessionStorage.setItem('scheduleDate', '');
  }


  /* ===================================================================================== */
  /* ===================================================================================== */
  /* ===================================================================================== */
  fetchWidgetPrefill() {
    this.widgetService.getSettings().subscribe(
      res => {
        this.settingInfo = res;
      },
      err => {
      }
    )

    this.widgetService.getAllteachers().subscribe(
      res => {
        this.teacherListArr = res;
      },
      err => {

      }
    )

    this.fetchScheduleWidgetData();

  }

  recieveData(event) {
    if (event.length == 1) {
      this.ref.nativeElement.className = "dataFirst";
    }
    else if (event.length == 0) {
      this.ref.nativeElement.className = "dataZero";
    }
    else if (event.length == 2) {
      this.ref.nativeElement.className = "dataSecond";
    }
    else if (event.length == 3) {
      this.ref.nativeElement.className = "dataThird";
    }
    else {
      this.ref.nativeElement.className = "dataLast";
    }
  }

  fetchScheduleWidgetData() {
    let obj = {
      from_date: moment(this.schedDate[0]).format('YYYY-MM-DD'),
      to_date: moment(this.schedDate[0]).format('YYYY-MM-DD')
    }
    this.getAllExamsAndClass(obj);
    this.widgetService.fetchSchedWidgetData(obj).subscribe(
      res => {
        this.schedStat = res;
        this.grid.refreshItems().layout();
      },
      err => {
        // this.grid.refreshItems().layout();
      });
  }

  getOrder() {
    this.order = this.grid.getItems().map(item => item.getElement().getAttribute('data-id'));
  }

  updateschedByDate(e) {
    let obj = {
      from_date: moment(e).format('YYYY-MM-DD'),
      to_date: moment(e).format('YYYY-MM-DD')
    }
    this.schedDate[0] = moment(e).format('DD MMM YYYY');
    this.schedDate[1] = moment(e).format('DD MMM YYYY');
    this.isOptionVisible = false;
    this.getAllExamsAndClass(obj);
    this.widgetService.fetchSchedWidgetData(obj).subscribe(
      res => {
        this.schedStat = res;
        this.grid.refreshItems().layout();
      },
      err => {
        // this.grid.refreshItems().layout();
      });
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


  openCalendar(id) {
    document.getElementById(id).click();
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



  userScheduleSelected(i, selected) {
    this.selectedRow = i;
    this.classMarkedForAction = selected
  }


  getVisibility(c): boolean {
    let d = moment(c.class_date).format("YYYY-MM-DD");
    if (d >= moment(new Date()).format("YYYY-MM-DD")) {
      return true;
    }
    else {
      return false;
    }
  }



  hideVisibilty() {
    let d = moment(this.courseLevelSchedDate).format("YYYY-MM-DD");
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

  /* ======================================================================================================= */
  /* =================================Attendance PopUP===================================== */
  /* ======================================================================================================= */

  initiateMarkAttendance(i, selected, subject_id, topics_covered) {
    let obj = {
        batch_id: selected.batch_id,
        schd_id: selected.schd_id,
        batch_name: selected.batch_name,
        subject_id: subject_id,
        topics_covered: topics_covered,
        course_name: selected.course_name,
        master_course_name: selected.master_course_name,
        forCourseWise: false,
        forSubjectWise: true,
        isExam: false,
        is_attendance_marked: selected.is_attendance_marked
      }
    let batch_info = JSON.stringify(obj)
    sessionStorage.setItem('batch_info', btoa(batch_info));
    sessionStorage.setItem('isSubjectView', String(this.isSubjectView));
    if(this.isSubjectView || this.isProfessional){
      sessionStorage.setItem('scheduleDate', String(this.schedDate[0]));
    }
    else{
      sessionStorage.setItem('scheduleDate', String(this.courseLevelSchedDate));
    }
    this.router.navigate(['/view/home/mark-attendance']);


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
          // document.getElementById('leaveBtn' + e.student_id).classList.remove('classLeaveBtn');
          // document.getElementById('absentBtn' + e.student_id).classList.remove('classAbsentBtn');
          // document.getElementById('presentBtn' + e.student_id).classList.remove('classPresentBtn');
          // document.getElementById('presentBtn' + e.student_id).classList.add('classPresentBtn');
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
          // document.getElementById('leaveBtn' + e.student_id).classList.remove('classLeaveBtn');
          // document.getElementById('absentBtn' + e.student_id).classList.remove('classAbsentBtn');
          // document.getElementById('presentBtn' + e.student_id).classList.remove('classPresentBtn');
          e.dateLi[0].status = "A";
          e.dateLi[0].home_work_status = "N"
          e.dateLi[0].isStatusModified = "Y"
        }
      });
    }
    this.getCountOfAbsentPresentLeave(this.studentAttList);
  }


  checkIfStudentIsAbsent(data) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].dateLi[0].status == "A") {
        return true;
      }
    }
    return false;
  }

  updateAttendance() {

    if (this.homework != null && this.homework != "") {
      if (this.validateSpecialCharacters(this.homework)) {
        // Do nothing
      } else {
        this.messageNotifier('error', 'Error', 'Special characters are not allowed in homework field');
        return
      }
    }


    let check = this.checkIfStudentIsAbsent(this.studentAttList);
    if (this.settingInfo.sms_absent_notification != 0 && check) {
      if (confirm('Do you want to send SMS Alert to Absent students ?')) {
        this.markAttendanceServerCall("Y");
      } else {
        this.markAttendanceServerCall("N");
      }
    } else {
      this.markAttendanceServerCall("N");
    }


  }

  markAttendanceServerCall(sendSms) {

    this.isRippleLoad = true;
    let arr = [];
    this.studentAttList.forEach(e => {
      let arrDateLi = []; // as per v1 only single dateli array object will send --laxmi
      e.dateLi[0] = Object.assign({}, this.getCustomAttendanceObject(e.dateLi[0], e));
      arrDateLi.push(e.dateLi[0]);
      let temp = {
        batch_id: this.classMarkedForAction.batch_id,
        dateLi: arrDateLi,
        home_work_notifn: e.home_work_notifn,
        isNotify: sendSms,
        is_home_work_enabled: e.is_home_work_enabled,
        student_id: e.student_id.toString(),
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
          body: err.error.message
        }
        this.appC.popToast(msg);
      }
    )
  }

  getCustomAttendanceObject(d, detail): any {
    let obj: any = {
      attendance_note: this.attendanceNote,
      date: d.date,
      home_work_status: d.home_work_status,
      homework_assigned: this.homework,
      isStatusModified: d.isStatusModified,
      is_home_work_status_changed: d.is_home_work_status_changed,
      schId: d.schId,
      status: d.status,
      teacher_id: this.teacher_id,
    }
    if (d.schId) {
      obj['schId'] = d.schId.toString();
    }
    if (this.teacher_id) {
      obj['teacher_id'] = this.teacher_id.toString();
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
    // this.studentAttList[i].dateLi[0].isStatusModified = "Y";
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
    this.isRippleLoad = true;
    this.widgetService.cancelClassSchedule(obj).subscribe(
      res => {
        this.isRippleLoad = false;
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
        this.isRippleLoad = false;
        let msg = {
          type: 'error',
          title: 'Failed To Cancel Schedule',
          body: err.error.message
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
        is_exam_schedule: "N",
        remarks: this.reminderRemarks
      };
      this.isRippleLoad = true;
      this.widgetService.notifyStudentSchedule(obj).subscribe(
        res => {
          this.isRippleLoad = false;
          let msg = {
            type: 'success',
            title: 'Reminder Sent',
            body: 'Students have been notified'
          }
          this.appC.popToast(msg);
          this.closeRemiderClass();
        },
        err => {
          this.isRippleLoad = false;
          let msg = {
            type: 'error',
            title: 'Failed To Notify',
            body: err.error.message
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

    if (this.reschedReason == null || this.reschedReason == "") {
      let msg = {
        type: 'error',
        title: 'Error',
        body: 'Please provide reschedule reason'
      }
      this.appC.popToast(msg);
      return;
    }

    if (moment().format('YYYY-MM-DD') > moment(this.reschedDate).format('YYYY-MM-DD')) {
      let msg = {
        type: 'error',
        title: 'Error',
        body: 'Please provide future reschedule date'
      }
      this.appC.popToast(msg);
      return;
    }

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

      this.isRippleLoad = true;
      this.widgetService.reScheduleClass(obj).subscribe(
        res => {
          this.isRippleLoad = false;
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
          this.isRippleLoad = false;
          let msg = {
            type: 'error',
            title: 'Failed To Reschedule',
            body: err.error.message
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
        hour: '12 PM',
        minute: '00',
        meridian: ''
      },
      reschedEndTime: {
        hour: '1 PM',
        minute: '00',
        meridian: ''
      },
    }
  }

  /* ======================================================================================================= */
  /* =================================Course Level===================================== */
  /* ======================================================================================================= */


  onChanged(e) {
    this.selectedRow = null;
    if (e == 'subject') {
      this.isSubjectView = true;
    }
    else if (e == 'course') {
      this.isSubjectView = false;
      // this.generateCourseLevelWidget();
    }
  }

  generateCourseLevelWidget() {
    this.courseLevelSchedule = [];
    let obj = {
      inst_id: sessionStorage.getItem('institute_id'),
      requested_date: moment(this.courseLevelSchedDate).format("YYYY-MM-DD")
    }
    this.isRippleLoad = true;
    this.widgetService.fetchCourseLevelWidgetData(obj).subscribe(
      res => {
        this.isRippleLoad = false;
        if (this.grid) {
          this.grid.refreshItems().layout();
        }
        let tempArr: any[] = [];
        for (let o in res) {
          let temp = res[o].course_ids.split(',');
          if (temp.length > 1) {
            let length = temp.length;
            let nameArr = res[o].coursee_names.split(',');
            let idArr = res[o].course_ids.split(',');
            let is_attendance_marked = res[o].is_attendance_marked.split(',');
            for (let i = 0; i < length; i++) {
              let tobj = {
                cancel_reason: res[o].cancel_reason,
                course_id: res[o].course_id,
                is_attendance_marked: '',
                course_ids: "",
                coursee_names: "",
                coursesList: res[o].coursesList,
                end_date: res[o].end_date,
                inst_id: res[o].inst_id,
                is_cancel_notify: res[o].is_cancel_notify,
                master_course: res[o].master_course,
                course_name: res[o].coursee_names,
                requested_date: res[o].requested_date,
                standard_id: res[o].standard_id,
                standard_name: res[o].standard_name,
                start_date: res[o].start_date,
                isExam: false
              }
              tobj.is_attendance_marked = is_attendance_marked[i];
              tobj.course_ids = idArr[i];
              tobj.coursee_names = nameArr[i];
              tempArr.push(tobj);
            }
          }
          else {
            tempArr.push(res[o]);
          }
        }
        this.courseLevelSchedule = [];
        if (tempArr.length > 0) {
          this.courseLevelSchedule = tempArr;
        }
        this.generateCourseLevelExam();
      },
      err => {
        this.isRippleLoad = false;
        console.log(err);
        if (this.grid) {
          this.grid.refreshItems().layout();
        }
      }
    );
  }

  updateCourseLevelSched(e) {
    this.generateCourseLevelWidget();
  }

  initiateCourseMarkAttendance(i, selected) {

    let obj = {
        course_id: selected.course_ids,
        startdate: moment(this.courseLevelSchedDate).format("YYYY-MM-DD"),
        batch_name: selected.coursee_names,
        forCourseWise: true,
        forSubjectWise: false,
        course_name: selected.coursee_names,
        master_course_name: selected.master_course,
        isExam: false,
        is_attendance_marked: selected.is_attendance_marked
      }
    let batch_info = JSON.stringify(obj);
    sessionStorage.setItem('batch_info', btoa(batch_info));
    sessionStorage.setItem('isSubjectView', String(this.isSubjectView));
    if(this.isSubjectView || this.isProfessional){
      sessionStorage.setItem('scheduleDate', String(this.schedDate[0]));
    }
    else{
      sessionStorage.setItem('scheduleDate', String(this.courseLevelSchedDate));
    }
    this.router.navigate(['/view/home/mark-attendance']);



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
      requested_date: moment(this.courseLevelSchedDate).format("YYYY-MM-DD")
    }
    this.isRippleLoad = true;
    this.widgetService.cancelCourseSchedule(obj).subscribe(
      res => {
        this.isRippleLoad = false;
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
        this.isRippleLoad = false;
        let msg = {
          type: 'error',
          title: 'Failed To Cancel Schedule',
          body: err.error.message
        }
        this.appC.popToast(msg);
      }
    )
  }

  cancelBatchClass() {
    if (this.cancellationReason == "" || this.cancellationReason == null) {
      let msg = {
        type: 'error',
        title: 'Cancellation Reason',
        body: 'Please provide cancellation reason'
      }
      this.appC.popToast(msg);
      return;
    }
    let obj = {
      batch_id: this.classMarkedForAction.batch_id,
      cancelSchd: this.getCancelReason()
    }
    this.isRippleLoad = true;
    this.widgetService.cancelBatchSchedule(obj).subscribe(
      res => {
        this.isRippleLoad = false;
        let msg = {
          type: 'success',
          title: 'Batch Schedule Cancelled',
          body: 'The requested scheduled has been cancelled'
        }
        this.appC.popToast(msg);
        this.closeCourseCancelClass();
        this.fetchScheduleWidgetData();
      },
      err => {
        this.isRippleLoad = false;
        let msg = {
          type: 'error',
          title: 'Failed To Cancel Schedule',
          body: err.error.message
        }
        this.appC.popToast(msg);
      }
    )
  }

  getCancelReason(): any[] {
    let temp = [];
    let obj = {
      cancel_note: this.cancellationReason,
      is_notified: this.is_notified,
      schd_id: this.classMarkedForAction.schd_id
    }
    temp.push(obj);
    return temp;
  }

  initiateCourseRemiderClass() {
    let obj = {
      course_ids: this.classMarkedForAction.course_ids,
      inst_id: sessionStorage.getItem('institute_id'),
      master_course: this.classMarkedForAction.master_course,
      requested_date: moment(this.courseLevelSchedDate).format("YYYY-MM-DD"),
      remarks: this.reminderRemarks
    }
    this.isRippleLoad = true;
    this.widgetService.remindCourseLevel(obj).subscribe(
      res => {
        this.isRippleLoad = false;
        let msg = {
          type: 'success',
          title: 'Reminder Sent',
          body: 'The student have been notified'
        }
        this.appC.popToast(msg);
        this.reminderRemarks = "";
        this.closeRemiderClass();
      },
      err => {
        this.isRippleLoad = false;
        let msg = {
          type: 'error',
          title: 'Unable to Send Reminder',
          body: err.error.message
        }
        this.appC.popToast(msg);
      }
    )
  }

  closeCourseLevelAttendance() {
    this.isCourseAttendance = false;
  }

  updateCourseAttendance() {

    let isNotify = 'N';
    let checkAbsent = this.checkIfStudentIsAbsent(this.courseLevelStudentAtt);
    if (checkAbsent && this.settingInfo.sms_absent_notification != 0) {
      if (confirm('Do you want to send SMS Alert to Absent students ?')) {
        isNotify = 'Y';
        this.makeServerCallForUpdateMarks(isNotify);
      } else {
        isNotify = "N";
        this.makeServerCallForUpdateMarks(isNotify);
      }
    } else {
      this.makeServerCallForUpdateMarks(isNotify);
    }
  }

  makeServerCallForUpdateMarks(isNotify) {
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
        "isNotify": isNotify,
        "is_home_work_enabled": element.is_home_work_enabled,
      }
      arr.push(temp);
    });
    this.isRippleLoad = true;
    this.widgetService.updateCourseAttendance(arr).subscribe(
      res => {
        this.isRippleLoad = false;
        let msg = {
          type: 'success',
          title: 'Attendance Updated',
          body: res.message
        }
        this.appC.popToast(msg);
        this.closeCourseLevelAttendance();
        this.generateCourseLevelWidget();
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

  getTopicsUpdate() {

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

  markAttendaceHide(row) {
    if (moment(row.class_date) > moment()) {
      return "hide";
    } else {
      return "";
    }
  }

  markAttendaceHideCourse() {
    let date = moment(this.courseLevelSchedDate);
    if (date > moment()) {
      return "hide";
    } else {
      return "";
    }
  }

  getClassStatus(row) {
    let date;
    if (row.isExam) { // if it is exam then we need to use exam date for check exam is today or not and exam is ongoin
      date = row.exam_date;
    }
    else {
      date = row.class_date; // if it is class then we need to use class date for check class is today or not and class is ongoin
    }

    if (date) {
      if (moment(date).format('DD-MM-YYYY') == moment().format('DD-MM-YYYY')) {
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
    return "hide";
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
    if (time == undefined) {
      return ""
    }
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
    if (event.target.innerText == "L") {
      rowData.dateLi[0].status = "L";
      rowData.dateLi[0].home_work_status = "N";
    } else if (event.target.innerText == "A") {
      rowData.dateLi[0].status = "A";
      rowData.dateLi[0].home_work_status = "N";
    } else {
      rowData.dateLi[0].status = "P";
      rowData.dateLi[0].home_work_status = "Y";
    }
    rowData.dateLi[0].isStatusModified = "Y";
    this.getCountOfAbsentPresentLeave(this.studentAttList);
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

  messageSubject: any = "";
  messageArea: any = "";

  closeNotificationPopUp() {
    this.notificationPopUp = false;
    this.addNotification = false;
    this.showTableFlag = false;
    this.showEmailSubject = false;
    this.messageSubject = "";
    this.messageArea = "";
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
        //console.log(res);
        this.masterCourseList = res;
      },
      err => {
        this.isRippleLoad = false;
        //console.log(err);
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
          //console.log(err);
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
          this.allChecked = true;
          this.isRippleLoad = false;
          this.showTableFlag = true;
          this.selectedOption = "filter";
          this.studentList = this.addKeys(res, true);
        },
        err => {
          this.isRippleLoad = false;
          //console.log(err);
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
        //console.log(err);
      }
    )
  }

  addNewNotification() {
    this.addNotification = true;
  }

  hasUnicode (str) {
    for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 127) return true;
    }
    return false;
  }
  countNumberOfMessage(){
    let uniCodeFlag = this.hasUnicode(this.newMessageText);
    let charLimit = 160;
    if(uniCodeFlag){
      charLimit = 70
    }
    if(this.newMessageText.length == 0){
      this.messageCount = 0;
    }
    else if(this.newMessageText.length > 0 && this.newMessageText.length <= charLimit){
      this.messageCount = 1;
    }
    else{
      let count = Math.ceil(this.newMessageText.length / charLimit);
      console.log(count);
      this.messageCount = count;
    }
  }

  saveNewMessage() {
    let obj = { message: this.newMessageText };
    this.widgetService.saveMessageTOServer(obj).subscribe(
      res => {
        let msg = {
          type: 'success',
          title: 'Message created Successfully',
          body: " Your request is in queue and process shortly"
        };
        this.appC.popToast(msg);
        this.closeNewMessageDiv();
        this.onTabChange(this.jsonFlag.smsTabType);// as per view it get the sms data --laxmi
      },
      err => {
        //console.log(err);
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
    this.messageCount = 0;
    this.jsonFlag.editMessage = false;
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
    document.getElementById('sendToHead').classList.remove('hide');
    document.getElementById('chkbxEmailSend').checked = false;
    document.getElementById('sendLoginChkbx').checked = false;
    this.showEmailSubject = false;
    if (div == "divSendMessage") {
      this.showViewContent();
      this.getAllMessageFromServer();
      document.getElementById('divDeliveryMode').classList.remove('remove');
      document.getElementById('divDeliveryMode').classList.add('show');
      document.getElementById('divLoginMode').classList.remove('show');
      document.getElementById('divLoginMode').classList.add('hide');
      document.getElementById('liAdd').classList.remove('hide');
      document.getElementById('chkbxEmailSend').checked = false;
      if (document.getElementById('chkBoxTutorSelection').checked) {
        document.getElementById('divParentOrGaurdian').classList.add('hide');
        document.getElementById('sendToHead').classList.add('hide');
      } else {
        document.getElementById('divParentOrGaurdian').classList.remove('hide');
        document.getElementById('sendToHead').classList.remove('hide');
      }
      if (this.selectedOption != "filter") {
        this.whichCheckBoxSelected();
      }
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
    this.sendNotification.subject_id = '-1';
    this.sendNotification.batch_id = '-1';
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
    if (this.sendNotification.batch_id == "-1") {
      this.showTableFlag = false;
    } else {
      this.widgetService.fetchStudentListData(this.sendNotification.batch_id).subscribe(
        res => {
          this.showTableFlag = true;
          this.studentList = this.addKeys(res, true);
          this.selectedOption = "filter";
        },
        err => {
          //console.log(err);
        }
      )
    }
  }


  onCheckBoxEvent(event, row) {
    row.assigned = event;
    this.allChecked = this.checkCheckAllChkboxStatus();
  }

  checkCheckAllChkboxStatus() {
    for (let i = 0; i < this.studentList.length; i++) {
      if (this.studentList[i].assigned == false) {
        return false;
      }
    }
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
    this.searchData = "";
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
      this.allChecked = true;
      this.clearCheckBoxSelction(event.target.id);
      this.isRippleLoad = true;
      this.studentList = [];
      this.widgetService.getAllActiveStudentList().subscribe(
        res => {
          this.isRippleLoad = false;
          if (document.getElementById('chkBoxActiveSelection').checked) {
            this.showTableFlag = true;
            this.studentList = this.addKeys(res, true);
          }
        },
        err => {
          this.isRippleLoad = false;
          //console.log(err);
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
      this.allChecked = true;
      this.clearCheckBoxSelction(event.target.id);
      this.isRippleLoad = true;
      this.studentList = [];
      this.widgetService.getAllTeacherList().subscribe(
        res => {
          this.isRippleLoad = false;
          if (document.getElementById('chkBoxTutorSelection').checked) {
            this.showTableFlag = true;
            this.studentList = this.addKeys(res, true);
          }
        },
        err => {
          this.isRippleLoad = false;
          //console.log(err);
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
      this.allChecked = true;
      this.clearCheckBoxSelction(event.target.id);
      this.isRippleLoad = true;
      this.studentList = [];
      this.widgetService.getAllInActiveList().subscribe(
        res => {
          this.isRippleLoad = false;
          if (document.getElementById('chkBoxInActiveSelection').checked) {
            this.showTableFlag = true;
            this.studentList = this.addKeys(res, true);
          }
        },
        err => {
          this.isRippleLoad = false;
          //console.log(err);
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
      this.allChecked = true;
      this.clearCheckBoxSelction(event.target.id);
      this.isRippleLoad = true;
      this.studentList = [];
      this.widgetService.getAllAluminiList().subscribe(
        res => {
          this.isRippleLoad = false;
          if (document.getElementById('chkBoxAluminiSelection').checked) {
            this.showTableFlag = true;
            this.studentList = this.addKeys(res, true);
          }
        },
        err => {
          this.isRippleLoad = false;
          //console.log(err);
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
    this.jsonFlag.showAllMessage = true;
    this.widgetService.getMessageList({ status: 1 }).subscribe(
      res => {
        //console.log(res);
        this.messageList = this.addKeys(res, false);
      },
      err => {
        //console.log(err);
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

  getSubject() {
    let text = this.messageSubject;
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

  getMessageText() {
    let text = this.messageArea;
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

  validateAllFields() {
    if (this.showEmailSubject) {
      return this.getSubject();
    }

    if (this.selectedOption == "showTextBox") {
      return this.getMessageText();
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
    } else if (student == false && parent == false && gaurdian == true) {
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
    let check = this.validateAllFields();
    if (check === false) {
      return;
    }
    if (this.selectedOption == "showTextBox") {
      messageSelected = { message: this.getMessageText(), messageId: -1 };
      configuredMessage = false;
      check = this.getSubject();
    } else {
      messageSelected = this.getNotificationMessage();
      configuredMessage = true;
    }
    if (messageSelected === false) {
      return
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
    let studentID: any;
    let isTeacherSMS: number = 0;
    if (this.selectedOption == "showTutor") {
      studentID = this.getListOfIds('teacher_id');
      isTeacherSMS = 1;
      destination = 0;
    } else {
      studentID = this.getListOfIds('student_id');
    }
    let isAlumini = 0;
    if (document.getElementById('chkBoxAluminiSelection').checked) {
      isAlumini = 1;
    }

    let obj = {
      delivery_mode: Number(delivery_mode),
      notifn_message: messageSelected.message,
      notifn_subject: check,
      destination: Number(destination),
      student_ids: studentID,
      cancel_date: '',
      isEnquiry_notifn: 0,
      isAlumniSMS: isAlumini,
      isTeacherSMS: isTeacherSMS,
      configuredMessage: configuredMessage,
      message_id: messageSelected.messageId
    }

    this.widgetService.sendNotification(obj).subscribe(
      res => {
        let msg = {
          type: 'success',
          title: 'Message',
          body: "Send Successfully"
        };
        this.appC.popToast(msg);
        this.closeNotificationPopUp();
      },
      err => {
        //console.log(err);
        let msg = {
          type: 'error',
          title: 'Error',
          body: err.error.message
        };
        this.appC.popToast(msg);
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
        //console.log(res);
        let msg = {
          type: 'success',
          title: 'Message',
          body: "Send Successfully"
        };
        this.appC.popToast(msg);
      },
      err => {
        //console.log(err);
        let msg = {
          type: 'error',
          title: 'Error',
          body: err.error.message
        };
        this.appC.popToast(msg);
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
      };
      obj.studentArray = obj.studentArray.split(",");
      obj.userArray = obj.userArray.split(",");
      this.widgetService.smsForAddDownload(obj).subscribe(
        res => {
          let msg = {
            type: 'success',
            title: 'Message',
            body: "Send Successfully"
          };
          this.appC.popToast(msg);
        },
        err => {
          //console.log(err);
          let msg = {
            type: 'error',
            title: 'Error',
            body: err.error.message
          };
          this.appC.popToast(msg);
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


  /// View Details PopUp

  viewClassDetails(index, data) {
    this.selectedViewDet = data;
    this.viewDetailsPopUp = true;
    this.getDetailOfMasterCourse(data);
  }

  closeViewDetailsPopUp() {
    this.viewDetailsPopUp = false;
    this.viewDetTable = [];
  }

  getDetailOfMasterCourse(data) {
    this.viewDetTable = [];
    let obj = {
      course_id: data.course_ids,
      master_course: data.master_course,
      requested_date: moment(this.courseLevelSchedDate).format("YYYY-MM-DD"),
    }
    this.widgetService.getMasterCourseDetails(obj).subscribe(
      (res: any) => {
        if (res.coursesList[0].courseClassSchdList.length > 0) {
          let arr = this.constructJSONForTable(res);
          this.viewDetTable = this.makeJsonTable(arr);
        }
      },
      err => {
        //console.log(err);
      }
    )
  }

  makeJsonTable(data) {
    for (let i = 0; i < data.length; i++) {
      for (let t = 0; t < this.teacherListArr.length; t++) {
        if (data[i].teacher_id == this.teacherListArr[t].teacher_id) {
          data[i].teacher_name = this.teacherListArr[t].teacher_name;
        }
      }
    }
    return data;
  }


  constructJSONForTable(data) {
    let courseScheduleList = [];
    let batchesList = [];
    let arr: any = [];
    batchesList = data.coursesList[0].batchesList;
    if (data.coursesList[0].courseClassSchdList != null) {
      courseScheduleList = data.coursesList[0].courseClassSchdList;
      for (let i = 0; i < courseScheduleList.length; i++) {
        for (let j = 0; j < batchesList.length; j++) {
          if (courseScheduleList[i].batch_id == batchesList[j].batch_id) {
            let obj: any = {};
            obj.class_schedule_id = courseScheduleList[i].class_schedule_id;
            obj.custom_class_type = courseScheduleList[i].custom_class_type;
            obj.start_time = courseScheduleList[i].start_time;
            obj.end_time = courseScheduleList[i].end_time;
            obj.subject_name = courseScheduleList[i].subject_name;
            obj.subject_id = courseScheduleList[i].subject_id;
            obj.teacher_id = courseScheduleList[i].alloted_teacher_id;
            obj.batch_id = courseScheduleList[i].batch_id;
            obj.class_desc = courseScheduleList[i].class_desc;
            obj.room_no = courseScheduleList[i].room_no;
            obj.course_id = data.coursesList[0].course_id;
            obj.start_date = data.coursesList[0].start_date;
            obj.end_date = data.coursesList[0].end_date;
            arr.push(obj);
          }
        }
      }
    }
    return arr;
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
    switch (event.target.innerText) {
      case "L": {
        this.courseLevelStudentAtt[index].dateLi[0].status = "L";
        this.courseLevelStudentAtt[index].dateLi[0].home_work_status = "N";
        this.courseLevelStudentAtt[index].dateLi[0].isStatusModified = "Y";
        break;
      }
      case "A": {
        this.courseLevelStudentAtt[index].dateLi[0].status = "A";
        this.courseLevelStudentAtt[index].dateLi[0].home_work_status = "N";
        this.courseLevelStudentAtt[index].dateLi[0].isStatusModified = "Y";
        break;
      }
      default: {
        this.courseLevelStudentAtt[index].dateLi[0].status = "P";
        this.courseLevelStudentAtt[index].dateLi[0].isStatusModified = "Y";
        this.courseLevelStudentAtt[index].dateLi[0].home_work_status = "Y";
      }
    }

    this.getTotalCountForCourse(this.courseLevelStudentAtt);
  }

  checkRoleMAnagement(id) {
    let userType: any = Number(sessionStorage.getItem('userType'));
    if (userType != 3) {
      let permissionArray = sessionStorage.getItem('permissions');
      if (permissionArray == "" || permissionArray == null) {
        return false;
      } else {
        let data = JSON.parse(this.permissionArray);
        if (id != "" && data != null && data != "") {
          if (data.includes(id)) {
            return false;
          }
          else
            return true;
        }
        return true;
      }
    } else {
      return true;
    }
  }

  ////Exam Schedule Section

  getAllExamsAndClass(obj) {
    this.schedStat = [];
    this.isRippleLoad = true;
    this.widgetService.fetchSchedWidgetData(obj).subscribe(data => {
      this.isRippleLoad = false;
      this.schedStat = data;
      if (this.isProfessional) {
        this.getExamSchedule(obj);
        this.addKeyInData(this.schedStat.otherSchd, "isExam", false);
      }
      this.classScheduleCount = this.schedStat.otherSchd.length;
    }, err => {
      this.isRippleLoad = false;
      this.classScheduleCount = 0;
      console.log(err);
      if (this.isProfessional) {
        this.getExamSchedule(obj);
      }
    })
    if (this.grid) {
      this.grid.refreshItems().layout();
    }
  }

  mouseEnter(div: string) {
    this.biometricWidget = true;
    console.log("mouse enter : " + div);
  }

  mouseLeave(div: string) {
    this.biometricWidget = false;
    console.log('mouse leave :' + div);
  }

  getExamSchedule(obj) {
    this.widgetService.getExamSchedule(obj).subscribe(
      (res: any) => {
        this.addKeyInData(res.otherSchd, "isExam", true);
        let result = this.schedStat.otherSchd.concat(res.otherSchd);
        this.schedStat.otherSchd = this.sortDataByDateTime(result);
        this.classScheduleCount = this.schedStat.otherSchd.length;
      },
      err => {
        // console.log(err);
      }
    )
  }

  sortDataByDateTime(data) {
    let arr: any = data;
    this.addKeyInData(arr, 'timeStamp', '');
    arr.map(element => {
      let hr = element.start_time.split(':')[0] + " " + element.start_time.split(':')[1].split(' ')[1];
      let min = element.start_time.split(':')[1].split(' ')[0];
      let t: any;
      if (element.isExam) {
        t = moment(element.exam_date).format('YYYY-MM-DD') + " " + this.convertToFullTimeFormat(hr, min);
      } else {
        t = moment(element.class_date).format('YYYY-MM-DD') + " " + this.convertToFullTimeFormat(hr, min);
      }
      element.timeStamp = moment(t, "YYYY-MM-DD HH:mm");
    });
    arr.sort(function (a, b) {
      return moment(a.timeStamp).unix() - moment(b.timeStamp).unix();
    })
    return arr;
  }

  convertToFullTimeFormat(hr, min) {
    let result: any = "";
    let hour: any;
    let time = hr.split(' ');
    if (time[1] == "AM") {
      if (time[0] == "12") {
        hour = "00";
      } else {
        hour = time[0];
      }
      result = hour + ":" + min;
      return result;
    } else {
      if (time[0] != "12") {
        hour = Number(time[0]) + 12;
      } else {
        hour = Number(time[0]);
      }
      result = hour + ":" + min;
      return result;
    }
  }

  addKeyInData(data, keyname, value) {
    if (data.length > 0) {
      data.forEach(element => {
        element[keyname] = value;
      });
    }
  }


  //Attendance Section

  markExamAttendance(i, selected, subject_id, topics_covered) {
    let obj = {
      batch_id: selected.batch_id,
      schd_id: selected.schd_id,
      batch_name: selected.batch_name,
      topics_covered: topics_covered,
      course_name: selected.standard_name,
      master_course_name: selected.batch_name,
      subject_id: subject_id,
      forCourseWise: true,
      forSubjectWise: false,
      isExam: true,
      is_attendance_marked: selected.is_attendance_marked
    }
    let batch_info = JSON.stringify(obj);
    sessionStorage.setItem('batch_info', btoa(batch_info));
    sessionStorage.setItem('isSubjectView', String(this.isSubjectView));
    if(this.isSubjectView || this.isProfessional){
      sessionStorage.setItem('scheduleDate', String(this.schedDate[0]));
    }
    else{
      sessionStorage.setItem('scheduleDate', String(this.courseLevelSchedDate));
    }
    this.router.navigate(['/view/home/mark-attendance']);
  }

  closeExamAttendance() {
    this.tempData = "";
    this.markExamAttendancePopUp = false;
    this.attendanceNote = "";
  }

  getStudentList() {
    let obj = {
      attendanceSchdId: this.tempData.schd_id,
      batch_id: this.tempData.batch_id
    }
    this.widgetService.fetchStudentList(obj).subscribe(
      (res: any) => {
        this.studentList = res;
        this.getTotalCountForCourse(res);
        if (res.length > 0) {
          this.attendanceNote = res[0].dateLi[0].attendance_note;
        } else {
          this.attendanceNote = "";
        }
      },
      err => {
        //console.log(err);
        this.messageNotifier('error', 'Error', err.error.message);
      }
    )
  }

  checkCheckAllChkboxStatusExam() {
    let check = false;
    for (let i = 0; i < this.studentList.length; i++) {
      if (this.studentList[i].dateLi[0].status == "P") {
        check = true;
      } else {
        check = false;
        break;
      }
    }
    return check;
  }

  markAllPresentExam(e) {
    if (e.target.checked) {
      this.studentList.forEach(e => {
        if (e.dateLi[0].status == "L" && e.dateLi[0].isStatusModified == "N") {
          //Do Nothing
        } else {
          // document.getElementById('leaveBtnCourse' + e.student_id).classList.remove('classLeaveBtn');
          // document.getElementById('absentBtnCourse' + e.student_id).classList.remove('classAbsentBtn');
          // document.getElementById('presentBtnCourse' + e.student_id).classList.remove('classPresentBtn');
          // document.getElementById('presentBtnCourse' + e.student_id).classList.add('classPresentBtn');
          e.dateLi[0].status = "P";
          e.dateLi[0].isStatusModified = "Y";
        }
      });
    }
    else {
      this.studentList.forEach(e => {
        if (e.dateLi[0].status == "L" && e.dateLi[0].isStatusModified == "N") {
          //Do Nothing
        } else {
          // document.getElementById('leaveBtnCourse' + e.student_id).classList.remove('classLeaveBtn');
          // document.getElementById('absentBtnCourse' + e.student_id).classList.remove('classAbsentBtn');
          // document.getElementById('presentBtnCourse' + e.student_id).classList.remove('classPresentBtn');
          e.dateLi[0].status = "A";
          e.dateLi[0].isStatusModified = "Y";
        }
      });
    }
    this.getTotalCountForCourse(this.studentList);
  }

  markAttendaceExam(event, rowData, index) {
    if (event.target.innerText == "L") {
      this.studentList[index].dateLi[0].status = "L";
      this.studentList[index].dateLi[0].isStatusModified = "Y";
    } else if (event.target.innerText == "A") {
      this.studentList[index].dateLi[0].status = "A";
      this.studentList[index].dateLi[0].isStatusModified = "Y";
    } else {
      this.studentList[index].dateLi[0].status = "P";
      this.studentList[index].dateLi[0].isStatusModified = "Y";
    }
    this.getTotalCountForCourse(this.studentList);
  }

  getDisabilityExam(s): boolean {
    if (s.dateLi[0].status == "L" && s.dateLi[0].isStatusModified == "N") {
      return true;
    }
    else {
      return false;
    }
  }

  // Batch Section
  updateCourseAttendanceExam() {
    let absectCount = 0;
    this.studentList.forEach(element => {
      element.dateLi.forEach(obj => {
        if (obj.status == "A") {
          absectCount++;
        }
      });
    });
    if (this.settingInfo.sms_absent_notification != 0 && absectCount) {
      if (confirm('Do you want to send SMS Alert to Absent students ?')) {
        this.updateAttendancetoServer("Y");
      } else {
        this.updateAttendancetoServer("N");
      }
    } else {
      this.updateAttendancetoServer("N");
    }
  }

  updateAttendancetoServer(notify) {
    let dataToSend = this.makeJsonForAttendceMark(notify);
    this.widgetService.markAttendance(dataToSend).subscribe(
      res => {
        this.messageNotifier('success', 'Attendance Marked', 'Attendance Marked Successfully');
        this.fetchScheduleWidgetData();
        this.closeExamAttendance();
      },
      err => {
        //console.log(err);
        this.messageNotifier('error', 'Error', err.error.message);
      }
    )
  }

  makeJsonForAttendceMark(notify) {
    let obj: any = [];
    for (let i = 0; i < this.studentList.length; i++) {
      let test: any = {};
      test.batch_id = this.tempData.batch_id;
      test.isNotify = notify;
      test.student_id = this.studentList[i].student_id;
      test.dateLi = [{
        date: this.studentList[i].dateLi[0].date,
        status: this.studentList[i].dateLi[0].status,
        isStatusModified: this.studentList[i].dateLi[0].isStatusModified,
        attendance_note: this.attendanceNote,
        schId: this.studentList[i].dateLi[0].schId.toString()
      }]
      obj.push(test);
    }
    return obj;
  }

  // Cancel Exam Section

  onCancelExamClick(data) {
    this.cancelExamPopUP = true;
    this.tempData = data;
  }

  closeExamPopup() {
    this.cancelExamPopUP = false;
    this.tempData = "";
    this.cancelPopUpData = {
      reason: "",
      notify: true
    }
  }


  // Lang Model
  cancelExamClassSchedule() {
    if (this.cancelPopUpData.reason.trim() == "" || null) {
      this.messageNotifier('error', 'Error', 'Please provide cancellation reason');
      return;
    }
    let notify: any = "";
    if (this.cancelPopUpData.notify) {
      notify = "Y";
    } else {
      notify = "N";
    }
    let obj: any = {
      batch_id: this.tempData.batch_id,
      exam_freq: "OTHER",
      cancelSchd: [{
        schd_id: this.tempData.schd_id,
        exam_desc: this.cancelPopUpData.reason,
        is_notified: notify
      }]
    }
    this.isRippleLoad = true;
    this.widgetService.cancelExamSchedule(obj).subscribe(
      res => {
        this.isRippleLoad = false;
        this.messageNotifier('success', 'Successfully Cancelled', 'Exam Schedule Cancelled Successfully');
        this.fetchScheduleWidgetData();
        this.closeExamPopup();
      },
      err => {
        this.isRippleLoad = false;
        //console.log(err);
        this.messageNotifier('error', 'Error', err.error.message);
      }
    )
  }

  // Notify Function ////

  notifyExamSchedule(i, data) {
    if (confirm('Are you sure u want to send Exam Schedule SMS to the batch?')) {
      this.isRippleLoad = true;
      this.widgetService.notifyStudentExam(data.schd_id).subscribe(
        res => {
          this.isRippleLoad = false;
          this.messageNotifier('success', 'Notified', 'Notification Sent Successfully');
        },
        err => {
          this.isRippleLoad = false;
          //console.log(err);
        }
      )
    }

  }

  // Send Reminder ///

  sendReminderForCourse(data) {
    if (confirm('Are you sure, You want to notify?')) {
      let obj = {
        course_exam_schedule_id: data.course_exam_schedule_id,
        course_id: data.course_id,
        requested_date: moment(data.course_exam_date).format('YYYY-MM-DD')
      }
      this.isRippleLoad = true;
      this.widgetService.sendReminder(obj).subscribe(
        res => {
          this.isRippleLoad = false;
          this.messageNotifier('success', 'Reminder Sent', 'Reminder Sent Successfull');
        },
        err => {
          this.isRippleLoad = false;
          console.log(err);
          this.messageNotifier('error', 'Error', err.error.message);
        }
      )
    }
  }

  // Exam Marks Update

  examMarksUpdate(data) {
    let obj = {
        data: data
      }
    let exam_info = JSON.stringify(obj)
    sessionStorage.setItem('exam_info', btoa(exam_info));
    sessionStorage.setItem('isSubjectView', String(this.isSubjectView));
    if(this.isSubjectView || this.isProfessional){
      sessionStorage.setItem('scheduleDate', String(this.schedDate[0]));
    }
    else{
      sessionStorage.setItem('scheduleDate', String(this.courseLevelSchedDate));
    }
    this.router.navigate(['/view/home/exam-marks-batch']);
  }

  closeExamMarks() {
    this.tempData = "";
    this.examMarksPopup = false;
  }

  getAllExamGrades() {
    this.widgetService.getExamGrades().subscribe(
      res => {
        this.gradesList = res;
      },
      err => {
        //console.log(err);
      }
    )
  }

  fetchStudentDetails(data) {
    this.widgetService.fetchStudentExamDetails(data.batch_id, data.schd_id).subscribe(
      (res: any) => {
        this.examData = res;
        this.studentList = this.addKeys(res.studLi, false);
      },
      err => {
        //console.log(err);
        this.messageNotifier('error', 'Error', err.error.message);
      }
    )
  }

  checkForMArks() {
    let check = false;
    for (let i = 0; i < this.studentList.length; i++) {
      if (this.studentList[i].assigned == true) {
        check = true;
      } else {
        check = false;
        break;
      }
    }
    return check;
  }

  markAllCheckBoxClick(event) {
    this.studentList.forEach(element => {
      element.assigned = event.target.checked;
    });
  }

  markSheetExam(event, data) {
    if (event.target.innerText == "L") {
      data.attendance = "L";
      data.isAttendanceUpdated = "Y";
      if (this.examGradeFeature == 1) {
        data.grade_id = "-1";
      }
    } else if (event.target.innerText == "A") {
      data.attendance = "A";
      data.isAttendanceUpdated = "Y";
      if (this.examGradeFeature == 1) {
        data.grade_id = "-1";
      }
    } else {
      data.attendance = "P";
      data.isAttendanceUpdated = "Y";
    }
  }

  updateMarksOnServer(sendSms) {
    let dataToSend = this.makeJsonForMarks(sendSms);
    if (dataToSend.studLi.length == 0) {
      this.messageNotifier('error', 'Error', 'Please Select Student');
      return;
    }
    if (dataToSend == false) {
      return;
    }
    this.widgetService.updateAttendanceDetails(dataToSend).subscribe(
      res => {
        this.messageNotifier('success', "Marks Updated", 'Marks Updated Successfully');
        this.fetchScheduleWidgetData();
        this.closeExamMarks();
      },
      err => {
        //console.log(err);
        this.messageNotifier('error', 'Error', err.error.message);
      }
    )
  }

  makeJsonForMarks(sendSms) {
    let arr: any = {};
    arr.schd_id = this.examData.schd_id;
    arr.batch_id = this.examData.batch_id;
    arr.isStudentExamSMS = sendSms;
    arr.studLi = [];
    for (let i = 0; i < this.studentList.length; i++) {
      if (this.studentList[i].assigned) {
        let student: any = {};
        student.student_id = this.studentList[i].student_id;
        student.marks_obtained = this.studentList[i].marks_obtained;
        student.student_exam_det_id = this.studentList[i].student_exam_det_id;
        student.previous_marks_obtained = this.studentList[i].previous_marks_obtained;
        if (sendSms == "Y") {
          student.isUpdated = "Y";
        } else {
          student.isUpdated = this.studentList[i].isUpdated;
        }
        student.attendance = this.studentList[i].attendance;
        student.isAttendanceUpdated = this.studentList[i].isAttendanceUpdated;
        student.grade_id = this.studentList[i].grade_id;
        if (this.examData.is_exam_grad_feature == 0) {
          if (student.marks_obtained > this.examData.total_marks) {
            this.messageNotifier('error', 'Error', 'Please check marks you have provided');
            return false;
          } else {
            if (this.studentList[i].attendance == 'P') {
              student.marks_obtained = this.studentList[i].marks_obtained;
            } else {
              student.marks_obtained = '0';
            }
          }
        }
        arr.studLi.push(student);
      }
    }
    return arr;
  }

  messageNotifier(type, title, msg) {
    let data = {
      type: type,
      title: title,
      body: msg
    }
    this.appC.popToast(data);
  }

  hideFutureExamSchedule(row) {
    if (moment(row.exam_date) > moment()) {
      return "hide";
    } else {
      return "";
    }
  }

  /// Course Level Exam Schedule For Course Model

  courseExamAttPopup: boolean = false;
  courseExamMarkPopup: boolean = false;

  generateCourseLevelExam() {
    let obj = {
      start_date: moment(this.courseLevelSchedDate).format('YYYY-MM-DD'),
      end_date: moment(this.courseLevelSchedDate).format('YYYY-MM-DD')
    }
    this.widgetService.getCourseExamFromServer(obj).subscribe(
      (res: any) => {
        let dataArray: any = [];
        res.map(ele => {
          if (ele.batchExamSchdList != null) {
            if (ele.batchExamSchdList.length > 0) {
              ele['isExam'] = true;
              dataArray.push(ele);
            }
          }
        })
        let result = this.courseLevelSchedule.concat(dataArray);
        this.courseLevelSchedule = result;
      },
      err => {
        console.log(err);
      }
    )
  }

  markAttendanceExamCourse(exam) {
    let obj = {
        course_exam_schedule_id: exam.course_exam_schedule_id,
        course_name: exam.course_name,
        master_course_name: exam.master_course,
        batch_name: exam.course_name,
        forCourseWise: true,
        forSubjectWise: false,
        isExam: true,
        schedDate: moment(this.courseLevelSchedDate).format('YYYY-MM-DD'),
        is_attendance_marked: exam.is_attendance_marked
      }
    let batch_info = JSON.stringify(obj);
    sessionStorage.setItem('batch_info', btoa(batch_info));
    sessionStorage.setItem('isSubjectView', String(this.isSubjectView));
    if(this.isSubjectView || this.isProfessional){
      sessionStorage.setItem('scheduleDate', String(this.schedDate[0]));
    }
    else{
      sessionStorage.setItem('scheduleDate', String(this.courseLevelSchedDate));
    }
    this.router.navigate(['/view/home/mark-attendance']);

  }

  getExamStudentList(id) {
    this.isRippleLoad = true;
    this.widgetService.getExamStudentsList(id).subscribe(
      res => {
        this.isRippleLoad = false;
        this.studentList = this.addKeys(res, false);
        if (this.courseExamMarkPopup) {
          this.makeTableHeader();
        }
      },
      err => {
        this.isRippleLoad = false;
        console.log(err);
        this.messageNotifier('error', 'Error', err.error.message);
      }
    )
  }

  markAttendaceExamCourse(event, rowData, index) {
    if (event.target.innerText == "L") {
      this.studentList[index].attendance = "L";
      this.studentList[index].isAttendanceUpdated = "Y";
    } else if (event.target.innerText == "A") {
      this.studentList[index].attendance = "A";
      this.studentList[index].isAttendanceUpdated = "Y";
    } else {
      this.studentList[index].attendance = "P";
      this.studentList[index].isAttendanceUpdated = "Y";
    }
  }

  checkIfStudentIsAbsentForExam(data) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].attendance == "A") {
        return true;
      }
      else {
        return false
      }
    }
  }

  markAttCourseExam() {


    let absectCount = 0;
    this.studentList.forEach(element => {
      if (element.attendance == "A") {
        absectCount++;
      }
    });

    if (this.settingInfo.sms_absent_notification != 0 && absectCount) {

      if (confirm('Do you want to send SMS Alert to Absent students ?')) {
        this.makeServerCallForExamUpdate('Y');
      } else {
        this.makeServerCallForExamUpdate('N');
      }
    } else {
      this.makeServerCallForExamUpdate('N');
    }
  }

  makeServerCallForExamUpdate(notify) {
    let data = this.constructJsonForAttendance(notify);
    if (data.length == 0) {
      this.messageNotifier('error', 'Error', 'Please select student from student list');
      return;
    }
    this.widgetService.markStudentAttendance(data).subscribe(
      res => {
        this.isRippleLoad = false;
        this.messageNotifier('success', 'Marked', 'Attendance Marked Successfully');
        this.closePopUpCommon();
        this.generateCourseLevelWidget();
      },
      err => {
        this.isRippleLoad = false;
        this.messageNotifier('error', 'Error', err.error.message);
      }
    )
  }

  constructJsonForAttendance(absentKey) {
    let arr = [];
    for (let i = 0; i < this.studentList.length; i++) {
      let obj: any = {};
      obj.course_exam_schedule_id = this.studentList[i].course_exam_schedule_id;
      if (this.tempData.course_marks_update_level == '0') {
        obj.course_marks_update_level = '3';// 3 mark attendence  2- coursewisw 1 subject
      } else {
        obj.course_marks_update_level = this.tempData.course_marks_update_level;
      }
      obj.isStudentExamSMS = absentKey;
      obj.batchExamMarksLi = this.makeDataJSON(this.studentList[i].batchExamMarksLi);
      obj.student_course_exam_id = this.studentList[i].student_course_exam_id;
      obj.student_id = this.studentList[i].student_id;
      obj.isOnlineTestUpdate = this.studentList[i].isOnlineTestUpdate;
      obj.attendance = this.studentList[i].attendance;
      obj.isAttendanceUpdated = this.studentList[i].isAttendanceUpdated;
      obj.course_exam_marks_obtained = this.studentList[i].course_exam_marks_obtained;
      if (this.studentList[i].assigned) {
        obj.isUpdated = 'Y';
      } else {
        obj.isUpdated = 'N';
      }
    }
    return arr;
  }

  makeDataJSON(data) {
    let arr = [];
    for (let i = 0; i < data.length; i++) {
      let obj: any = {};
      obj.schd_id = data[i].schd_id;
      obj.student_exam_det_id = data[i].student_exam_det_id;
      obj.marks_obtained = data[i].marks_obtained;
      obj.previous_marks_obtained = data[i].previous_marks_obtained;
      arr.push(obj);
    }
    return arr;
  }

  closePopUpCommon() {
    this.courseExamAttPopup = false;
    this.tempData = "";
    this.studentList = [];
    this.courseExamMarkPopup = false;
    this.subjectList = [];
    this.totalExamMarks = 0;
    this.examMarksLevel = 0;
    this.courseCommonExamCancelPopUP = false;
    this.showReasonSection = "";
    this.courseTempData = '';
  }

  examMarksUpdateCourse(data) {
    let obj = {
        data: data
      }
    let exam_info = JSON.stringify(obj);
    sessionStorage.setItem('exam_info', btoa(exam_info));
    sessionStorage.setItem('isSubjectView', String(this.isSubjectView));
    if(this.isSubjectView || this.isProfessional){
      sessionStorage.setItem('scheduleDate', String(this.schedDate[0]));
    }
    else{
      sessionStorage.setItem('scheduleDate', String(this.courseLevelSchedDate));
    }
    this.router.navigate(['/view/home/exam-marks']);

  }

  subjectList: any = [];
  totalExamMarks: number = 0;
  examMarksLevel: number = 0;

  makeTableHeader() {
    if (this.studentList.length > 0) {
      this.subjectList = this.studentList[0].batchExamMarksLi;
      this.totalExamMarks = this.studentList[0].cours_exam_total_marks;
    } else {
      this.subjectList = [];
      this.totalExamMarks = 0;
    }
  }

  updateMarksOnServerCourse(type) {
    if (this.examMarksLevel == 0 ) {
      this.messageNotifier('error', 'Error', 'Please provide marks updation level');
      return;
    }
    let data: any;
    if (type == 'single') {
      data = this.makeJsonForMarksUpdate();
    } else {
      data = this.fetchAllStudentJson();
    }
    if (data.length == 0) {
      this.messageNotifier('error', 'Error', 'Please select student from student list');
      return;
    }
    if (data == false) {
      return;
    }
    this.widgetService.markStudentMarks(data).subscribe(
      res => {
        this.messageNotifier('success', 'Successfully Saved', 'Marks Saved Successfully');
        this.closePopUpCommon();
        this.generateCourseLevelWidget();
      },
      err => {
        this.messageNotifier('error', 'Error', err.error.message);
      }
    )
  }

  makeJsonForMarksUpdate() {
    let arr = [];
    let notassignCount = 0;
    for (let i = 0; i < this.studentList.length; i++) {
      let obj: any = {};
      obj.course_exam_schedule_id = this.studentList[i].course_exam_schedule_id;
      obj.course_marks_update_level = this.examMarksLevel;
      obj.isStudentExamSMS = 'N'
      obj.batchExamMarksLi = this.makeMarksDataJSON(this.studentList[i].attendance, this.studentList[i].batchExamMarksLi);
      if (obj.batchExamMarksLi == false) {
        return false;
      }
      obj.student_course_exam_id = this.studentList[i].student_course_exam_id;
      obj.student_id = this.studentList[i].student_id;
      if (this.studentList[i].assigned) {
        obj.isUpdated = 'Y';
      } else {
        obj.isUpdated = 'N';
        notassignCount++;
      }
      // obj.isUpdated = this.studentList[i].isUpdated;
      obj.isOnlineTestUpdate = this.studentList[i].isOnlineTestUpdate;
      obj.attendance = this.studentList[i].attendance;
      obj.isAttendanceUpdated = this.studentList[i].isAttendanceUpdated;
      obj.cours_exam_total_marks = this.studentList[i].cours_exam_total_marks;
      if (this.tempData.is_exam_grad_feature == 0) {
        obj.course_exam_marks_obtained = this.studentList[i].course_exam_marks_obtained;
      } else {
        if (this.studentList[i].grade_id == '-1') {
          this.messageNotifier('error', 'Error', 'Please provide total grades');
          return false;
        }
        obj.grade_id = this.studentList[i].grade_id;
      }
      arr.push(obj);
    }
    if (notassignCount == this.studentList.length) {
      arr = [];
    }
    return arr;
  }

  fetchAllStudentJson() {
    let arr = [];
    for (let i = 0; i < this.studentList.length; i++) {
      let obj: any = {};
      obj.course_exam_schedule_id = this.studentList[i].course_exam_schedule_id;
      obj.course_marks_update_level = this.examMarksLevel;
      obj.isStudentExamSMS = 'Y';
      obj.batchExamMarksLi = this.makeMarksDataJSON(this.studentList[i].attendance, this.studentList[i].batchExamMarksLi);
      if (obj.batchExamMarksLi == false) {
        return false;
      }
      obj.student_course_exam_id = this.studentList[i].student_course_exam_id;
      obj.student_id = this.studentList[i].student_id;
      obj.cours_exam_total_marks = this.studentList[i].cours_exam_total_marks;
      obj.isUpdated = 'Y';
      obj.isOnlineTestUpdate = this.studentList[i].isOnlineTestUpdate;
      obj.attendance = this.studentList[i].attendance;
      obj.isAttendanceUpdated = this.studentList[i].isAttendanceUpdated;
      if (this.tempData.is_exam_grad_feature == 0) {
        obj.course_exam_marks_obtained = this.studentList[i].course_exam_marks_obtained;
      } else {
        if (this.studentList[i].grade_id == '-1') {
          this.messageNotifier('error', 'Error', 'Please provide total grades');
          return false;
        }
        obj.grade_id = this.studentList[i].grade_id;
      }
      arr.push(obj);
    }
    return arr;
  }

  makeMarksDataJSON(attendance, data) {
    let arr = [];
    for (let i = 0; i < data.length; i++) {
      let obj: any = {};
      obj.schd_id = data[i].schd_id;
      obj.student_exam_det_id = data[i].student_exam_det_id;
      if (this.tempData.is_exam_grad_feature == 0) {
        obj.marks_obtained = data[i].marks_obtained;
        obj.previous_marks_obtained = data[i].previous_marks_obtained;
      } else {
        obj.grade_id = data[i].grade_id;
        if (obj.grade_id == "-1" && this.examMarksLevel == 1 && attendance == 'P') {
          this.messageNotifier('error', 'Error', 'Please provide grades of subject');
          return false;
        }
      }
      arr.push(obj);
    }
    return arr;
  }

  checkSubjectMarks(student, data, event) {
    let total: number = 0;
    let number = Number(data.marks_obtained);
    if (data.total_marks < number) {
      this.messageNotifier('error', 'Error', 'Please provide mark less than total marks');
      data.marks_obtained = 0;
    } else {
      for (let i = 0; i < student.batchExamMarksLi.length; i++) {
        total = Number(student.batchExamMarksLi[i].marks_obtained) + total;
      }
      student.course_exam_marks_obtained = total;
      student.isUpdated = "Y";
    }
  }

  checkTotalMarks(data, event) {
    let number = Number(data.course_exam_marks_obtained);
    if (data.cours_exam_total_marks < number) {
      this.messageNotifier('error', 'Error', 'Please provide mark less than total marks');
      data.course_exam_marks_obtained = 0;
    }
    data.isUpdated = "Y";
  }

  onRadioButtonSelction() {
    if (this.examMarksLevel == 2) {
      if (this.tempData.is_exam_grad_feature == 1) {
        this.studentList.forEach(element => {
          element.batchExamMarksLi.forEach(ele => {
            ele.grade_id = '-1';
          });
          element.isUpdated = "Y";
        });
      }
    }
  }

  onCancelExamClickCourse(data) {
    this.tempData = data;
    this.courseTempData = data;
    this.courseCommonExamCancelPopUP = true;
  }

  cancelExamCourseWise() {
    this.showReasonSection = "Course";
    this.cancelPopUpData = {
      reason: "",
      notify: true
    };
  }

  cancelSubjectWiseExam(data) {
    this.showReasonSection = "Subject";
    this.tempData = data;
    this.cancelPopUpData = {
      reason: "",
      notify: true
    };
  }

  cancelExamCall() {
    let notify: any;
    if (this.cancelPopUpData.notify) {
      notify = 'Y';
    } else {
      notify = 'N';
    }
    if (this.cancelPopUpData.reason.trim() == "" || null) {
      this.messageNotifier('error', 'Error', 'Please provide reason');
      return false;
    }
    // if (this.showReasonSection == "Course") {
      let obj = {
        cancel_reason: this.cancelPopUpData.reason,
        course_exam_schedule_id: this.tempData.course_exam_schedule_id,
        course_id: this.tempData.course_id,
        is_cancel_notify: notify,
        requested_date: moment(this.tempData.course_exam_date).format('YYYY-MM-DD')
      }
      this.isRippleLoad = true;
      this.widgetService.cancelExamScheduleCourse(obj).subscribe(
        res => {
          this.isRippleLoad = false;
          this.messageNotifier('success', 'Cancelled', 'Exam Cancelled Successfully');
          this.generateCourseLevelWidget();
          this.closePopUpCommon();
        },
        err => {
          this.isRippleLoad = false;
          this.messageNotifier('error', 'Error', err.error.message);
        }
      )
    // } else {
    //   let obj: any = {
    //     batch_id: this.tempData.batch_id,
    //     exam_freq: "OTHER",
    //     cancelSchd: [{
    //       schd_id: this.tempData.schd_id,
    //       exam_desc: this.cancelPopUpData.reason,
    //       is_notified: notify
    //     }]
    //   }
    //   this.isRippleLoad = true;
    //   this.widgetService.cancelExamSchedule(obj).subscribe(
    //     res => {
    //       this.isRippleLoad = false;
    //       this.messageNotifier('success', 'Cancelled', 'Exam Cancelled Successfully');
    //       this.generateCourseLevelWidget();
    //       this.closePopUpCommon();
    //     },
    //     err => {
    //       this.isRippleLoad = false;
    //       this.messageNotifier('error', 'Error', err.error.message);
    //     }
    //   )
    // }
  }


  //SMS Approve AND Reject
  onTabChange(tabname) {
    this.jsonFlag.openMessageFlag = false;
    this.jsonFlag.smsTabType = tabname;
    document.getElementById('approvedSMSTab').classList.remove('active');
    document.getElementById('openSMSTab').classList.remove('active');
    if (tabname == 'approved') {
      this.jsonFlag.showAllMessage = false;
      document.getElementById('approvedSMSTab').classList.add('active');
      this.getAllMessageFromServer();
    } else {
      document.getElementById('openSMSTab').classList.add('active');
      this.getOpenStatusSMS();
    }
  }

  getOpenStatusSMS() {
    this.isRippleLoad = true;
    this.jsonFlag.openMessageFlag = true;
    this.openMessageList = [];
    this.widgetService.getMessageList({}).subscribe(
      res => {
        this.isRippleLoad = false;
        this.openMessageList = res;
      },
      err => {
        this.isRippleLoad = false;
        //console.log(err);
      }
    )
  }

  showApproveButtons(data) {
    let enableApprove = sessionStorage.getItem('allow_sms_approve_feature');
    const permissionArray = sessionStorage.getItem('permissions');
    if (permissionArray == "" || permissionArray == null) {
      if (enableApprove == '1' && data.statusValue == "Open") {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  editSMS(row) {
    this.addNotification = true;
    this.jsonFlag.editMessage = true;
    this.jsonFlag.messageObject = row;
    this.newMessageText = row.message;
    this.messageCount = 1;
  }


  updateMessage() {
    let obj = { message: this.newMessageText };
    this.isRippleLoad=true;
    this.widgetService.changesSMSStatus(obj,this.jsonFlag.messageObject.message_id ).subscribe(
      res => {
        this.isRippleLoad=false;
        let msg = {
          type: 'success',
          title: 'Message updated Successfully',
        };
        this.appC.popToast(msg);
        this.closeNewMessageDiv();
        this.onTabChange(this.jsonFlag.smsTabType);// as per view it get the sms data --laxmi
      },
      err => {
        this.isRippleLoad=false;
        //console.log(err);
        let msg = {
          type: 'error',
          title: 'Failed To Update Message',
          body: err.message
        };
        this.appC.popToast(msg);
      }
    )

  }

  approveRejectSms(data, statusCode) {
    let msg: any = "";
    if (statusCode == 1) {
      msg = "approve";
    } else {
      msg = "deleted";
    }
    if (confirm('Are you sure, You want  to ' + msg + ' the message?')) {
      this.widgetService.changesSMSStatus({ 'status': statusCode }, data.message_id).subscribe(
        res => {
          let msg = {
            type: 'success',
            title: '',
            body: ''
          }
          if (statusCode == 1) {
            msg.title = "SMS Approved"
          } else {
            msg.title = "SMS Deleted";
          }
          this.appC.popToast(msg);
          this.getOpenStatusSMS();
        },
        err => {
          let msg = {
            type: 'error',
            title: 'Error',
            body: err.error.message
          }
          this.appC.popToast(msg);
        }
      )
    }
  }

  validateSpecialCharacters(str) {
    let regex = /[^ a-zA-Z0-9.,]/g;
    if (str.match(regex) == null) {
      return true;
    } else {
      return false;
    }
  }

  onOfLoaderFromTodoList(ev) {
    this.isRippleLoad = ev;
  }

  showList() {
    if (this.showExpenseToDo) {
      this.showExpenseToDo = false;
      if (this.showToDo) {
        this.showToDo = false;
        // Need to call to  to do list destroy function;
      }
      else if (this.showExpenses) {
        this.showExpenses = false;
      }
    }
    else {
      this.showExpenseToDo = true;
    }
  }

  showToDoList() {
    if (this.showToDo) {
      this.showToDo = false;
      // Need to call to  to do list destroy function;
    }
    else {
      this.showToDo = true;
    }
  }

  showExpensesList(){
    if (this.showExpenses) {
      this.showExpenses = false;
    }
    else {
      this.showExpenses = true;
    }
  }

  countRemarksLimit(){
    this.remarksLimit = 50 - this.reminderRemarks.length;
  }

  closeShowList(){
    this.showList();
  }


}
