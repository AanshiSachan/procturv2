import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AuthenticatorService } from '../../../../../services/authenticator.service';
import { ClassScheduleService } from '../../../../../services/course-services/class-schedule.service';
import { CourseListService } from '../../../../../services/course-services/course-list.service';
import { MessageShowService } from '../../../../../services/message-show.service';
import { ExamService } from '../../../../../services/report-services/exam.service';

@Component({
  selector: 'app-exam-report-home',
  templateUrl: './exam-report-home.component.html',
  styleUrls: ['./exam-report-home.component.scss']
})
export class ExamReportHomeComponent implements OnInit {

    jsonFlag = {
      isProfessional: false,
      institute_id: '',
      type:'batch'
    };

    reportJSON: any = {
      master_course_name: "",
      standard_id:  "",
      subject_id: "",
      from_date: moment().isoWeekday("Monday").format("YYYY-MM-DD"),
      to_date: moment().weekday(7).format("YYYY-MM-DD")
    };

    masterCourseList: any;
    standardtList: any;
    subjectList: any;

    examReport: any;
    weeklyExamReportData: any = [];
    masterCourseExamReportData: any = [];
    standardExamReportData: any = [];
    mastercourse: string = "-1";
    standard: string = "-1";
    subject: string = "-1";
    addDate: any = moment().isoWeekday("Monday").format("DD MMM YYYY") +" - "+moment().weekday(7).format("DD MMM YYYY");

    constructor(
      private router: Router,
      private examdata: ExamService,
      private courseList: CourseListService,
      private auth: AuthenticatorService,
      private msgService: MessageShowService,
      private classService: ClassScheduleService
    ) { }

    ngOnInit() {
      this.auth.institute_type.subscribe(
        res => {
          if (res == 'LANG') {
            this.jsonFlag.isProfessional = true;
            this.jsonFlag.type='batch';
          } else {
            this.jsonFlag.isProfessional = false;
            this.jsonFlag.type='course';
          }
        }
      )
      this.addDate = this.reportJSON.from_date +" - "+ this.reportJSON.to_date;   // this will fetch exam report for current week
      this.jsonFlag.institute_id = sessionStorage.getItem('institute_id');
      this.getPreRequiredData();
      this.getExamReport();
    }

    getExamReport(){
      this.examReport = [];
      this.auth.showLoader();
      this.examdata.getAllExamReport(this.reportJSON).subscribe(
        res => {
          this.auth.hideLoader();
          this.examReport = res;
        },
        err => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.info, 'Info', err.error.message);
          this.auth.hideLoader();
        }
      );
    }

    getPreRequiredData(){
      this.auth.showLoader();
      this.courseList.getCourseListFromServer().subscribe(    // get mastercourse
        res => {
          this.auth.hideLoader();
          this.masterCourseList = res;
          let master = sessionStorage.getItem('masterCourseForReport');
          if(master != "" && master != null && master != undefined){
              this.mastercourse = master;
              sessionStorage.setItem('masterCourseForReport', '');
              this.getExamReportForMasterCourse()
          }
        },
        err => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Please check your internet connection or contact at support@proctur.com if the issue persist');
          this.auth.hideLoader();
        }
      );

      this.auth.showLoader();
      this.courseList.getStandardListFromServer().subscribe(  // get standard
        res => {
          this.auth.hideLoader();
          this.standardtList = res;
          let stand = sessionStorage.getItem('standaradForReport');
          if(stand != "" && stand != null && stand != undefined ){
              this.standard = stand;
              sessionStorage.setItem('standaradForReport', '');
              this.getExamReportForStandard();
          }
        },
        err => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Please check your internet connection or contact at support@proctur.com if the issue persist');
          this.auth.hideLoader();
        }
      );
    }


    addNewDate(e){
      let fromDate = moment(e[0]).format("YYYY-MM-DD");
      let toDate = moment(e[1]).format("YYYY-MM-DD");
      let result = moment(toDate).diff(fromDate, 'days');
      if(result <= 30){
        this.clearJSON();
        this.reportJSON.from_date = moment(e[0]).format("YYYY-MM-DD");
        this.reportJSON.to_date = moment(e[1]).format("YYYY-MM-DD");
        this.examReport = [];
        this.weeklyExamReportData = [];
        this.auth.showLoader();
        this.examdata.getAllExamReport(this.reportJSON).subscribe(
          res => {
            this.auth.hideLoader();
            this.examReport = res;
            this.weeklyExamReportData = this.examReport;
          },
          err => {
            this.msgService.showErrorMessage(this.msgService.toastTypes.info, 'Info', err.error.message);
            this.auth.hideLoader();
          }
        );
      }
      else{
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Date difference should not more than a month');
      }

    }

    getExamReportForMasterCourse(){   // get exam report data for master course and course
      this.clearJSON();
      this.reportJSON.master_course_name = this.mastercourse;
      this.examReport = [];
      this.masterCourseExamReportData = [];
      this.auth.showLoader();
      this.examdata.getAllExamReport(this.reportJSON).subscribe(
        res => {
          this.auth.hideLoader();
          this.examReport = res;
          this.masterCourseExamReportData = this.examReport;
        },
        err => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
          this.auth.hideLoader();
        }
      );
    }

    getExamReportForStandard(){   // get exam reports for stand
      if(!this.jsonFlag.isProfessional){
        this.clearJSON();
        this.reportJSON.standard_id = this.standard;
        this.examReport = [];
        this.auth.showLoader();
        this.examdata.getAllExamReport(this.reportJSON).subscribe(
          res => {
            this.auth.hideLoader();
            this.examReport = res;
            this.standardExamReportData = this.examReport;
          },
          err => {
            this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
            this.auth.hideLoader();
          }
        );
      }
      else{
        // Get Subject List for Batch Model
        this.auth.showLoader();
        this.classService.getStandardSubjectList(this.standard, "-1", "Y").subscribe(
          res => {
            this.auth.hideLoader();
            this.subjectList = res.subjectLi;
          },
          err => {
            this.auth.hideLoader();
            this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
           }
        );
      }

    }

    getExamReportForStandardAndSubject(){  // get exam reports for stand and subject
      this.clearJSON();
      this.reportJSON.subject_id = this.subject;
      this.examReport = [];
      this.standardExamReportData = [];
      this.auth.showLoader();
      this.examdata.getAllExamReport(this.reportJSON).subscribe(
        res => {
          this.auth.hideLoader();
          this.examReport = res;
          this.standardExamReportData = this.examReport;
        },
        err => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
          this.auth.hideLoader();
        }
      );
    }

    clearJSON(){
      this.reportJSON.master_course_name = "";
      this.reportJSON.standard_id = "";
      this.reportJSON.subject_id = "";
      this.reportJSON.from_date = "";
      this.reportJSON.to_date = "";
    }

    openCalendar(id){
      document.getElementById(id).click();
    }


    routeTo(course_id){  // Navigate to Course Wise Report Page
      if(this.jsonFlag.isProfessional){  // for batch model
        sessionStorage.setItem('subejctIdForReport', this.subject);
        for(let i = 0; i < this.subjectList.length; i++){
         if(this.subjectList[i].subject_id == this.subject){
           sessionStorage.setItem('masterCourseForReport', this.subjectList[i].subject_name);
         }
       }
      }
      else{
        sessionStorage.setItem('masterCourseForReport', this.mastercourse);
      }
      this.router.navigate(['/view/'+this.jsonFlag.type+'/reports/exam-dashboard/courseWise/'+course_id]);   // course wise page routing for both model
    }

    routeForStandard(subject_id, subjectName){   // navigate to teacher wise performance page // on last page
      sessionStorage.setItem('standaradForReport', this.standard);
      sessionStorage.setItem('subjectName', subjectName);
      this.router.navigate(['/view/'+this.jsonFlag.type+'/reports/exam-dashboard/teacherWise/'+subject_id]);
    }

  }
