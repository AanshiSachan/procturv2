import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ExamService } from '../../../../services/report-services/exam.service';
import { CourseListService } from '../../../../services/course-services/course-list.service';
import { AppComponent } from '../../../../app.component';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { MessageShowService } from '../../../../services/message-show.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-course-wise',
  templateUrl: './course-wise.component.html',
  styleUrls: ['./course-wise.component.scss']
})
export class CourseWiseComponent implements OnInit {

  jsonFlag = {
    isProfessional: false,
    institute_id: '',
    isRippleLoad: false
  };

  course_id: String;
  courseWiseReportList: any;
  course: any = "-1";

  masterCourse: any;
  masterCourseList: any;
  coursesList: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private examdata: ExamService,
    private courseList: CourseListService,
    private auth: AuthenticatorService,
    private msgService: MessageShowService,
  ) {

    this.auth.institute_type.subscribe(
      res => {
        if (res == 'LANG') {
          this.jsonFlag.isProfessional = true;
        } else {
          this.jsonFlag.isProfessional = false;
        }
      }
    )
    this.masterCourse = sessionStorage.getItem('masterCourseForReport');
    this.course_id = this.route.snapshot.paramMap.get('id');
    this.getCourseWiseReport();
    this.updateCoursesList();
  }

  ngOnInit() {

  }

  getCourseWiseReport(){
    this.jsonFlag.isRippleLoad = true;
    this.examdata.getCourseWiseReport(this.course_id).subscribe(
      res => {
        this.jsonFlag.isRippleLoad = false;
        this.courseWiseReportList = res;
      },
      err => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', err.error.message);
        this.jsonFlag.isRippleLoad = false;
      }
    );
  }

  updateCoursesList(){
    this.courseList.getCourseListFromServer().subscribe(
      res => {
        this.jsonFlag.isRippleLoad = false;
        this.masterCourseList = res;
        for(let i = 0; i < this.masterCourseList.length; i++){
          if(this.masterCourseList[i].master_course == this.masterCourse){
            this.coursesList = this.masterCourseList[i].coursesList;
            this.course = this.course_id;
          }
        }
      },
      err => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', 'Please check your internet connection or contact at support@proctur.com if the issue persist');
        this.jsonFlag.isRippleLoad = false;
      }
    );
  }

  getExamReport(){
    this.course_id = this.course;
    this.getCourseWiseReport();
  }

}
