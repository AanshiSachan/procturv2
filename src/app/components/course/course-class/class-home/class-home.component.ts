import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AppComponent } from '../../../../app.component';
import * as moment from 'moment';
import { ClassScheduleService } from '../../../../services/course-services/class-schedule.service';
import { AuthenticatorService } from '../../../../services/authenticator.service';

@Component({
  selector: 'app-class-home',
  templateUrl: './class-home.component.html',
  styleUrls: ['./class-home.component.scss']
})
export class ClassHomeComponent implements OnInit {

  masterCourse: any = [];
  courseList: any = [];
  subjectList: any = [];
  teacherList: any = [];
  timeTableResponse: any = [];
  weekScheduleList: any[] = [];
  times: any[] = ['', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM', '12 AM'];
  hourArr: any[] = ['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  minArr: any[] = ['', '00', '15', '30', '45'];
  meridianArr: any[] = ['', "AM", "PM"];
  combinedData: any = [];
  batchMasterCourse: any = [];
  subjectListBatch: any = [];
  batchList: any = [];

  showContent: boolean = false;
  isLangInstitute: boolean = false;
  isRippleLoad: boolean = false;
  reschedulePopUp: boolean = false;
  isCourseCancel: boolean = false;
  showManageClass: boolean = false;
  showAdvanceFilter: boolean = false;
  isChecked: boolean = false;

  currentDate: Date = new Date();
  reschedDate: any = new Date();
  weekStart: any = moment(this.currentDate).isoWeekday("Monday").format("DD MMMM YYYY");
  weekEnd: any = moment(this.currentDate).isoWeekday("Sunday").format("DD MMMM YYYY");

  cancellationReason: string = '';
  classMarkedForAction: any = '';
  selectedRadioButton: string = 'All';
  is_notified: any = 'Y';
  allotedTeacher: any = '-1';
  reschedReason: any = "";
  resheduleNotified: any = "Y";
  rescheduleDet: any = "";

  fetchMasterCourseModule = {
    master_course: "-1",
    course_id: "-1",
    subject_id: '-1',
    teacher_id: '-1',
  }
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
  fetchBatchModule = {
    batch_id: null,
    master_course: "",
    course_id: -1,
    subject_id: -1,
    teacher_id: null,
  }
  batchData = {
    standard_id: -1,
    subject_id: -1,
    batch_id: -1,
  }
  advanceFilter: any = {
    startdate: moment().subtract(1, 'months').format('YYYY-MM-DD'),
    enddate: moment().format('YYYY-MM-DD'),
    type: '3',
    isExamIncludedInTimeTable: 'Y'
  }
  selectedArray: any = {
    examSchldId: [],
    classSchldId: []
  };

  constructor
    (
    private router: Router,
    private classService: ClassScheduleService,
    private toastCtrl: AppComponent,
    private auth: AuthenticatorService
    ) {
    if (sessionStorage.getItem('userid') == null) {
      this.router.navigate(['/authPage']);
    }
  }

  ngOnInit() {
    this.checkUserPermission();
    this.checkInstituteType();
    this.getPrefillData();
  }

  checkUserPermission() {
    const permissionArray = sessionStorage.getItem('permissions');
    if (permissionArray == "" || permissionArray == null) {
      this.showManageClass = true;
    } else {
      if (permissionArray != "") {
        if (permissionArray.indexOf('701') != -1) {
          this.showManageClass = true;
        } else {
          this.showManageClass = false;
        }
      }
    }
  }

  getPrefillData() {
    if (this.isLangInstitute) {
      this.submitMasterCourse();
      this.getCombinedData();
    } else {
      this.getMasterCourseList()
    }
    this.getTeachers();
  }

  getCombinedData() {
    this.classService.getCombinedDataFromServer(this.batchData.standard_id, this.batchData.subject_id).subscribe(
      res => {
        //console.log('Combined data', res);
        this.combinedData = res;
        if (res.standardLi != null) {
          this.batchMasterCourse = res.standardLi;
        }
        if (res.subjectLi != null) {
          this.subjectListBatch = res.subjectLi;
        }
        if (res.batchLi != null) {
          this.batchList = res.batchLi;
        }
      },
      err => {
        //console.log(err);
        this.messageToast('error', 'Error', err.error.message);
      }
    )
  }

  getMasterCourseList() {
    this.classService.getAllMasterCourse().subscribe(
      res => {
        this.masterCourse = res;
        //console.log('master', res);
      },
      err => {
        this.messageToast('error', 'Error', err.error.message);
        //console.log(err);
      }
    )
  }

  getTeachers() {
    this.isRippleLoad = true;
    this.classService.getAllTeachersList().subscribe(
      res => {
        //console.log('teacher', res);
        this.isRippleLoad = false;
        this.teacherList = res;
      },
      err => {
        this.isRippleLoad = false;
        this.messageToast('error', 'Error', err.error.message);
      }
    )
  }

  updateCourseList(ev) {
    this.showContent = false;
    this.isRippleLoad = true;
    this.classService.getCourseFromMasterById(ev).subscribe(
      res => {
        if (res.coursesList) {
          //console.log("course", res);
          this.courseList = res;
          this.isRippleLoad = false;
        }
        else {
          this.courseList = [];
          this.isRippleLoad = false;
        }
      },
      err => {
        //console.log(err);
        this.courseList = [];
        this.isRippleLoad = false;
        this.messageToast('error', 'Error', err.error.message);
      }
    )
  }

  updateSubjectList(event) {
    this.showContent = false;
    this.isRippleLoad = true;
    this.classService.getSubjectList(event).subscribe(
      res => {
        this.isRippleLoad = false;
        //console.log('Subject', res);
        this.subjectList = res.batchesList;
      },
      err => {
        this.messageToast('error', 'Error', err.error.message);
        this.isRippleLoad = false;
        //console.log(err);
      }
    )
  }

  getClassList(): any[] {
    let temp: any[] = [];
    let dataList: any = [];
    if (this.isLangInstitute) {
      dataList = this.timeTableResponse.batchTimeTableList;
    } else {
      if (this.showAdvanceFilter) {
        dataList = this.timeTableResponse.batchTimeTableList;
      } else {
        if (this.fetchMasterCourseModule.master_course != "" && this.fetchMasterCourseModule.course_id == "-1" && this.fetchMasterCourseModule.teacher_id == "-1" && this.fetchMasterCourseModule.subject_id == "-1") {
          dataList = this.timeTableResponse[0].batchTimeTableList;
        } else {
          dataList = this.timeTableResponse.batchTimeTableList;
        }
      }
    }
    for (let key in dataList) {
      let arr = [];
      let obj = {
        id: key,
        data: arr
      }
      if (dataList[key].length > 0) {
        let schList = dataList[key];
        schList.map(
          ele => {
            if (ele.class_type != "Exam") {
              ele['selected'] = false;
              ele['date'] = key;
              arr.push(ele);
            }
          }
        )

        // for (let i = 0; i < schList.length; i++) {
        //   schList[i]['selected'] = false;
        //   schList[i]['date'] = key;
        // }
      }
      if (obj.data.length > 0) {
        temp.push(obj);
      }
    }
    return temp;
  }

  toggleTbodyClass(i) {
    document.getElementById('tbodyItem' + i).classList.toggle("active");
    document.getElementById('tbodyView' + i).classList.toggle("hide");
    //document.getElementById('tbodyItem'+i).classList.toggle('active');
  }

  submitMasterCourse() {
    let data;
    if (this.isLangInstitute) {
      let fieldCheck = this.checkFieldFilled();
      if (fieldCheck == false) {
        return;
      }
      data = this.makeJsonForBatch();
    } else {
      data = this.makeJsonForSubmit();
    }
    this.weekScheduleList = [];
    this.classService.getTimeTable(data).subscribe(
      res => {
        this.timeTableResponse = res;
        this.showContent = true;
        this.weekScheduleList = this.getClassList();
      },
      err => {
        //console.log(err);
        this.messageToast('error', 'Error', err.error.message);
      }
    )
  }

  makeJsonForSubmit() {
    let obj: any = {};
    obj.batch_id = this.fetchMasterCourseModule.subject_id;
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
    obj.batch_id = this.batchData.batch_id;
    obj.course_id = this.fetchBatchModule.course_id;
    obj.master_course = this.fetchBatchModule.master_course;
    obj.subject_id = this.batchData.subject_id;
    obj.teacher_id = this.fetchBatchModule.teacher_id;
    obj.standard_id = this.batchData.standard_id;
    obj.isExamIncludedInTimeTable = 'Y';
    obj.startdate = this.getStartDate();
    obj.enddate = this.getEndDate();
    obj.type = 2;
    return obj;
  }

  checkFieldFilled() {
    if (this.batchData.standard_id == -1 && this.batchData.subject_id == -1 && this.batchData.batch_id == -1) {
      return true
    } else {
      if (this.batchData.batch_id != -1) {
        return true;
      } else {
        this.messageToast('error', 'Error', 'Please provide batch details');
        return false;
      }
    }
  }

  getEndDate(): string {
    let currentDate = moment(this.currentDate).format("YYYY-MM-DD");
    return moment(currentDate).weekday(7).format("YYYY-MM-DD");
  }

  getStartDate(): string {
    let currentDate = moment(this.currentDate).format("YYYY-MM-DD");
    return moment(currentDate).weekday(1).format("YYYY-MM-DD");
  }

  getValueOfStandardID(data, key, value, ) {
    for (let t = 0; t < data.length; t++) {
      if (data[t][key] == value) {
        return data[t].standard_id;
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
    this.auth.institute_type.subscribe(
      res => {
        if (res == "LANG") {
          this.isLangInstitute = true;
        } else {
          this.isLangInstitute = false;
        }
      }
    )
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
      //console.log(this.weekScheduleList[index]);
      //console.log('this has to be deleted');
    }
    else if (level == 'subject') {
      //console.log(this.weekScheduleList[index].data[subIndex]);
      //console.log('this has to be deleted');
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
          this.messageToast('success', 'Success', 'Reminder Notification sent successfully');
        },
        err => {
          //console.log(err);
          this.messageToast('error', 'Error', err.error.message);
        }
      )
    };

  }

  rescheduleClassData(rowData) {
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
        hour: '12 PM',
        minute: '00',
        meridian: ''
      },
      reschedEndTime: {
        hour: '1 PM',
        minute: '00',
        meridian: ''
      }
    }
    if (this.showAdvanceFilter) {
      this.advanceFilterView();
    } else {
      this.submitMasterCourse();
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


  checkIfTimeProvided(data) {
    if (data == "" || data == null) {
      let msg = {
        type: 'error',
        title: 'Error',
        body: 'Please provide correct time'
      }
      this.toastCtrl.popToast(msg);
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

  checkInputType(event) {
    if (event.target.value == "All") {
      this.weekScheduleList = [];
      this.selectedRadioButton = "All";
      this.fetchBatchModule = {
        batch_id: null,
        master_course: "",
        course_id: -1,
        subject_id: -1,
        teacher_id: null,
      }
      this.getPrefillData();
    }
    else if (event.target.value == "Teacher") {
      this.weekScheduleList = [];
      this.selectedRadioButton = "Teacher";
    } else {
      this.weekScheduleList = [];
      this.selectedRadioButton = "Batch";
    }
  }

  onBatchMasterCourseSelection(event) {
    this.batchData.subject_id = -1;
    this.batchData.batch_id = -1;
    this.getCombinedData();
  }

  onSubjectSelection(event) {
    this.batchList = [];
    this.batchData.batch_id = -1;
    this.getCombinedData();
  }

  CancelClass(rowData) {
    this.isCourseCancel = true;
    this.classMarkedForAction = rowData;
  }

  closeCourseCancelClass() {
    this.isCourseCancel = false;
    this.cancellationReason = '';
    if (this.showAdvanceFilter) {
      this.advanceFilterView();
    } else {
      this.submitMasterCourse();
    }
  }

  cancelClass() {
    let data: any = {};
    data.batch_id = this.classMarkedForAction.batch_id;
    data.cancelSchd = [
      {
        cancel_note: this.cancellationReason,
        is_notified: this.is_notified,
        schd_id: this.classMarkedForAction.schd_id
      }
    ]
    this.classService.cancelClassSchedule(data).subscribe(
      res => {
        let msg = {
          type: 'success',
          title: 'Course Schedule Cancelled',
          body: 'The requested scheduled has been cancelled'
        }
        this.toastCtrl.popToast(msg);
        this.closeCourseCancelClass();
      },
      err => {
        let msg = {
          type: 'error',
          title: 'Failed To Cancel Schedule',
          body: err.cancelResponseMessage
        }
        this.toastCtrl.popToast(msg);
      }
    )
  }

  notifyCancelUpdate(e) {
    if (e.target.checked) {
      this.is_notified = "Y";
    }
    else {
      this.is_notified = "N";
    }
  }


  editClass(data) {
    let obj = {
      course_id: this.fetchMasterCourseModule.course_id,
      master_course: this.fetchMasterCourseModule.master_course,
      date: data.id.split('(')[0]
    }
    sessionStorage.setItem('editClass', JSON.stringify(obj));
    this.router.navigateByUrl('/view/course/class/add');
  }

  printTimeTableData() {

  }

  changeTeacher(data) {
    document.getElementById('teacher' + data.schd_id).classList.add('hide');
    document.getElementById('editTeacher' + data.schd_id).classList.remove('hide');
  }

  cancelChangeTeacher(data) {
    document.getElementById('teacher' + data.schd_id).classList.remove('hide');
    document.getElementById('editTeacher' + data.schd_id).classList.add('hide');
    this.allotedTeacher = '-1';
  }

  updateTeacher(data) {
    if (this.allotedTeacher == "-1" || this.allotedTeacher == null) {
      this.messageToast('error', 'Error', 'Please provide teacher');
      return false;
    } else {
      if (confirm('Are you sure you want to change the teacher?')) {
        let obj = {
          alloted_teacher_id: this.allotedTeacher,
          batch_id: data.batch_id,
          class_schedule_id: data.schd_id,
          cousre_planner_update_operation: 'teacher',
          is_exam_schedule: 'N',
        };
        this.classService.changeClassTeacher(obj).subscribe(
          res => {
            this.messageToast('success', 'Updated', 'Teacher updated successfully');
            this.allotedTeacher = '-1';
            this.cancelChangeTeacher(data);
            if (this.showAdvanceFilter) {
              this.advanceFilterView();
            } else {
              this.submitMasterCourse();
            }
          },
          err => {
            console.log(err);
            this.messageToast('error', 'Error', err.error.message);
          }
        )
      }
    }
  }

  //Advance Filter Functionality

  advanceFilterView() {
    let validate = this.validateAllFields();
    if (validate) {
      let dataToSend: any = this.makeJsonForAdvanceFilter();
      this.classService.getTimeTable(dataToSend).subscribe(
        res => {
          this.timeTableResponse = res;
          this.showContent = true;
          this.weekScheduleList = this.getClassList();
        },
        err => {
          this.messageToast('error', 'Error', err.error.message);
        }
      )
    }
  }

  makeJsonForAdvanceFilter() {
    let data: any;
    if (this.isLangInstitute) {
      data = this.makeJsonForBatch();
    } else {
      data = this.makeJsonForSubmit();
    }
    data.type = this.advanceFilter.type;
    data.startdate = this.advanceFilter.startdate;
    data.enddate = this.advanceFilter.enddate;
    return data;
  }

  validateAllFields() {
    let days: number = 0;
    days = moment(this.advanceFilter.enddate).diff(moment(this.advanceFilter.startdate), 'days');
    if (days > 31) {
      this.messageToast('error', 'Error', 'Please provide date range of 30 days only');
      return false;
    } else {
      this.advanceFilter.startdate = moment(this.advanceFilter.startdate).format('YYYY-MM-DD');
      this.advanceFilter.enddate = moment(this.advanceFilter.enddate).format('YYYY-MM-DD');
    }
    if (this.isLangInstitute) {
      if (this.batchData.standard_id == -1) {
        this.messageToast('error', 'Error', 'Please provide Master Course');
        return false;
      }
      if (this.batchData.subject_id == -1) {
        this.messageToast('error', 'Error', 'Please provide Course');
        return false;
      }
      if (this.batchData.batch_id == -1) {
        this.messageToast('error', 'Error', 'Please provide Batch');
        return false;
      }
    } else {
      if (this.fetchMasterCourseModule.master_course == "-1") {
        this.messageToast('error', 'Error', 'Please provide Master Course');
        return false
      }
      if (this.fetchMasterCourseModule.course_id == "-1") {
        this.messageToast('error', 'Error', 'Please provide Course');
        return false;
      }
    }
    return true;
  }

  showhideAdvanceFilter(key) {
    if (key == '0') {
      this.showAdvanceFilter = false;
    } else {
      this.showAdvanceFilter = true;
    }
    this.showContent = false;
    this.fetchMasterCourseModule = {
      master_course: "-1",
      course_id: "-1",
      subject_id: '-1',
      teacher_id: '-1',
    }
    this.batchData = {
      standard_id: -1,
      subject_id: -1,
      batch_id: -1,
    }
    this.selectedArray = {
      examSchldId: [],
      classSchldId: []
    };
  }

  /// Delete Schedule

  deleteMultipleSchedule() {
    if (confirm('All the selected future class and exam schedule will be deleted. Do you want to continue?')) {
      let dataToSend: any = this.makeMultipleDelete();
      if (dataToSend == false) {
        return false;
      }
      this.classService.deleteMultiple(dataToSend).subscribe(
        res => {
          this.messageToast('success', 'Deleted Successfully', '');
          if (this.showAdvanceFilter) {
            this.advanceFilterView();
          } else {
            this.submitMasterCourse();
          }
          this.selectedArray = {
            examSchldId: [],
            classSchldId: []
          };
        },
        err => {
          this.messageToast('error', 'Error', err.error.message);
        }
      )
    }
  }

  makeMultipleDelete() {
    let obj: any = {
      examSchldId: [],
      classSchldId: []
    }
    for (let key in this.weekScheduleList) {
      if (moment(this.weekScheduleList[key].id) > moment()) {
        let data = this.weekScheduleList[key].data;
        for (let i = 0; i < data.length; i++) {
          if (data[i].selected) {
            if (moment(data[i].date) > moment()) {
              if (data[i].class_type == "Exam") {
                obj.examSchldId.push(data[i].schd_id);
              } else {
                obj.classSchldId.push(data[i].schd_id);
              }
            } else {
              this.messageToast('error', 'Error', "Past Date Schedule Can't Deleted");
              return false;
            }
          }
        }
      }
    }
    if (obj.examSchldId.length == 0 && obj.classSchldId.length == 0) {
      this.messageToast('error', 'Error', "You haven't selected any future schedule");
      return false;
    }
    return obj;
  }

  userSelectedData(event, data) {
    let isUnseleted = false;
    if (event) {
      if (moment(data.date) > moment()) {
        if (data.class_type == "Exam") {
          this.selectedArray.examSchldId.push(data.schd_id);
        } else {
          this.selectedArray.classSchldId.push(data.schd_id);
        }
      }
      else {
        if (data.class_type == "Exam") {
          if (this.selectedArray.examSchldId.indexOf(data.schd_id) > -1) {
            this.selectedArray.examSchldId.splice(this.selectedArray.examSchldId.indexOf(data.schd_id), 1);
          }
        } else {
          if (this.selectedArray.classSchldId.indexOf(data.schd_id) > -1) {
            this.selectedArray.classSchldId.splice(this.selectedArray.classSchldId.indexOf(data.schd_id), 1);
          }
          else {
            this.selectedArray.classSchldId.push(data.schd_id);
          }
        }
      }
    } else {
      if (data.class_type == "Exam") {
        if (this.selectedArray.examSchldId.indexOf(data.schd_id) > -1) {
          this.selectedArray.examSchldId.splice(this.selectedArray.examSchldId.indexOf(data.schd_id), 1);
        }
      } else {
        if (this.selectedArray.classSchldId.indexOf(data.schd_id) > -1) {
          this.selectedArray.classSchldId.splice(this.selectedArray.classSchldId.indexOf(data.schd_id), 1);
        }
        else {
          this.selectedArray.classSchldId.push(data.schd_id);
        }
      }
    }
    if (this.weekScheduleList.length > 0) { /// this code used to check is all checked or not
      for (let i = 0; i < this.weekScheduleList.length; i++) {
        if (this.weekScheduleList[i].data.length > 0) {
          this.weekScheduleList[i].data.forEach(
            sch => {
              if (sch.selected == false) {
                isUnseleted = true;
                return;
              }
            }
          )
        }
      }
    }
    this.isChecked = isUnseleted ? false : true;

  }

  showDeleteBTN() {
    if (this.selectedArray.examSchldId.length > 0) {
      return true;
    }
    if (this.selectedArray.classSchldId.length > 0) {
      return true;
    }
    return false;
  }

  // Expand All 
  expandAllRows() {
    let count = this.weekScheduleList.length;
    for (let i = 0; i < count; i++) {
      this.toggleTbodyClass(i);
    }
  }

  checkAllCheckbox() {
    this.isChecked = (!this.isChecked);
    this.expandAllRows();
    if (this.weekScheduleList.length > 0) {
      for (let i = 0; i < this.weekScheduleList.length; i++) {
        if (this.weekScheduleList[i].data.length > 0) {
          document.getElementById('tbodyItem' + i).classList.add("active");
          document.getElementById('tbodyView' + i).classList.remove("hide");
          this.weekScheduleList[i].data.forEach(
            sch => {
              if (!this.isChecked) {
                if (sch.class_type != "Exam") {
                  if (sch.selected == true) {
                    sch.selected = false;
                    if (this.selectedArray.classSchldId.indexOf(sch.schd_id) > -1) {
                      this.selectedArray.classSchldId.splice(this.selectedArray.classSchldId.indexOf(sch.schd_id), 1);
                    }
                  }
                }
              }
              else {
                if (sch.class_type != "Exam") {
                  if (sch.selected == false) {
                    sch.selected = true;
                    this.selectedArray.classSchldId.push(sch.schd_id);
                  }
                }
              }

            }
          )
        }
      }
    }
  }

  // Hide Past Schedules
  hidePastClassAction(data) {
    let date = data.id.split('(');
    if (moment(date[0]).format('YYYY-MM-DD') >= moment().format('YYYY-MM-DD')) {
      return true;
    } else {
      return false;
    }
  }

}

@Pipe({
  name: 'dateMonthYearFromat'
})
export class DateFormat implements PipeTransform {
  public transform(value) {
    if (value != "" && value != null && value != undefined) {
      return moment(value).format('DD-MMM-YYYY');
    } else {
      return value
    }
  }
}