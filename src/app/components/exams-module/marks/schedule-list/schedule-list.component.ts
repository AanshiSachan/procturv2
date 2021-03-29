import { Component, OnInit } from '@angular/core';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { CoursePlanner } from '../../../course-module/course-planner/course-planner.model';
import * as moment from 'moment';
import { HttpService } from '../../../../services/http.service';
import { MessageShowService } from '../../../../services/message-show.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-schedule-list',
  templateUrl: './schedule-list.component.html',
  styleUrls: ['./schedule-list.component.scss']
})
export class ScheduleListComponent implements OnInit {
  coursePlannerFilters: CoursePlanner = new CoursePlanner();
  allData: any = [];
  courseLevelSchedDate: any = new Date();
  masterCourse: any = [];
  courseList: any = [];
  subjectList: any = [];
  fullResponse: any = [];
  ExamTypeData: any = [];
  marks_dist_setting: any = -1;
  exam_type_id: any = '-1';
  isFilterSelected:boolean = false;

  constructor(
    private auth: AuthenticatorService,
    private _httpService: HttpService,
    private messageService: MessageShowService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.coursePlannerFilters.from_date = moment(new Date).format('YYYY-MM-DD');
    this.coursePlannerFilters.to_date = moment(new Date).format('YYYY-MM-DD');
    this.marks_dist_setting = sessionStorage.getItem('marks_dist_setting');
    this.getScheduleList();
    this.getStandard();
    if (this.marks_dist_setting != 1 && this.marks_dist_setting != 5 && this.marks_dist_setting != 6) {
      this.getExamType();
    }
  }

  getFilterData() {
    if(this.coursePlannerFilters.standard_id == '-1' || this.exam_type_id == '-1' || this.coursePlannerFilters.course_id == '-1' || this.coursePlannerFilters.batch_id == '-1') {
      this.messageService.showErrorMessage('error','','Please select mandatory fields');
    } else {
      this.coursePlannerFilters.from_date == '';
      this.coursePlannerFilters.to_date == '';
      this.isFilterSelected = true;
      this.getScheduleList();
    }
  }

  getScheduleList() {
    // this.jsonFlag.showHideColumn = false;
    this.auth.showLoader();
    let obj: any = this.coursePlannerFilters;
    obj.institute_id = sessionStorage.getItem('institute_id');
    obj.from_date = moment(obj.from_date).format("YYYY-MM-DD");
    obj.to_date = moment(obj.to_date).format("YYYY-MM-DD");
    obj.isCancelled = "Y";
    obj.isCompleted = "Y";
    obj.isMarksUpdate = "Y";
    obj.isPending = "Y";
    obj.isUpcoming = "Y";
    obj.exam_type_id = this.exam_type_id;
    delete(obj.master_course_name);
    if(this.isFilterSelected) {
      obj.from_date = '';
      obj.to_date = '';
    }
    let url = "/api/v1/coursePlanner/category?type=exam";
    this._httpService.postData(url, obj).subscribe(
      res => {
        this.auth.hideLoader();
        this.allData = res;
        if (this.allData.length == 0) {
          this.messageService.showErrorMessage('info', '', "No result found");
        }
      },
      err => {
        this.allData = [];
        this.auth.hideLoader();
        if(this.isFilterSelected) {
          this.messageService.showErrorMessage('error', '', err.error.message);
        }
      }
    );
  }

  examMarksUpdateCourse(obj) {
    this.router.navigateByUrl('/view/exams/marks/update-marks/' + obj.schedule_id);
  }

  getSchedDateForCourse() {
    let date = this.courseLevelSchedDate;
    return date;
  }

  openCalendar(id) {
    document.getElementById(id).click();
  }

  getExamType() {
    this.ExamTypeData = [];
    let url = `/api/v1/courseExamSchedule/fetch-exam-type/${sessionStorage.getItem('institute_id')}?marks_type=${this.marks_dist_setting}`;
    if (this.marks_dist_setting == 1 || this.marks_dist_setting == 5 || this.marks_dist_setting == 6) {
      url = `/api/v1/courseExamSchedule/fetch-exam-type/${sessionStorage.getItem('institute_id')}?marks_type=${this.marks_dist_setting}&standard_id=${this.coursePlannerFilters.standard_id}`
    }
      this._httpService.getData(url).subscribe(
        (res: any) => {
          console.log(res);
          this.ExamTypeData = res.result;
        },
        err => {
          console.log(err);
        }
      )
  }

  updateCourseLevelSched(e) {
    this.coursePlannerFilters.from_date = e;
    this.coursePlannerFilters.to_date = e;
    this.coursePlannerFilters.standard_id = '-1';
    this.coursePlannerFilters.course_id = '-1';
    this.coursePlannerFilters.batch_id = '-1';
    this.exam_type_id = '-1';
    this.isFilterSelected = false;
    this.getScheduleList();
  }

  
  getStandard() {
    let url = "/api/v1/courseMaster/master-course-list/" + sessionStorage.getItem("institute_id") + "?is_standard_wise=true&sorted_by=course_name";
    let keys;
    this.auth.showLoader();
    this._httpService.getData(url).subscribe(
      (data: any) => {
        this.masterCourse = [];
        this.auth.hideLoader();
        this.fullResponse = data.result;
        keys = Object.keys(data.result);

        // console.log("keys", keys);
        // this.masterCourse = keys;
        for (let i = 0; i < keys.length; i++) {
          let obj = {
            masterCourse: '',
            standard_id: 0
          }
          obj.masterCourse = keys[i];
          let temp = this.fullResponse[keys[i]];
          obj.standard_id = (temp.length) ? temp[0].standard_id : '';
          this.masterCourse.push(obj);
        }


      },
      (error: any) => {
        this.auth.hideLoader();
        console.log(error);
      }
    )
  }

  updateCourseList(ev) {
    this.courseList = [];
    this.coursePlannerFilters.course_id = '-1';
    this.coursePlannerFilters.batch_id = '-1';
    let master_course_obj = this.masterCourse.filter(
      (standard)=> (ev == standard.standard_id)
    );
    if (this.marks_dist_setting == 1 || this.marks_dist_setting == 5 || this.marks_dist_setting == 6) {
      this.getExamType();
    }
    let temp = this.fullResponse[master_course_obj[0].masterCourse];
    for (let i = 0; i < temp.length; i++) {
      this.courseList.push(temp[i]);
    }
  }

  updateSubjectList(event) {
    console.log(event);
    this.auth.showLoader();
    this.subjectList = [];
    const url = "/api/v1/courseMaster/fetch/courses/" + sessionStorage.getItem('institute_id') + '/' + event;
    this._httpService.getData(url).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        //console.log('Subject', res);
        this.subjectList = res.batchesList;
      },
      err => {
        this.messageService.showErrorMessage('error', '', err.error.message);
        this.auth.hideLoader();
        //console.log(err);
      }
    )
  }

}
