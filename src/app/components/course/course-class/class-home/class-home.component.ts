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

  isProfessional: boolean = false;
  busy: Subscription;
  isRippleLoad: boolean = false;
  subBranch: any[] = [];
  masterCourse: any[] = [];
  teachers: any[] = [];
  instituteSetting: any[] = [];
  courseList: any[] = [];

  isClassFormFilled: boolean = false;

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

  courseModelBatch: any;
  courseModelStdList: any[] = [];
  courseModelSubList: any[] = [];
  courseModelBatchList: any[] = [];

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
      )
    }/* Course Model */
    else {
      this.classService.getAllSubBranches().subscribe(
        res => {
          this.subBranch = res;
        },
        err => { }
      )

      this.classService.getAllMasterCourse().subscribe(
        res => {
          this.masterCourse = res;
        },
        err => { }
      )

      this.classService.getAllTeachers().subscribe(
        res => {
          this.teachers = res;
        },
        err => { }
      )
    }


    return this.classService.getInstituteSettings().subscribe(
      res => {
        this.isRippleLoad = false;
        this.instituteSetting = res;
      },
      err => { }
    )

  }

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

  submitMasterBatch() {
    console.log(this.fetchMasterBatchModule);
    
    /* standard selected */
    if (this.fetchMasterBatchModule.standard_id != '-1' && this.fetchMasterBatchModule.standard_id != undefined) {
      
      /* subject selected  */
      if (this.fetchMasterBatchModule.subject_id != '-1' && this.fetchMasterBatchModule.subject_id != undefined) {
        
        /* batch selected */
        /* Success */
        /*  */
        if (this.fetchMasterBatchModule.batch_id != '-1' && this.fetchMasterBatchModule.batch_id != undefined) {
          
          console.log(this.fetchMasterBatchModule.batch_id);
          this.isClassFormFilled = true;
          alert("std yes sub yes batch yes");
        }
        /* batch not selected */
        /* Error */
        /*  */
        else {
          let msg = {
            type: 'error',
            title: 'Batch Not Selected',
            body: 'Please select valid input'
          }
          this.appC.popToast(msg);
        }
      }
      /* subject not selected */
      else {
        let msg = {
          type: 'error',
          title: 'Subject And Batch Invalid',
          body: 'Please select valid input'
        }
        this.appC.popToast(msg);
      }
    }
    /* standard not selected */
    else if (this.fetchMasterBatchModule.standard_id == '-1' && this.fetchMasterBatchModule.standard_id == undefined) {
      
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
      else {
        /* batch selected */
        /* Success */
        /*  */
        if (this.fetchMasterBatchModule.batch_id != '-1' && this.fetchMasterBatchModule.batch_id != undefined) {
          this.isClassFormFilled = true;
          alert("std no sub no batch yes");
        }
        /* batch not selected */
        /* Error */
        /*  */
        else {
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


}
