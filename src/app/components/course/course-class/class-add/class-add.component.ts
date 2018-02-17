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
  selector: 'app-class-add',
  templateUrl: './class-add.component.html',
  styleUrls: ['./class-add.component.scss']
})
export class ClassAddComponent implements OnInit {



  busy: Subscription;
  isProfessional: boolean = false;
  isRippleLoad: boolean = false;
  isClassFormFilled: boolean = false;
  createCustomSchedule: boolean = false;


  courseModelBatch: any;
  courseModelStdList: any[] = [];
  courseModelSubList: any[] = [];
  courseModelBatchList: any[] = [];
  subBranch: any[] = [];
  masterCourse: any[] = [];
  teachers: any[] = [];
  instituteSetting: any[] = [];
  courseList: any[] = [];
  batchDetails: any;
  classFrequency: any[] = [];
  dayOfWeek: any[] = [];
  hourArr: any[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  minArr: any[] = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
  meridianArr: any[] = ["AM", "PM"];


  courseStartDate: any = '';
  courseEndDate: any = '';
  subjectListDataSource: any = [];
  fetchedCourseData: any = [];


  addClassDetails = {
    batch_id: '',
    subject_id: '',
    subject_name: '',
    start_hour: '',
    start_minute: '',
    start_meridian: '',
    end_hour: '',
    end_minute: '',
    end_meridian: '',
    teacher_id: '',
    teacher_name: '',
    class_desc: '',
    room_no: '',
    custom_class_type: 'Regular',
    duration: ''
  }
  teacherListDataSource: any = [];
  customListDataSource: any = [];
  classScheduleArray: any = [];
  showPopUp: boolean = true;
  customRec = {
    start_hour: '',
    start_minute: '',
    start_meridian: '',
    end_hour: '',
    end_minute: '',
    end_meridian: '',
  }



  timepicker: any = {
    universalStartTime: {
      hour: '',
      minute: '',
      meridian: ''
    },
    universalEndTime: {
      hour: '',
      minute: '',
      meridian: ''
    },
  }

  fetchMasterCourseModule: any = {
    master_course: "-1",
    requested_date: "Invalid date",
    inst_id: sessionStorage.getItem('institute_id'),
    course_id: "-1"
  }

  fetchMasterBatchModule: any = {
    standard_id: "-1",
    subject_id: "-1",
    batch_id: '-1',
    inst_id: sessionStorage.getItem('institute_id'),
    assigned: "N"
  }

  selectedClassFrequency: any = 'WEEK';

  /* ============================================================================================ */
  /* ============================================================================================ */
  /* ============================================================================================ */
  constructor(private router: Router, private fb: FormBuilder, private appC: AppComponent, private login: LoginService, private rd: Renderer2, private cd: ChangeDetectorRef,
    private classService: ClassScheduleService) {
    if (sessionStorage.getItem('Authorization') == null) {
      this.router.navigate(['/authPage']);
    }
  }

  /* ============================================================================================ */
  /* ============================================================================================ */
  /* ============================================================================================ */
  ngOnInit() {
    /* Prerequiste loaded */
    this.isProfessional = sessionStorage.getItem('institute_type') == 'LANG';
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));
    /* fetching prefilled data */
    this.busy = this.fetchPrefillData();

  }
  /* ============================================================================================ */
  /* ============================================================================================ */
  /* ============================================================================================ */
  fetchPrefillData() {
    this.isRippleLoad = true;
    /* Batch Model */
    if (this.isProfessional) {
      this.classService.getStandardSubjectList(this.fetchMasterBatchModule.standard_id, this.fetchMasterBatchModule.subject_id, this.fetchMasterBatchModule.assigned).subscribe(
        res => {
          this.courseModelBatch = res;
          if (this.fetchMasterBatchModule.standard_id == '-1' && this.fetchMasterBatchModule.subject_id == '-1') {
            this.courseModelStdList = res.standardLi;
            this.courseModelBatchList = res.batchLi;
            this.courseModelSubList = [];
          }
          else if (this.fetchMasterBatchModule.standard_id != '-1' && this.fetchMasterBatchModule.subject_id == '-1') {
            this.courseModelBatchList = res.batchLi;
            this.courseModelSubList = res.subjectLi;
          }
          else if (this.fetchMasterBatchModule.standard_id != '-1' && this.fetchMasterBatchModule.subject_id != '-1') {
            this.courseModelStdList = res.standardLi;
            this.courseModelBatchList = res.batchLi;
          }
        }
      );

      this.classService.getClassFrequencyAll().subscribe(
        res => {
          this.classFrequency = res;
        },
        err => {

        }
      );

      this.classService.getDayofWeekAll().subscribe(
        res => {
          this.dayOfWeek = res;
        },
        err => {

        }
      );

    }/* Course Model */
    else {
      /* Get in class schedule || course planner || Time Table */
      this.classService.getAllSubBranches().subscribe(
        res => {
          this.subBranch = res;
        },
        err => { }
      );
      /* Get in class schedule || course planner || Time Table*/
      this.classService.getAllMasterCourse().subscribe(
        res => {
          this.masterCourse = res;
        },
        err => { }
      );
      /* Get in class schedule || Time Table*/
      this.classService.getAllTeachers().subscribe(
        res => {
          this.teachers = res;
        },
        err => { }
      );
    }


    return this.classService.getInstituteSettings().subscribe(
      res => {
        this.isRippleLoad = false;
        this.instituteSetting = res;
      },
      err => { }
    )

  }
  /* ============================================================================================ */
  /* ============================================================================================ */
  updateCourseList(ev) {
    this.isRippleLoad = true;
    this.isClassFormFilled = false;
    this.busy = this.classService.getCourseFromMasterById(ev).subscribe(
      res => {
        if (res.coursesList) {
          this.courseList = res.coursesList;
          this.isRippleLoad = false;
        }
        else {
          this.courseList = [];
          this.isRippleLoad = false;
        }
      },
      err => {
        this.courseList = [];
        this.isRippleLoad = false;
      }
    )
  }
  /* ============================================================================================ */
  /* ============================================================================================ */
  submitMasterCourse() {
    console.log(this.fetchMasterCourseModule);
    if (this.fetchMasterCourseModule.master_course == '-1' || this.fetchMasterCourseModule.course_id == '-1' ||
      this.fetchMasterCourseModule.requested_date == '' || this.fetchMasterCourseModule.requested_date == 'Invalid date'
      || this.fetchMasterCourseModule.requested_date == null) {
      console.log(this.fetchMasterCourseModule);
    }
    else {
      this.isClassFormFilled = true;
      console.log(this.fetchMasterCourseModule);
      this.getAllSubjectListFromServer(this.fetchMasterCourseModule);
      this.getCustomList();
      this.getTeacherList();
    }
  }
  /* ============================================================================================ */
  /* ============================================================================================ */
  updateSubjectList(ev) {
    this.isRippleLoad = true;
    this.isClassFormFilled = false;
    this.fetchMasterBatchModule.subject_id = (ev == '-1' ? '-1' : this.fetchMasterBatchModule.subject_id);
    this.classService.getStandardSubjectList(ev, this.fetchMasterBatchModule.subject_id, this.fetchMasterBatchModule.assigned).subscribe(
      res => {
        this.isRippleLoad = false;
        this.courseModelBatch = res;
        if (ev == '-1') {
          if (this.fetchMasterBatchModule.subject_id == "-1") {
            this.courseModelStdList = res.standardLi;
            this.courseModelBatchList = res.batchLi;
            this.fetchMasterBatchModule.batch_id = "-1";
            this.fetchMasterBatchModule.subject_id = "-1";
            this.courseModelSubList = [];
          }
          else {
            this.courseModelBatchList = res.batchLi;
            this.fetchMasterBatchModule.batch_id = "-1";
            this.fetchMasterBatchModule.subject_id = "-1";
            this.courseModelSubList = [];
          }
        }
        else if (ev != '-1') {
          if (this.fetchMasterBatchModule.subject_id == '-1') {
            this.fetchMasterBatchModule.batch_id = "-1";
            this.fetchMasterBatchModule.subject_id = "-1";
            this.courseModelBatchList = res.batchLi;
            this.courseModelSubList = res.subjectLi;
          }
          else if (this.fetchMasterBatchModule.subject_id != '-1') {
            this.fetchMasterBatchModule.batch_id = "-1";
            this.fetchMasterBatchModule.subject_id = "-1";
            this.courseModelBatchList = res.batchLi;
            this.courseModelSubList = res.subjectLi;
          }
        }
      }
    );
  }
  /* ============================================================================================ */
  /* ============================================================================================ */
  submitMasterBatch() {
    console.log(this.fetchMasterBatchModule);
    /* standard selected */
    if (this.fetchMasterBatchModule.standard_id != '-1' && this.fetchMasterBatchModule.standard_id != -1 && this.fetchMasterBatchModule.standard_id != undefined) {

      /* subject selected  */
      if (this.fetchMasterBatchModule.subject_id != '-1' && this.fetchMasterBatchModule.subject_id != undefined) {

        /* batch selected */
        /* Success */
        /*  */
        if (this.fetchMasterBatchModule.batch_id != '-1' && this.fetchMasterBatchModule.batch_id != undefined) {
          this.batchDetected(this.fetchMasterBatchModule.batch_id);
        }
        /* batch not selected */
        /* Error */
        /*  */
        else if (this.fetchMasterBatchModule.batch_id == '-1' || this.fetchMasterBatchModule.batch_id == undefined) {
          let msg = {
            type: 'error',
            title: 'Batch Not Selected',
            body: 'Please select valid input'
          }
          this.appC.popToast(msg);
        }
      }
      /* subject not selected */
      else if (this.fetchMasterBatchModule.subject_id == '-1' || this.fetchMasterBatchModule.subject_id == undefined) {
        let msg = {
          type: 'error',
          title: 'Subject And Batch Invalid',
          body: 'Please select valid input'
        }
        this.appC.popToast(msg);
      }
    }
    /* standard not selected */
    else if (this.fetchMasterBatchModule.standard_id == '-1' || this.fetchMasterBatchModule.standard_id == undefined) {

      /* subject selected  */
      if (this.fetchMasterBatchModule.subject_id != '-1' && this.fetchMasterBatchModule.subject_id != undefined) {

        let msg = {
          type: 'error',
          title: 'Standard Not Selected',
          body: 'Please select valid input'
        }
        this.appC.popToast(msg);
      }
      /* subject not selected  */
      else if (this.fetchMasterBatchModule.subject_id == '-1' || this.fetchMasterBatchModule.subject_id == undefined) {
        /* batch selected */
        /* Success */
        /*  */

        if (this.fetchMasterBatchModule.batch_id != '-1' && this.fetchMasterBatchModule.batch_id != undefined) {
          this.batchDetected(this.fetchMasterBatchModule.batch_id);
        }
        /* batch not selected */
        /* Error */
        /*  */
        else if (this.fetchMasterBatchModule.batch_id == '-1' || this.fetchMasterBatchModule.batch_id == undefined) {

          let msg = {
            type: 'error',
            title: 'Standard, Subject And Batch Not Selected',
            body: 'Please select valid input'
          }
          this.appC.popToast(msg);
        }
      }
    }
  }
  /* ============================================================================================ */
  /* ============================================================================================ */
  filterSubjectBatches(ev) {
    this.isRippleLoad = true;
    this.classService.getStandardSubjectList(this.fetchMasterBatchModule.standard_id, ev, this.fetchMasterBatchModule.assigned).subscribe(
      res => {
        this.isRippleLoad = false;
        this.courseModelBatch = res;
        if (this.fetchMasterBatchModule.standard_id == '-1' && this.fetchMasterBatchModule.subject_id == '-1') {

          this.courseModelStdList = res.standardLi;
          this.courseModelBatchList = res.batchLi;
          this.courseModelSubList = [];
        }
        else if (this.fetchMasterBatchModule.standard_id != '-1' && this.fetchMasterBatchModule.subject_id == '-1') {

          this.courseModelBatchList = res.batchLi;
          this.courseModelSubList = res.subjectLi;
        }
        else if (this.fetchMasterBatchModule.standard_id != '-1' && this.fetchMasterBatchModule.subject_id != '-1') {

          this.courseModelBatchList = res.batchLi;
        }
        else {
          console.log(this.fetchMasterBatchModule);
        }
      },
      err => {

      }
    )
  }
  /* ============================================================================================ */
  /* ============================================================================================ */
  batchUpdated(ev) {
    this.isClassFormFilled = false;
    /* standard not selected */
    if (this.fetchMasterBatchModule.standard_id == '-1' || this.fetchMasterBatchModule.standard_id == undefined || this.fetchMasterBatchModule.standard_id == null) {
      /* subject not selected */
      if (this.fetchMasterBatchModule.subject_id == '-1' || this.fetchMasterBatchModule.subject_id == undefined ||
        this.fetchMasterBatchModule.subject_id == null) {
        /* batch not selected */
        if (this.fetchMasterBatchModule.batch_id == '-1' || this.fetchMasterBatchModule.batch_id == undefined || this.fetchMasterBatchModule.batch_id == null) {

        }/* batch selected */
        else {

        }
      }
    }
    /* standard selected */
    else {
      /* subject not selected */
      if (this.fetchMasterBatchModule.subject_id == '-1' || this.fetchMasterBatchModule.subject_id == undefined || this.fetchMasterBatchModule.subject_id == null) {
        /* batch not selected */
        if (this.fetchMasterBatchModule.batch_id == '-1' || this.fetchMasterBatchModule.batch_id == undefined || this.fetchMasterBatchModule.batch_id == null) {
        }/* batch selected */
        else {
        }
      }
      /* subject selected */
      else {
        /* batch not selected */
        if (this.fetchMasterBatchModule.batch_id == '-1' || this.fetchMasterBatchModule.batch_id == undefined || this.fetchMasterBatchModule.batch_id == null) {
        }/* batch selected */
        else {
        }
      }
    }
  }
  /* ============================================================================================ */
  /* ============================================================================================ */
  getMasterCourse(): string {
    if (this.isProfessional) {
      /* Only Batch selected */
      if (this.fetchMasterBatchModule.standard_id == '-1' || this.fetchMasterBatchModule.standard_id == undefined) {
        let temp: string;
        this.courseModelBatchList.forEach(e => {
          if (e.batch_id == this.fetchMasterBatchModule.batch_id) {
            temp = e.batch_name;
          }
        })
        return temp;
      }/* Both std subject and batch selected */
      else {
        let temp: string;
        this.courseModelStdList.forEach(e => {
          if (e.standard_id == this.fetchMasterBatchModule.standard_id) {
            temp = e.standard_name;
          }
        })
        return temp;
      }
    }
    else {
      let temp: string;
      this.masterCourse.forEach(e => {
        if (e.master_course == this.fetchMasterCourseModule.master_course) {
          temp = e.master_course;
        }
      });
      return temp;
    }
  }
  /* ============================================================================================ */
  /* ============================================================================================ */
  getCourseName() {
    if (this.isProfessional) {
      let temp: string = '';
      this.courseModelSubList.forEach(e => { if (e.subject_id == this.fetchMasterBatchModule.subject_id) { temp = e.subject_name } });
      return temp;
    }
    else {
      let temp: string = '';
      this.courseList.forEach(e => { if (e.course_id == this.fetchMasterCourseModule.course_id) { temp = e.course_name } });
      return temp;
    }
  }
  /* ============================================================================================ */
  /* ============================================================================================ */
  batchDetected(id) {
    this.isRippleLoad = true;
    this.classService.getBatchDetailsById(id).subscribe(
      res => {
        this.batchDetails = Object.assign({}, res);
        this.isRippleLoad = false;
        this.isClassFormFilled = true;
      },
      err => { }
    );
  }
  /* ============================================================================================ */
  /* ============================================================================================ */
  updateClassFrequency(ev) {
    if (ev == "OTHER") {
      this.createCustomSchedule = true;
    } else {
      this.createCustomSchedule = false;
    }
  }
  /* ============================================================================================ */
  /* ============================================================================================ */
  applySelectedFrequency() {

  }

  /* ============================================================================================ */
  /* ============================================================================================ */

  getAllSubjectListFromServer(data) {
    this.classService.getAllSubjectlist(this.fetchMasterCourseModule).subscribe(
      res => {
        console.log('course list', res);
        this.fetchedCourseData = res;
        this.subjectListDataSource = this.getSubjectList(res);
        this.classScheduleArray = this.constructJSONForTable(res);
        console.log('this.classScheduleArray', this.classScheduleArray);
      },
      err => {
        console.log(err);
        this.messageToast('error', 'Error', err.error.message);
      }
    )
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
            obj.duration = courseScheduleList[i].duration;
            obj.subject_name = courseScheduleList[i].subject_name;
            obj.subject_id = courseScheduleList[i].subject_id;
            obj.duration = courseScheduleList[i].duration;
            obj.teacher_id = batchesList[j].teacher_id;
            obj.batch_id = courseScheduleList[i].batch_id;
            obj.class_desc = courseScheduleList[i].class_desc;
            obj.room_no = courseScheduleList[i].room_no;
            arr.push(obj);
          }
        }
      }
    }
    return arr;
  }


  getClassSchedule(data) {
    let obj: any = [];
    if (data.courseClassSchdList != null) {
      obj = data.courseClassSchdList;
    }
    return obj;
  }

  getCustomList() {
    this.classService.getCustomClassListFromServer().subscribe(
      res => {
        console.log('custom list', res);
        this.customListDataSource = res;
      },
      err => {
        console.log(err);
        this.messageToast('error', 'Error', err.error.message);
      }
    )
  }

  getTeacherList() {
    this.classService.getAllActiveTeachersList().subscribe(
      res => {
        console.log('teacher list', res);
        this.teacherListDataSource = res;
      },
      err => {
        console.log(err);
        this.messageToast('error', 'Error', err.error.message);
      }
    )
  }


  clearClassScheduleForm() {
    this.addClassDetails = {
      batch_id: '',
      subject_id: '',
      subject_name: '',
      start_hour: '',
      start_minute: '',
      start_meridian: '',
      end_hour: '',
      end_minute: '',
      end_meridian: '',
      teacher_id: '',
      teacher_name: '',
      class_desc: '',
      room_no: '',
      custom_class_type: 'Regular',
      duration: ''
    }
  }


  addClassSchedule() {
    let obj: any = {};
    if (this.addClassDetails.subject_id == '' || this.addClassDetails.subject_id == null || this.addClassDetails.subject_id == '-1') {
      this.messageToast('error', 'Error', 'Please Select Subject.');
      return;
    } else {
      obj.subject_id = this.addClassDetails.subject_id;
    }
    obj.class_schedule_id = 0;
    if (this.addClassDetails.custom_class_type == "" || this.addClassDetails.custom_class_type == null) {
      obj.custom_class_type = "Regular";
    } else {
      obj.custom_class_type = this.addClassDetails.custom_class_type;
    }
    let startTime = moment(this.addClassDetails.start_hour + ':' + this.addClassDetails.start_minute + this.addClassDetails.start_meridian, 'h:mma');
    let endTime = moment(this.addClassDetails.end_hour + ':' + this.addClassDetails.end_minute + this.addClassDetails.end_meridian, 'h:mma');
    if (!(startTime.isBefore(endTime))) {
      this.messageToast('error', 'Error', 'Please provide correct start time and end time');
      return
    } else {
      obj.start_time = this.addClassDetails.start_hour + ':' + this.addClassDetails.start_minute + ' ' + this.addClassDetails.start_meridian;
      obj.end_time = this.addClassDetails.end_hour + ':' + this.addClassDetails.end_minute + ' ' + this.addClassDetails.end_meridian;
    }
    startTime = this.convertIntoFullClock(this.addClassDetails.start_hour, this.addClassDetails.start_minute, this.addClassDetails.start_meridian);
    endTime = this.convertIntoFullClock(this.addClassDetails.end_hour, this.addClassDetails.end_minute, this.addClassDetails.end_meridian);
    obj.duration = this.getDifference(startTime, endTime);
    obj.subject_name = this.getValueFromArray(this.subjectListDataSource, 'subject_id', obj.subject_id, 'subject_name');
    if (this.addClassDetails.teacher_id == "" || this.addClassDetails.teacher_id == '-1') {
      this.messageToast('error', 'Error', 'Please provide correct teacher name');
      return
    } else {
      obj.teacher_id = Number(this.addClassDetails.teacher_id);
    }
    obj.batch_id = this.getBatchID(obj.subject_id);
    obj.class_desc = this.addClassDetails.class_desc;
    obj.room_no = this.addClassDetails.room_no;
    this.classScheduleArray.push(obj);
    this.clearClassScheduleForm();
  }

  getBatchID(subject_id) {
    for (let i = 0; i < this.subjectListDataSource.length; i++) {
      if (this.subjectListDataSource[i].subject_id == subject_id) {
        return this.subjectListDataSource[i].batch_id;
      }
    }
  }


  convertIntoFullClock(hr, min, meridian) {
    let result: any = '';
    if (meridian == "AM") {
      result = hr + ':' + min;
    } else {
      hr = Number(hr) + 12;
      result = hr + ':' + min;
    }
    console.log(result);
    return result;
  }


  getDifference(startTime, endTime) {
    let start = moment.utc(startTime, "HH:mm");
    let end = moment.utc(endTime, "HH:mm");
    if (end.isBefore(start)) end.add(1, 'day');
    let d: any = moment.duration(end.diff(start));
    return d._data.minutes;
  }


  getValueFromArray(data, key, compareVal, getKey) {
    let result: any = '';
    for (let i = 0; i < data.length; i++) {
      if (data[i][key] == compareVal) {
        result = data[i][getKey];
      }
    }
    return result;
  }

  onCourseListSelection(event) {
    console.log(this.courseList);
    if (event != '-1') {
      for (let i = 0; i < this.courseList.length; i++) {
        if (this.courseList[i].course_id == event) {
          this.courseStartDate = this.courseList[i].start_date;
          this.courseEndDate = this.courseList[i].end_date;
        }
      }
    } else {
      this.courseStartDate = '';
      this.courseEndDate = '';
    }
  }

  copyCourseSchedule() {
    debugger
  }

  cancelCourseSchedule() {
    debugger
  }

  sendReminder() {
    debugger

    if (confirm("Are you sure, You want to notify?")) {
      let obj: any = {};
      obj.course_id = this.fetchedCourseData.coursesList[0].course_id;
      obj.requested_date = this.fetchedCourseData.requested_date;
      this.classService.sendReminderToServer(obj).subscribe(
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

  saveCourseSchedule() {
    let obj = this.makeJsonForCourseSave();
    this.classService.saveDataOnServer(obj).subscribe(
      res => {
        console.log(res);
        this.messageToast('success', 'Saved', 'Your class created successfully');
      },
      err => {
        console.log(err);
        this.messageToast('error', 'Error', err.error.message);
      }
    )

  }


  makeJsonForCourseSave() {
    let obj: any = {};
    obj.master_course = this.getValueFromArray(this.masterCourse, 'master_course', this.fetchMasterCourseModule.master_course, 'master_course');
    obj.requested_date = moment(this.fetchMasterCourseModule.requested_date).format("YYYY-MM-DD");
    obj.course_id = this.fetchMasterCourseModule.course_id;
    obj.coursesList = [];
    obj.coursesList.course_id = this.fetchMasterCourseModule.course_id;
    obj.coursesList.courseClassSchdList = [];
    for (let i = 0; i < this.classScheduleArray.length; i++) {
      let test: any = {};
      test.alloted_teacher_id = this.classScheduleArray[i].teacher_id;
      test.batch_id = this.classScheduleArray[i].batch_id;
      test.class_desc = this.classScheduleArray[i].class_desc;
      test.class_schedule_id = this.classScheduleArray[i].class_schedule_id;
      test.custom_class_type = this.classScheduleArray[i].custom_class_type;
      test.duration = this.classScheduleArray[i].duration;
      test.room_no = this.classScheduleArray[i].room_no;
      test.start_time = this.classScheduleArray[i].start_time;
      test.end_time = this.classScheduleArray[i].end_time;
      obj.coursesList.courseClassSchdList.push(test);
    }
    return obj;
  }

  getSubjectList(data) {
    let obj = {};
    for (let i = 0; i < data.coursesList.length; i++) {
      if (data.coursesList[i].course_id == this.fetchMasterCourseModule.course_id) {
        return data.coursesList[i].batchesList;
      }
    }
  }

  weeklyScheduleChange($event) {
    debugger
    let selectedValue = $event.target.value;
    if (selectedValue == 1) {

    } else if (selectedValue == 2) {
      this.selectedDatesOption();
    } else {
      this.customRecurrence();
    }

  }

  selectedDatesOption() {
    this.showPopUp = true;
  }

  customRecurrence() {

  }


  /* ============================================================================================ */
  /* ============================================================================================ */



  //////// POPUP /////////////////////////


  closePopup() {
    this.showPopUp = false;
  }

  onWeekDaysSelection(event) {
    debugger
    if ((document.getElementById(event.target.id).classList).contains('l-text')) {
      document.getElementById(event.target.id).classList.remove('l-text');
      document.getElementById(event.target.id).classList.add('p-text');
    } else {
      document.getElementById(event.target.id).classList.add('l-text');
      document.getElementById(event.target.id).classList.remove('p-text');
    }
  }































  /* ============================================================================================ */
  /* ============================================================================================ */


  /* ============================================================================================ */
  /* ============================================================================================ */


  /* ============================================================================================ */
  /* ============================================================================================ */


  /* ============================================================================================ */
  /* ============================================================================================ */

  /* ============================================================================================ */
  /* ============================================================================================ */


  /* ============================================================================================ */
  /* ============================================================================================ */


  /* ============================================================================================ */
  /* ============================================================================================ */


  /* ============================================================================================ */
  /* ============================================================================================ */


  /* ============================================================================================ */
  /* ============================================================================================ */


  /* ============================================================================================ */
  /* ============================================================================================ */


  /* ============================================================================================ */
  /* ============================================================================================ */

  /* ============================================================================================ */
  /* ============================================================================================ */


  /* ============================================================================================ */
  /* ============================================================================================ */


  /* ============================================================================================ */
  /* ============================================================================================ */


  /* ============================================================================================ */
  /* ============================================================================================ */


  /* ============================================================================================ */
  /* ============================================================================================ */


  /* ============================================================================================ */
  /* ============================================================================================ */


  /* ============================================================================================ */
  /* ============================================================================================ */


  messageToast(Errortype, Errortitle, message) {
    let msg = {
      type: Errortype,
      title: Errortitle,
      body: message
    }
    this.appC.popToast(msg);
  }

}
