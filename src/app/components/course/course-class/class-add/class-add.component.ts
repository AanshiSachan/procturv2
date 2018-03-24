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
  showPopUp: boolean = false;
  showPopUpRecurence: boolean = false;
  showPopUpCancellation: boolean = false;
  cancelRowSelected: any = '';
  customRec = {
    start_hour: '',
    start_minute: '',
    start_meridian: '',
    end_hour: '',
    end_minute: '',
    end_meridian: '',
    radioEndDate: {
      radioEndDateSelection: false,
      radioDate: '',
    },
    radioOn: {
      radioONSelection: false,
      radioOnDate: '',
    },
    radioAfter: {
      radioAfterSelection: false,
      occurenceValue: ''
    }
  }
  addDates = {
    selectedDate: '',
    error: '',
  }
  selectedDateArray: any = [];
  selctedScheduledClass: any = [];
  weekDaysSelected: any = [];

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
    requested_date: moment().format("YYYY-MM-DD"),
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
  customTable: any = [];
  custom = {
    date: '',
    start_hour: '',
    start_minute: '',
    start_meridian: '',
    end_hour: '',
    end_minute: '',
    end_meridian: '',
    desc: '',
  }
  times: any[] = ['', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 AM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM', '12 PM']
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

      this.getWeekOfDaysFromServer();

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
      this.messageToast('error', 'Error', 'Please provide all mandatory details');
      return;
    }
    else {
      if (moment(this.courseStartDate).format("YYYY-MM-DD") <= moment(this.fetchMasterCourseModule.requested_date).format("YYYY-MM-DD") && moment(this.fetchMasterCourseModule.requested_date).format("YYYY-MM-DD") <= moment(this.courseEndDate).format("YYYY-MM-DD")) {
        this.isClassFormFilled = true;
        this.fetchMasterCourseModule.requested_date = moment(this.fetchMasterCourseModule.requested_date).format("YYYY-MM-DD");
        console.log(this.fetchMasterCourseModule);
        this.getAllSubjectListFromServer(this.fetchMasterCourseModule);
        this.getCustomList();
        this.getTeacherList();
      } else {
        this.messageToast('error', 'Error', 'Please provides date in between course start and end date');
        return;
      }
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
    debugger
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
        console.log(res);
        this.isRippleLoad = false;
        this.isClassFormFilled = true;
        this.batchDetails = Object.assign({}, res);
        this.calculateFieldForTables(res);
      },
      err => {
        console.log(err);
        this.messageToast('error', 'Error', err.error.message);
      }
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
    this.timeChanges(this.addClassDetails.start_hour, "addClassDetails.start_hour");
    this.timeChanges(this.addClassDetails.end_hour, "addClassDetails.end_hour");
    if (this.addClassDetails.start_hour == "" && this.addClassDetails.start_minute == "") {
      this.messageToast('error', 'Error', 'Please provide correct start time');
      return
    }
    if (this.addClassDetails.end_hour == "" && this.addClassDetails.end_minute == "") {
      this.messageToast('error', 'Error', 'Please provide correct end time');
      return
    }
    let startTime = moment(this.addClassDetails.start_hour + ':' + this.addClassDetails.start_minute + this.addClassDetails.start_meridian, 'h:mma');
    let endTime = moment(this.addClassDetails.end_hour + ':' + this.addClassDetails.end_minute + this.addClassDetails.end_meridian, 'h:mma');
    if (!(startTime.isBefore(endTime))) {
      this.messageToast('error', 'Error', 'Please provide correct start time and end time');
      this.convertTimeToBindableFormat();
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
      this.convertTimeToBindableFormat();
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

  convertTimeToBindableFormat() {
    this.addClassDetails.start_hour = this.addClassDetails.start_hour + ' ' + this.addClassDetails.start_meridian;
    this.addClassDetails.start_meridian = "";
    this.addClassDetails.end_hour = this.addClassDetails.end_hour + ' ' + this.addClassDetails.end_meridian;
    this.addClassDetails.end_meridian = "";
  }

  timeChanges(data, name) {
    let time = data.split(' ');
    if (name == "addClassDetails.start_hour") {
      this.addClassDetails.start_hour = time[0];
      this.addClassDetails.start_meridian = time[1];
    } else if (name == "addClassDetails.end_hour") {
      this.addClassDetails.end_hour = time[0];
      this.addClassDetails.end_meridian = time[1];
    }
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
    if (end.isBefore(start))
      end.add(1, 'day');
    let d: any = moment.duration(end.diff(start));
    return d._milliseconds / 60000;
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


  cancelCourseClicked(rowData) {
    this.showPopUpCancellation = true;
    this.cancelRowSelected = rowData;
  }

  cancelCourseSchedule() {
    let dataTosend = this.makeCancelClassJson();
    if (dataTosend != undefined) {
      this.classService.cancelClassSchedule(dataTosend).subscribe(
        res => {
          console.log(res);
          this.messageToast('success', 'Success', 'Class Cancelled Successfull');
          this.showPopUpCancellation = false;
          this.getAllSubjectListFromServer(this.fetchMasterCourseModule);
        },
        err => {
          console.log(err);
          this.messageToast('error', 'Error', err.error.message);
        }
      )
    }
  }

  makeCancelClassJson() {
    let text = document.getElementById('idTexboxReason').value;
    if (text == "" || text == null || text == undefined) {
      this.messageToast('error', 'Error', 'Please provide cancellation reason');
      return
    }
    let chkbxValue = document.getElementById('idChkbxEnable').checked;
    if (chkbxValue == true) {
      chkbxValue = "Y";
    } else {
      chkbxValue = "N";
    }
    let obj: any = {};
    obj.batch_id = this.cancelRowSelected.batch_id;
    obj.cancelSchd = [
      {
        cancel_note: text,
        schd_id: this.cancelRowSelected.class_schedule_id,
        is_notified: chkbxValue
      }
    ];
    return obj;
  }


  sendReminder() {
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
    if (this.classScheduleArray.length == 0) {
      this.messageToast('error', 'Error', 'Please provide information');
      return;
    }
    let obj = this.makeJsonForCourseSave();
    this.classService.saveDataOnServer(obj).subscribe(
      res => {
        console.log(res);
        this.messageToast('success', 'Saved', 'Your class created successfully');
        this.getAllSubjectListFromServer(this.fetchMasterCourseModule);
      },
      err => {
        console.log(err);
        this.messageToast('error', 'Error', err.error.message);
      }
    )

  }

  removeRowFromSchedule(i, row) {
    if (confirm("Are you sure you want to delete?")) {
      for (let i = 0; i < this.classScheduleArray.length; i++) {
        if (this.classScheduleArray[i].class_schedule_id == row.class_schedule_id) {
          this.classScheduleArray.splice(i, 1);
        }
      }
    }
  }


  makeJsonForCourseSave() {
    let obj: any = {};
    obj.master_course = this.getValueFromArray(this.masterCourse, 'master_course', this.fetchMasterCourseModule.master_course, 'master_course');
    obj.requested_date = moment(this.fetchMasterCourseModule.requested_date).format("YYYY-MM-DD");
    obj.course_id = this.fetchMasterCourseModule.course_id;
    obj.coursesList = [];
    let temp: any = {};
    temp.course_id = this.fetchMasterCourseModule.course_id;
    temp.courseClassSchdList = [];
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
      temp.courseClassSchdList.push(test);
    }
    obj.coursesList.push(temp);
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

  weeklyScheduleChange($event, row) {
    this.selctedScheduledClass = row;
    this.selctedScheduledClass.startTime = this.setChangesOnTime(this.selctedScheduledClass.start_time);
    this.selctedScheduledClass.endTime = this.setChangesOnTime(this.selctedScheduledClass.end_time);
    let selectedValue = $event.target.value;
    if (selectedValue == 1) {

    } else if (selectedValue == 2) {
      this.selectedDatesOption();
    } else {
      this.customRecurrence();
    }
  }


  setChangesOnTime(data) {
    let obj: any = {};
    let time = data.split(':');
    obj.hour = time[0] + ' ' + time[1].split(' ')[1];
    obj.minute = time[1].split(' ')[0];
    return obj;
  }

  convertTimeToHourMinMeridian(data) {
    let obj: any = {};
    let time = data.split(':');
    obj.hour = time[0];
    obj.minute = time[1].split(' ')[0];
    obj.meridian = time[1].split(' ')[1];
    return obj;
  }


  selectedDatesOption() {
    this.showPopUp = true;
    this.selectedDateArray = [];
  }

  customRecurrence() {
    this.showPopUpRecurence = true;
  }


  /* ============================================================================================ */
  /* ============================================================================================ */



  //////// POPUP /////////////////////////


  closePopup() {
    this.showPopUpRecurence = false;
    this.showPopUp = false;
    this.showPopUpCancellation = false;
    this.getAllSubjectListFromServer(this.fetchMasterCourseModule);
  }

  onWeekDaysSelection(event) {
    if ((document.getElementById(event.target.id).classList).contains('l-text')) {
      document.getElementById(event.target.id).classList.remove('l-text');
      document.getElementById(event.target.id).classList.add('p-text');
    } else {
      document.getElementById(event.target.id).classList.add('l-text');
      document.getElementById(event.target.id).classList.remove('p-text');
    }
  }

  radioButtonClick($event) {
    this.clearSelection();
    if ($event.target.id == "idCourseEndDate") {
      this.customRec.radioEndDate.radioEndDateSelection = true;
    } else if ($event.target.id == "idOn") {
      this.customRec.radioOn.radioONSelection = true;
    } else {
      this.customRec.radioAfter.radioAfterSelection = true;
    }
  }

  clearSelection() {
    this.customRec.radioEndDate.radioEndDateSelection = false;
    this.customRec.radioEndDate.radioDate = '';
    this.customRec.radioOn.radioONSelection = false;
    this.customRec.radioOn.radioOnDate = '';
    this.customRec.radioAfter.radioAfterSelection = false;
    this.customRec.radioAfter.occurenceValue = '';
  }


  addDateToArray() {
    if (this.addDates.selectedDate != "" && this.addDates.selectedDate != undefined && this.addDates.selectedDate != null) {
      let obj: any = new Object;
      obj.selectedDate = moment(this.addDates.selectedDate).format("YYYY-MM-DD");
      obj.error = '';
      this.selectedDateArray.push(obj);
      this.addDates.selectedDate = '';
      this.addDates.error = '';
    }
  }

  removeDateToArray(index, row) {
    if (confirm("Are you sure you want to delete?")) {
      this.selectedDateArray.splice(index, 1);
    }
  }


  saveCustomRecurrences() {
    debugger
    this.weekDaysSelected = this.getSelectedDaysOfWeek();
    if (this.weekDaysSelected.length == 0) {
      this.messageToast('error', 'Error', 'Please provide days of week.');
      return;
    }
    let JsonToSend = this.makeJsonForRecurrence();
    console.log(JsonToSend);
    this.classService.saveCustomRecurrenceToServer(JsonToSend).subscribe(
      res => {
        console.log(res);
        this.messageToast('success', 'Saved', 'Saved Successfull');
        this.showPopUpRecurence = false;
      },
      err => {
        console.log(err);
        this.messageToast('error', 'Error', err.error.message);
      }
    )

  }

  getSelectedDaysOfWeek() {
    let arr = [];
    let elementArray = document.getElementsByClassName('p-text');
    for (let t = 0; t < elementArray.length; t++) {
      arr.push(elementArray[t].id.split('-')[1].trim());
    }
    return arr;
  }


  saveSelectedDateSchedule() {
    if (!this.validateAllFields()) {
      return;
    };
    let jsonToSend = this.makeJsonOFSelectedDate();
    console.log(jsonToSend);
    this.classService.selectedDateScheduleToServer(jsonToSend).subscribe(
      res => {
        console.log(res);
        this.checkDatesOverLapping(res);
      },
      err => {
        console.log(err);
        this.messageToast('error', 'Error', err.error.message);
      }
    )
  }

  checkDatesOverLapping(response) {
    for (let i = 0; i < Object.keys(response.copyClassScheduleDatesMapStatusMsg).length; i++) {
      for (let t = 0; t < this.selectedDateArray.length; t++) {
        let key = Object.keys(response.copyClassScheduleDatesMapStatusMsg)[i];
        if (this.selectedDateArray[t].selectedDate == key) {
          this.selectedDateArray[t].error = response.copyClassScheduleDatesMapStatusMsg[key];
        }
      }
    }
  }

  validateAllFields() {
    if (this.selctedScheduledClass.startTime.hour == "" || this.selctedScheduledClass.startTime.minute == "") {
      this.messageToast('error', 'Error', 'Please provide valid start time');
      return false;
    }
    if (this.selctedScheduledClass.endTime.hour == "" || this.selctedScheduledClass.endTime.minute == "") {
      this.messageToast('error', 'Error', 'Please provide valid end time');
      return false;
    }
    if (this.selctedScheduledClass.subject_id == "-1" || this.selctedScheduledClass.subject_id == " ") {
      this.messageToast('error', 'Error', 'Please provide subject name');
      return false;
    }
    if (this.selctedScheduledClass.teacher_id == "-1" || this.selctedScheduledClass.teacher_id == " ") {
      this.messageToast('error', 'Error', 'Please provide teacher name');
      return false;
    }
    return true;
  }

  makeJsonOFSelectedDate() {
    let obj: any = {};
    obj.course_id = Number(this.fetchMasterCourseModule.course_id);
    obj.courseClassSchdList = [];
    let test: any = {};
    test.batch_id = this.selctedScheduledClass.batch_id.toString();
    test.start_time = this.selctedScheduledClass.startTime.hour.split(' ')[0] + ':' + this.selctedScheduledClass.startTime.minute + ' ' + this.selctedScheduledClass.startTime.hour.split(' ')[1];
    test.end_time = this.selctedScheduledClass.endTime.hour.split(' ')[0] + ':' + this.selctedScheduledClass.endTime.minute + ' ' + this.selctedScheduledClass.endTime.hour.split(' ')[1];
    test.class_desc = this.selctedScheduledClass.class_desc;
    test.duration = this.getDifference(test.start_time, test.end_time);
    test.room_no = this.selctedScheduledClass.room_no;
    test.class_schedule_id = 0;
    test.alloted_teacher_id = this.selctedScheduledClass.teacher_id;
    test.custom_class_type = this.selctedScheduledClass.custom_class_type;
    obj.courseClassSchdList.push(test);
    obj.reqDateList = this.getSelectedDatesFromArray();
    return obj;
  }

  getSelectedDatesFromArray() {
    let arr: any = [];
    if (this.selectedDateArray.length != 0) {
      for (let t = 0; t < this.selectedDateArray.length; t++) {
        if (this.selectedDateArray[t].selectedDate != "" && this.selectedDateArray[t].selectedDate != null) {
          arr.push(this.selectedDateArray[t].selectedDate);
        }
      }
    } else {
      this.messageToast('error', 'Error', 'Please provide date.')
      return
    }
    return arr;
  }

  makeJsonForRecurrence() {
    let startTime = this.selctedScheduledClass.startTime.hour + ':' + this.selctedScheduledClass.startTime.minute + " " + this.selctedScheduledClass.startTime.meridian;
    let endTime = this.selctedScheduledClass.endTime.hour + ':' + this.selctedScheduledClass.endTime.minute + " " + this.selctedScheduledClass.endTime.meridian;
    let duration = this.getDifference(startTime, endTime);
    let obj: any = {};
    obj.batch_id = this.selctedScheduledClass.batch_id;
    obj.weekSchd = [];
    for (let t = 0; t < this.weekDaysSelected.length; t++) {
      let test: any = {};
      test.day_of_week = Number(this.weekDaysSelected[t]);
      test.start_time = startTime;
      test.end_time = endTime;
      test.duration = duration;
      obj.weekSchd.push(test);
    }
    obj.course_id = this.selctedScheduledClass.course_id;
    obj.start_date = moment(this.selctedScheduledClass.start_date).format("YYYY-MM-DD");
    obj.end_date = moment(this.selctedScheduledClass.end_date).format("YYYY-MM-DD");
    obj.courseClassSchdList = [{
      class_schedule_id: this.selctedScheduledClass.class_schedule_id
    }]
    return obj;
  }


  /* ============================================================================================ */
  /* ============================================================================================ */


  /* ============================================================================================ */
  /* ============================================================================================ */


  /* ============================================================================================ */
  /* =================================Batch Model=========================================================== */
  /* =================================Batch Model=========================================================== */
  /* =================================Batch Model=========================================================== */
  /* =================================Batch Model=========================================================== */
  /* =================================Batch Model=========================================================== */
  /* =================================Batch Model=========================================================== */
  /* =================================Batch Model=========================================================== */


  batchFrequency: any = '1';
  weekDays: any = [];
  weekDaysTable: any = [];
  canceLClassTable: any = [];
  extraClassTable: any = [];
  addExtraClass = {
    date: '',
    start_hour: '',
    start_minute: '',
    start_meridian: '',
    end_hour: '',
    end_minute: '',
    end_meridian: '',
    desc: '',
  }

  mainStartTime = {
    hour: '',
    minute: '',
    meridian: ''
  }
  mainEndTime = {
    hour: '',
    minute: '',
    meridian: ''
  }

  getWeekOfDaysFromServer() {
    this.classService.getWeekOfDays().subscribe(
      res => {
        console.log(res);
        this.weekDays = this.addKeyInData(res);
      },
      err => {
        console.log(err);
      }
    )
  }

  calculateFieldForTables(data) {
    if (data.cancelSchd != null) {
      this.canceLClassTable = data.cancelSchd;
    }
    if (data.extraSchd != null) {
      this.extraClassTable = data.extraSchd;
    }
    if (data.weekSchd != null) {
      this.makeJsonForWeekTable(data.weekSchd);
    }
  }


  makeJsonForWeekTable(data) {
    this.weekDaysTable = this.weekDays;
    for (let i = 0; i < this.weekDaysTable.length; i++) {
      for (let t = 0; t < data.length; t++) {
        if (data[t].day_of_week == this.weekDaysTable[i].data_key) {
          this.weekDaysTable[i].uiSelected = true;
          this.weekDaysTable[i].day_of_week = data[t].day_of_week;
          this.weekDaysTable[i].data_value = this.weekDays[i].data_value;
          this.weekDaysTable[i].schd_id = data[t].schd_id;
          this.weekDaysTable[i].duration = data[t].duration;
          this.weekDaysTable[i].start_time = this.convertTimeToHourMinMeridian(data[t].start_time);
          this.weekDaysTable[i].end_time = this.convertTimeToHourMinMeridian(data[t].end_time);
        }
      }
    }
    console.log(this.weekDaysTable);
  }


  notifyCancelClass(row) {
    if (confirm("Are you sure, You want to notify?")) {
      let data = {
        batch_id: row.batch_id,
        class_schedule_id: row.class_schedule_id,
        is_exam_schedule: row.is_exam_schedule
      };
      // this.classService.notifyCancelledClassSchedule(data).subscribe(
      //   res => {
      //     console.log(res);
      //     this.messageToast('success', 'Notified', 'Notification Sent');
      //   },
      //   err => {
      //     console.log(err);
      //     this.messageToast('error', 'Error', err.error.message);
      //   }
      // )
    }

  }


  cancelExtraClassSchedule(row) {
    this.showPopUpCancellation = true;
    this.cancelRowSelected = row;
  }

  cancelBatchSchedule() {
    let data = this.makeJSONToSendBatchDet();
    this.classService.cancelClassSchedule(data).subscribe(
      res => {
        console.log(res);
        this.messageToast('success', 'Notified', 'Cancelled Successfully');
      },
      err => {
        console.log(err);
        this.messageToast('error', 'Error', err.error.message);
      }
    )
  }


  makeJSONToSendBatchDet() {
    let text = document.getElementById('idTexboxReason').value;
    if (text == "" || text == null || text == undefined) {
      this.messageToast('error', 'Error', 'Please provide cancellation reason');
      return
    }
    let chkbxValue = document.getElementById('idChkbxEnable').checked;
    if (chkbxValue == true) {
      chkbxValue = "Y";
    } else {
      chkbxValue = "N";
    }
    let obj: any = {};
    obj.batch_id = this.cancelRowSelected.batch_id;
    obj.class_freq = this.cancelRowSelected.freq;
    obj.cancelSchd = [
      {
        cancel_note: text,
        is_notified: chkbxValue,
        schd_id: this.cancelRowSelected.schd_id,
      }
    ];
    return obj;
  }

  notifyExtraClassSchedule(row) {
    this.notifyCancelClass(row);
  }

  deleteExtraClassSchedule(row, index) {
    if (confirm("Are you sure you want to delete?")) {
      this.extraClassTable.splice(index, 1);
    }
  }

  updateWeeklySchedule() {
    debugger
    let data = this.prepareJSONDATA();
    this.classService.createWeeklyBatch(data).subscribe(
      res => {
        console.log(res);
        this.messageToast('success', 'Updated', 'Details Updated Successfully');
        this.submitMasterBatch();
      },
      err => {
        this.messageToast('error', 'Error', err.error.message);
        console.log(err);
      }
    )

  }

  prepareJSONDATA() {
    debugger
    let obj: any = {};
    obj.batch_id = this.batchDetails.batch_id;
    obj.class_freq = "WEEK";
    obj.weekSchd = [];
    for (let i = 0; i < this.weekDaysTable.length; i++) {
      if (this.weekDaysTable[i].uiSelected == true) {
        let test: any = {};
        test.day_of_week = this.weekDaysTable[i].day_of_week;
        let startTime = moment(this.weekDaysTable[i].start_time.hour + ':' + this.weekDaysTable[i].start_time.minute + this.weekDaysTable[i].start_time.meridian, 'h:mma');
        let endTime = moment(this.weekDaysTable[i].end_time.hour + ':' + this.weekDaysTable[i].end_time.minute + this.weekDaysTable[i].end_time.meridian, 'h:mma');
        if (!(startTime.isBefore(endTime))) {
          this.messageToast('error', 'Error', 'Please provide correct start time and end time');
          return
        } else {
          test.start_time = this.weekDaysTable[i].start_time.hour + ':' + this.weekDaysTable[i].start_time.minute + ' ' + this.weekDaysTable[i].start_time.meridian;
          test.end_time = this.weekDaysTable[i].end_time.hour + ':' + this.weekDaysTable[i].end_time.minute + ' ' + this.weekDaysTable[i].end_time.meridian;
        }
        startTime = this.convertIntoFullClock(this.weekDaysTable[i].start_time.hour, this.weekDaysTable[i].start_time.minute, this.weekDaysTable[i].start_time.meridian);
        endTime = this.convertIntoFullClock(this.weekDaysTable[i].end_time.hour, this.weekDaysTable[i].end_time.minute, this.weekDaysTable[i].end_time.meridian);
        test.duration = this.getDifference(startTime, endTime);
        obj.weekSchd.push(test);
      }
    }
    return obj;
  }

  addNewExtraClass() {
    debugger
    let obj: any = {};
    obj.class_date = moment(this.addExtraClass.date).format("YYYY-MM-DD");
    let startTime = moment(this.addExtraClass.start_hour + ':' + this.addExtraClass.start_minute + this.addExtraClass.start_meridian, 'h:mma');
    let endTime = moment(this.addExtraClass.end_hour + ':' + this.addExtraClass.end_minute + this.addExtraClass.end_meridian, 'h:mma');
    if (!(startTime.isBefore(endTime))) {
      this.messageToast('error', 'Error', 'Please provide correct start time and end time');
      return
    } else {
      obj.start_time = this.addExtraClass.start_hour + ':' + this.addExtraClass.start_minute + ' ' + this.addExtraClass.start_meridian;
      obj.end_time = this.addExtraClass.end_hour + ':' + this.addExtraClass.end_minute + ' ' + this.addExtraClass.end_meridian;
    }
    obj.note = this.addExtraClass.desc;
    obj.batch_id = this.batchDetails.batch_id;
    obj.schd_id = 0;
    this.extraClassTable.push(obj);
  }

  scheduleSelection(event) {
    this.batchFrequency = event;
  }

  applyButtonClick() {
    let startTime = moment(this.mainStartTime.hour + ':' + this.mainStartTime.minute + this.mainStartTime.meridian, 'h:mma');
    let endTime = moment(this.mainEndTime.hour + ':' + this.mainEndTime.minute + this.mainEndTime.meridian, 'h:mma');
    if (!(startTime.isBefore(endTime))) {
      this.messageToast('error', 'Error', 'Please provide correct start time and end time');
      return
    } else {
      let startTime = this.mainStartTime.hour + ':' + this.mainStartTime.minute + ' ' + this.mainStartTime.meridian;
      let endTime = this.mainEndTime.hour + ':' + this.mainEndTime.minute + ' ' + this.mainEndTime.meridian;
      for (let t = 0; t < this.weekDaysTable.length; t++) {
        this.weekDaysTable[t].start_time = this.convertTimeToHourMinMeridian(startTime);
        this.weekDaysTable[t].end_time = this.convertTimeToHourMinMeridian(endTime);
      }
    }
  }



  updateExtraClass() {
    let data = this.makeJsonForExtraClass();
    this.classService.createWeeklyBatch(data).subscribe(
      res => {
        console.log(res);
        this.messageToast('success', 'Updated', 'Details Updated Successfully');
        this.submitMasterBatch();
      },
      err => {
        this.messageToast('error', 'Error', err.error.message);
        console.log(err);
      }
    )
  }


  makeJsonForExtraClass() {
    let obj: any = {};
    obj.batch_id = this.batchDetails.batch_id;
    obj.class_freq = "EXTRA";
    obj.extraSchd = [];
    for (let i = 0; i < this.extraClassTable.length; i++) {
      let t: any = {};
      t.class_date = this.extraClassTable[i].class_date;
      t.start_time = this.extraClassTable[i].start_time;
      t.end_time = this.extraClassTable[i].end_time;
      t.note = this.extraClassTable[i].note;
      t.schd_id = this.extraClassTable[i].schd_id;
      let testStart: any = this.convertTimeToHourMinMeridian(t.start_time);
      let testStart1: any = this.convertTimeToHourMinMeridian(t.end_time);
      let start = this.convertIntoFullClock(testStart.hour, testStart.minute, testStart.meridian);
      let end = this.convertIntoFullClock(testStart1.hour, testStart1.minute, testStart1.meridian);
      t.duration = this.getDifference(start, end);
      obj.extraSchd.push(t);
    }
    return obj;
  }

  cancelWeeklyScheduledClass() {
    debugger
  }

  addNewCustomClass() {
    let obj: any = {};
    obj.class_date = moment(this.custom.date).format("YYYY-MM-DD");
    let some = moment(this.custom.date).unix();
    let currentDate = moment().unix();
    if (currentDate > some) {
      this.messageToast('error', 'Error', 'Please provide valid date');
      return
    }
    let startTime = moment(this.custom.start_hour + ':' + this.custom.start_minute + this.custom.start_meridian, 'h:mma');
    let endTime = moment(this.custom.end_hour + ':' + this.custom.end_minute + this.custom.end_meridian, 'h:mma');
    if (!(startTime.isBefore(endTime))) {
      this.messageToast('error', 'Error', 'Please provide correct start time and end time');
      return
    } else {
      obj.start_time = this.custom.start_hour + ':' + this.custom.start_minute + ' ' + this.custom.start_meridian;
      obj.end_time = this.custom.end_hour + ':' + this.custom.end_minute + ' ' + this.custom.end_meridian;
    }
    obj.note = this.custom.desc;
    obj.batch_id = this.batchDetails.batch_id;
    obj.schd_id = 0;
    this.customTable.push(obj);
    this.custom = {
      date: '',
      start_hour: '',
      start_minute: '',
      start_meridian: '',
      end_hour: '',
      end_minute: '',
      end_meridian: '',
      desc: '',
    }
  }


  deleteFromCustomTable(row, index) {
    if (confirm("Are you sure you want to delete?")) {
      this.customTable.splice(index, 1);
    }
  }


  makeJsonForCustomClass() {
    let obj: any = {};
    obj.batch_id = this.batchDetails.batch_id;
    obj.class_freq = "OTHER";
    obj.extraSchd = [];
    for (let i = 0; i < this.customTable.length; i++) {
      let t: any = {};
      t.class_date = this.customTable[i].class_date;
      t.start_time = this.customTable[i].start_time;
      t.end_time = this.customTable[i].end_time;
      t.note = this.customTable[i].note;
      t.schd_id = this.customTable[i].schd_id;
      let testStart: any = this.convertTimeToHourMinMeridian(t.start_time);
      let testStart1: any = this.convertTimeToHourMinMeridian(t.end_time);
      let start = this.convertIntoFullClock(testStart.hour, testStart.minute, testStart.meridian);
      let end = this.convertIntoFullClock(testStart1.hour, testStart1.minute, testStart1.meridian);
      t.duration = this.getDifference(start, end);
      obj.extraSchd.push(t);
    }
    return obj;
  }


  updateCustomClass() {
    if (this.customTable.length == 0) {
      this.messageToast('error', 'Error', 'Please provide dates');
      return;
    }
    let obj = this.makeJsonForCustomClass();
    this.classService.createWeeklyBatchPost(obj).subscribe(
      res => {
        console.log(res);
        this.messageToast('success', 'Updated', 'Details Updated Successfully');

      },
      err => {
        this.messageToast('error', 'Error', err.error.message);
        console.log(err);
      }
    )
  }




  addKeyInData(data) {
    data.forEach(element => {
      element.uiSelected = '';
      element.schd_id = '';
      element.duration = '';
      element.day_of_week = '';
      element.start_time = {
        hour: '',
        minute: '',
        meridian: '',
      };
      element.end_time = {
        hour: '',
        minute: '',
        meridian: '',
      };
    });
    return data;
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


  messageToast(Errortype, Errortitle, message) {
    let msg = {
      type: Errortype,
      title: Errortitle,
      body: message
    }
    this.appC.popToast(msg);
  }

}
