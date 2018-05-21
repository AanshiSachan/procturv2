import { Component, OnInit } from '@angular/core';
import { timeTableService } from '../../../services/TimeTable/timeTable.service';
import { AppComponent } from '../../../app.component';
import * as moment from 'moment';

@Component({
  selector: 'app-time-table',
  templateUrl: './time-table.component.html',
  styleUrls: ['./time-table.component.scss']
})
export class TimeTableComponent implements OnInit {
  currentDate :any;
  weekstart:any;
  weekend :any;
  courseData: any = [];
  subjectData: any = [];
  masterCoursesData: any = [];
  getTeachersData: any = [];
  timeTableObj: any;
  datesArr = [];
  showtable: boolean;
  selectMasterField: boolean;
  startdateweek = moment().startOf('week').add(1, 'day').format('DD-MMM-YYYY');
  enddateweek = moment().endOf('week').add(1, 'day').format('DD-MMM-YYYY');

  fetchFieldData = {
    batch_id: "-1",
    course_id: "-1",
    enddate: "",
    institute_id: "",
    isExamIncludedInTimeTable: "Y",
    master_course: "-1",
    standard_id: "-1",
    startdate: "",
    subject_id: "-1",
    teacher_id: "-1",
    type: 2
  }


  constructor(private timeTableServ: timeTableService, private appC: AppComponent) { }

  ngOnInit() {
    this.getMasterCoursesData();
    this.getTeachersNameData();
  }

  /*=============================getMasterCourseData================================================================
  ========================================================================================================== */
  getMasterCoursesData() {
    this.timeTableServ.getMasterCourses().subscribe
      (
      res => {
        this.masterCoursesData = res;
        console.log(this.masterCoursesData);
      },
      err => {
        console.log(err);
      }
      )
  }
  /*=========================================get CoursesData=============================================
  ======================================================================================================== */
  getCourses(i) {
    this.fetchFieldData.batch_id = "-1";
    this.fetchFieldData.course_id = "-1";
    this.selectMasterField = true;
    this.timeTableServ.getCoursesData(i).subscribe
      (
      res => {
        this.courseData = res.coursesList;
        console.log(this.courseData);
      },
      err => {
        console.log(err);
      }
      )
  }
  /*======================================getSubjectData==============================================
  ====================================================================================================== */
  getSubjects(i) {
    this.fetchFieldData.batch_id = "-1";
    this.selectMasterField = false;
    this.timeTableServ.getSubjectData(i).subscribe
      (
      res => {
        this.subjectData = res.batchesList;
        console.log(this.subjectData);
      },
      err => {
        console.log(err);
      }
      )
  }
  /*================================getTeacherData=====================================================
  ==================================================================================================== */
  getTeachersNameData() {
    this.selectMasterField = false;
    this.timeTableServ.getTeachersName().subscribe
      (
      res => {
        this.getTeachersData = res;
        console.log(res);
      },
      err => {
        console.log(err);
      }
      )
  }
  /*==================================view Time Table Data================================================
  ========================================================================================================= */
  fetchTimeTableReport(flag) {
    this.showtable = false;
    this.datesArr = [];
    if (this.fetchFieldData.master_course == "-1" && this.fetchFieldData.teacher_id == "-1") {
      let obj = {
        type: "error",
        title: "Unable to Fetch Report",
        body: "Select a Master Course or Teacher"
      }
      this.appC.popToast(obj);
      return;
    }


    if (flag == '-1') {
      this.startdateweek = moment(this.startdateweek).subtract(7, 'days').format('DD-MMM-YYYY');
      this.enddateweek = moment(this.enddateweek).subtract(7, 'days').format('DD-MMM-YYYY');
    }
    else if (flag == '1') {
      this.startdateweek = moment(this.startdateweek).add(7, 'days').format('DD-MMM-YYYY');
      this.enddateweek = moment(this.enddateweek).add(7, 'days').format('DD-MMM-YYYY');
    }
    else {
      this.startdateweek = moment().startOf('week').add(1, 'day').format('DD-MMM-YYYY');
      this.enddateweek = moment().endOf('week').add(1, 'day').format('DD-MMM-YYYY');
    }
    this.fetchFieldData.enddate = moment(this.enddateweek).format('YYYY-MM-DD');
    this.fetchFieldData.startdate = moment(this.startdateweek).format('YYYY-MM-DD');
    this.timeTableServ.getTimeTable(this.fetchFieldData).subscribe
      (
      res => {
        if (this.selectMasterField && res.length != 0) {
          this.timeTableObj = res[0].batchTimeTableList;
          this.datesArr = Object.keys(this.timeTableObj);
        }
        else {
          if (res.length != 0) {
            this.timeTableObj = res.batchTimeTableList;
            this.datesArr = Object.keys(this.timeTableObj);
          }
        }
        this.showtable = true;
      },
      err => {
        console.log(err);
      }
      )
  }

  gotoPreviousWeek() {
    this.weekstart= moment(this.currentDate).isoWeekday("Monday").format("YYYY-MM-DD");
    this.weekend = moment(this.currentDate).isoWeekday("Sunday").format("YYYY-MM-DD");

  }

  gotoNextWeek(){
    this.weekstart = moment(this.currentDate).isoWeekday("Monday").format("YYYY-MM-DD");
    this.weekend = moment(this.currentDate).isoWeekday("Sunday").format("YYYY-MM-DD");
  }
}



