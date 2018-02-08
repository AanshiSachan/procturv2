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
  createCustomSchedule:boolean = false;



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
  hourArr: any[] = ['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  minArr: any[] = ['', '00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
  meridianArr: any[] = ['', "AM", "PM"];



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
    //console.log(ev);
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
    if(ev == "OTHER"){
      this.createCustomSchedule = true;
    }else{
      this.createCustomSchedule = false;
    }
  }
  /* ============================================================================================ */
  /* ============================================================================================ */
  applySelectedFrequency() {

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


  /* ============================================================================================ */
  /* ============================================================================================ */


  /* ============================================================================================ */
  /* ============================================================================================ */

}
