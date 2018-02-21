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

  delete(level, index, subIndex){
    if(level == 'course'){
      console.log(this.weekScheduleList[index]);
      console.log('this has to be deleted');
    }
    else if(level == 'subject'){
      console.log(this.weekScheduleList[index].data[subIndex]);
      console.log('this has to be deleted');
    }
    else if(level == 'batch'){}
  }

  notify(level, index, subIndex){
    if(level == 'course'){
      console.log(this.weekScheduleList[index]);
      console.log('this has to be notified');
    }
    else if(level == 'subject'){
      console.log(this.weekScheduleList[index].data[subIndex]);
      console.log('this has to be deleted');
    }
    else if(level == 'batch'){

    }
  }

}
