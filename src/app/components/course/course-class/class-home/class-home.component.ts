import {
  Component, OnInit, ViewChild, Input, Output, EventEmitter, HostListener,
  AfterViewInit, OnDestroy, ElementRef, Renderer2, ChangeDetectionStrategy, ChangeDetectorRef,
  SimpleChanges, OnChanges
} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
import { AppComponent } from '../../../../app.component';
import * as moment from 'moment';
import { MenuItem } from 'primeng/primeng';
import { Pipe, PipeTransform } from '@angular/core';
import { LoginService } from '../../../../services/login-services/login.service';
import { document } from '../../../../../assets/imported_modules/ngx-bootstrap/utils/facade/browser';
import { ColumnSetting } from '../../../shared/custom-table/layout.model';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs';
import 'rxjs/Rx';
import { ClassScheduleService } from '../../../../services/course-services/class-schedule.service';

@Component({
  selector: 'app-class-home',
  templateUrl: './class-home.component.html',
  styleUrls: ['./class-home.component.scss']
})
export class ClassHomeComponent implements OnInit {


  isLangInstitute: boolean = false;
  isRippleLoad: boolean = false;


  fetchMasterCourseModule = {
    master_course: "-1",
    course_id: "-1",
    subject_id: '-1',
    teacher_id: '-1',
  }
  masterCourse: any = [];
  courseList: any = [];
  subjectList: any = [];
  teacherList: any = [];
  timeTableResponse: any = [];
  weekScheduleList: any[] = [];
  showContent: boolean = false;
  currentDate: Date = new Date();
  weekStart: any = moment(this.currentDate).isoWeekday("Monday").format("DD MMMM YYYY");
  weekEnd: any = moment(this.currentDate).isoWeekday("Sunday").format("DD MMMM YYYY");
  reschedulePopUp: boolean = false;
  reschedDate: any = new Date();
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
  reschedReason: any = "";
  resheduleNotified: any = "Y";
  rescheduleDet: any = "";
  hourArr: any[] = ['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  minArr: any[] = ['', '00', '15', '30', '45'];
  meridianArr: any[] = ['', "AM", "PM"];

  constructor
    (
    private router: Router,
    private classService: ClassScheduleService,
    private toastCtrl: AppComponent
    ) {
    if (sessionStorage.getItem('Authorization') == null) {
      this.router.navigate(['/authPage']);
    }
  }

  ngOnInit() {
    this.checkInstituteType();
    this.getPrefillData();
  }

  getPrefillData() {
    this.getMasterCourseList()
    this.getTeachers();
  }

  getMasterCourseList() {
    this.classService.getAllMasterCourse().subscribe(
      res => {
        this.masterCourse = res;
        console.log('master', res);
      },
      err => {
        console.log(err);
      }
    )
  }

  getTeachers() {
    this.isRippleLoad = true;
    this.classService.getAllTeachersList().subscribe(
      res => {
        console.log('teacher', res);
        this.isRippleLoad = false;
        this.teacherList = res;
      },
      err => {
        this.isRippleLoad = false;
      }
    )
  }

  updateCourseList(ev) {
    this.showContent = false;
    this.isRippleLoad = true;
    this.classService.getCourseFromMasterById(ev).subscribe(
      res => {
        if (res.coursesList) {
          console.log("course", res);
          this.courseList = res;
          this.isRippleLoad = false;
        }
        else {
          this.courseList = [];
          this.isRippleLoad = false;
        }
      },
      err => {
        console.log(err);
        this.courseList = [];
        this.isRippleLoad = false;
      }
    )
  }

  updateSubjectList(event) {
    this.showContent = false;
    this.isRippleLoad = true;
    this.classService.getSubjectList(event).subscribe(
      res => {
        this.isRippleLoad = false;
        console.log('Subject', res);
        this.subjectList = res.batchesList;
      },
      err => {
        this.isRippleLoad = false;
        console.log(err);
      }
    )
  }

  getClassList(): any[] {
    let temp: any[] = [];
    for (let key in this.timeTableResponse.batchTimeTableList) {
      let obj = {
        id: key,
        data: this.timeTableResponse.batchTimeTableList[key]
      }
      temp.push(obj);
    }
    console.log(temp);
    return temp;
  }

  toggleTbodyClass(i) {
    debugger
    //console.log('tbodyItem'+i);
    document.getElementById('tbodyItem' + i).classList.toggle("active");
    document.getElementById('tbodyView' + i).classList.toggle("hide");
    //document.getElementById('tbodyItem'+i).classList.toggle('active');
  }

  submitMasterCourse() {

    let data;
    if (this.isLangInstitute) {
      data = this.makeJsonForBatch()
    } else {
      data = this.makeJsonForSubmit();
    }
    this.weekScheduleList = [];
    this.classService.getTimeTable(data).subscribe(
      res => {
        this.messageToast('success', 'Success', 'Success');
        //console.log(res);
        this.timeTableResponse = res;
        this.showContent = true;
        this.weekScheduleList = this.getClassList();
        //console.log(this.timeTableResponse);
      },
      err => {

      }
    )
  }

  makeJsonForSubmit() {
    let obj: any = {};
    obj.batch_id = this.getValueOfKey(this.courseList.coursesList, 'batch_id', this.fetchMasterCourseModule.course_id);
    obj.course_id = this.fetchMasterCourseModule.course_id;
    obj.master_course = this.courseList.master_course;
    obj.subject_id = -1;
    obj.teacher_id = this.fetchMasterCourseModule.teacher_id;
    obj.standard_id = -1;
    obj.isExamIncludedInTimeTable = 'Y';
    obj.startdate = this.getStartDate();
    obj.enddate = this.getEndDate();
    obj.type = 2;
    return obj;
  }

  makeJsonForBatch() {
    let obj: any = {};
    obj.batch_id = null;
    obj.course_id = this.fetchMasterCourseModule.course_id;
    obj.master_course = this.courseList.master_course;
    obj.subject_id = -1;
    obj.teacher_id = this.fetchMasterCourseModule.teacher_id;
    obj.standard_id = -1;
    obj.isExamIncludedInTimeTable = 'Y';
    obj.startdate = this.getStartDate();
    obj.enddate = this.getEndDate();
    obj.type = 2;
    return obj;
  }

  getEndDate(): string {
    let currentDate = moment(this.currentDate).format("YYYY-MM-DD");
    return moment(currentDate).weekday(7).format("YYYY-MM-DD");
  }

  getStartDate(): string {
    let currentDate = moment(this.currentDate).format("YYYY-MM-DD");
    return moment(currentDate).weekday(1).format("YYYY-MM-DD");
  }

  getValueOfKey(data, key, value) {
    for (let t = 0; t < data.length; t++) {
      if (data[t][key] == value) {
        return data[t].batch_id;
      }
    }
  }

  messageToast(errorType, errorTitle, errorMeassage) {
    let data = {
      type: errorType,
      title: errorTitle,
      body: errorMeassage
    }
    this.toastCtrl.popToast(data);
  }

  checkInstituteType() {
    let type: any = sessionStorage.getItem('institute_type');
    if (type == "LANG") {
      this.isLangInstitute = true;
    } else {
      this.isLangInstitute = false;
    }
  }

  gotoPreviousWeek() {
    this.currentDate = new Date(moment(this.currentDate).subtract(7, 'd').format("YYYY-MM-DD"));
    this.weekStart = moment(this.currentDate).isoWeekday("Monday").format("DD MMMM YYYY");
    this.weekEnd = moment(this.currentDate).isoWeekday("Sunday").format("DD MMMM YYYY");
    this.submitMasterCourse();
  }
  /* ============================================================================================ */
  /* ============================================================================================ */
  gotoNextWeek() {
    this.currentDate = new Date(moment(this.currentDate).add(7, 'd').format("YYYY-MM-DD"));
    this.weekStart = moment(this.currentDate).isoWeekday("Monday").format("DD MMMM YYYY");
    this.weekEnd = moment(this.currentDate).isoWeekday("Sunday").format("DD MMMM YYYY");
    this.submitMasterCourse();
  }

  delete(level, index, subIndex) {
    if (level == 'course') {
      console.log(this.weekScheduleList[index]);
      console.log('this has to be deleted');
    }
    else if (level == 'subject') {
      console.log(this.weekScheduleList[index].data[subIndex]);
      console.log('this has to be deleted');
    }
    else if (level == 'batch') { }
  }

  notify(notify) {
    if (confirm("Are you sure, You want to notify?")) {
      let obj = {
        course_ids: this.fetchMasterCourseModule.course_id,
        inst_id: sessionStorage.getItem('institute_id'),
        master_course: this.fetchMasterCourseModule.master_course,
        requested_date: moment(notify.id).format("YYYY-MM-DD")
      }
      this.classService.remindCourseLevel(obj).subscribe(
        res => {
          let msg = {
            type: 'success',
            title: 'Reminder Sent',
            body: 'The student have been notified'
          }
          this.toastCtrl.popToast(msg);
        },
        err => {
          let msg = {
            type: 'error',
            title: 'Unable to Send Reminder',
            body: 'please contact support@proctur.com'
          }
          this.toastCtrl.popToast(msg);
        }
      )
    }
  }

  notifySubjectLevel(rowdata, dateRow) {
    if (confirm("Are you sure, You want to notify?")) {
      let obj: any = {};
      obj.batch_id = rowdata.batch_id;
      obj.class_schedule_id = rowdata.schd_id;
      obj.is_exam_schedule = "N";
      this.classService.sendReminderToServerSubject(obj).subscribe(
        res => {
          console.log(res);
          this.messageToast('success', 'Successfully', 'Notification sent successfully');
        },
        err => {
          console.log(err);
          this.messageToast('error', 'Error', err.error.message);
        }
      )
    };

  }

  rescheduleClassData(rowData) {
    debugger
    this.reschedulePopUp = true;
    this.rescheduleDet = rowData;
  }

  getCheckedStatus(id: string) {
    if (id === "notifyCancel") {
      return true;
    }
    else if (id === 'resheduleNotified') {
      return true;
    }
  }

  closeRescheduleClass() {
    this.reschedulePopUp = false;
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

  notifyRescheduleUpdate(e) {
    if (e.target.checked) {
      this.resheduleNotified = "Y";
    }
    else {
      this.resheduleNotified = "N";
    }
  }


  rescheduleClass() {
    debugger
    if (this.reSheduleFormValid()) {
      let temp1: any = {
        cancel_note: this.reschedReason,
        schd_id: this.rescheduleDet.schd_id,
        is_notified: this.resheduleNotified
      }
      let temp2 = {
        class_date: moment(this.reschedDate).format("YYYY-MM-DD"),
        start_time: this.timepicker.reschedStartTime.hour + ":" + this.timepicker.reschedStartTime.minute + " " + this.timepicker.reschedStartTime.meridian,
        end_time: this.timepicker.reschedEndTime.hour + ":" + this.timepicker.reschedEndTime.minute + " " + this.timepicker.reschedEndTime.meridian,
        duration: this.getDifference()
      }
      let obj = {
        batch_id: this.rescheduleDet.batch_id,
        cancelSchd: [],
        extraSchd: []
      }
      obj.cancelSchd.push(temp1);
      obj.extraSchd.push(temp2);

      this.classService.reScheduleClass(obj).subscribe(
        res => {
          let msg = {
            type: 'success',
            title: 'Class Rescheduled',
            body: 'The request has been processed'
          }
          this.toastCtrl.popToast(msg);
          this.closeRescheduleClass();
        },
        err => {
          let msg = {
            type: 'error',
            title: 'Failed To Reschedule',
            body: err.message
          }
          this.toastCtrl.popToast(msg);
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
          this.toastCtrl.popToast(msg);
          return false;
        }
      }
      else {
        let msg = {
          type: 'error',
          title: 'Reschedule Reason Missing',
          body: 'Please mention a reason for rescheduling the class'
        }
        this.toastCtrl.popToast(msg);
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
      this.toastCtrl.popToast(msg);
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


}
