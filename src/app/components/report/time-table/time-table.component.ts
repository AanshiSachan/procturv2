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
  courseData: any = [];
  subjectData: any = [];
  masterCoursesData: any = [];
  getTeachersData: any = [];
  timeTableObj: any;
  timeTablePrint: any = [];
  datesArr = [];
  onlyMasterData: boolean = false;
  showtable: boolean;
  isProfessional: boolean;
  teacherBox: boolean;
  batchBox: boolean;
  selectData = "all";
  masterPro: any[] = [];
  coursePro: any[] = [];
  batchPro: any[] = [];


  startdateweek = moment().startOf('week').add(1, 'day').format('DD-MMM-YYYY');
  enddateweek = moment().endOf('week').add(1, 'day').format('DD-MMM-YYYY');
  fetchFieldData = {
    batch_id: "-1",
    course_id: "-1",
    enddate: "",
    institute_id: "",
    isExamIncludedInTimeTable: "Y",
    master_course: "",
    standard_id: "-1",
    startdate: "",
    subject_id: "-1",
    teacher_id: "-1",
    type: 2
  }

  fetchFieldDataPro = {
    batch_id: "-1",
    course_id: "-1",
    enddate: "",
    institute_id: "",
    isExamIncludedInTimeTable: "Y",
    master_course: "",
    standard_id: "-1",
    startdate: "",
    subject_id: "-1",
    teacher_id: "-1",
    type: 2
  }

  constructor(private timeTableServ: timeTableService, private appC: AppComponent) { }

  ngOnInit() {
    this.isProfessional = sessionStorage.getItem('institute_type') == 'LANG';
    if (this.isProfessional) {
      this.fetchTimeTableReportPro('0');
    }
    else {
      this.getMasterCoursesData();
      this.getTeachersNameData();
    }
    this.timeTableHeader();

  }

  /*========================================================================================================
  ========================================================================================================== */
  getMasterCoursesData() {
    if (this.isProfessional) {
      this.fetchFieldDataPro.standard_id = "-1";
      this.fetchFieldDataPro.batch_id = "-1";
      this.timeTableServ.getProData(this.fetchFieldDataPro.standard_id, this.fetchFieldDataPro.subject_id).subscribe
        (
        res => {
          this.masterPro = res.standardLi;
          this.batchPro = res.batchLi;
        },
        err => {
          console.log(err);
        }
        )
    }
    else {
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
  }

  getCourses(i) {
    if (this.isProfessional) {
      this.fetchFieldDataPro.batch_id = "-1";
      this.fetchFieldDataPro.subject_id = "-1";
      this.timeTableServ.getProData(this.fetchFieldDataPro.standard_id, this.fetchFieldDataPro.subject_id).subscribe
        (
        res => {
          this.coursePro = res.subjectLi;
          this.batchPro = res.batchLi;
        },
        err => {
          console.log(err);
        }
        )
    }
    else {
      this.fetchFieldData.batch_id = "-1";
      this.fetchFieldData.course_id = "-1";
      this.onlyMasterData = true;
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
  }

  getSubjects(i) {
    if (this.isProfessional) {
      this.fetchFieldDataPro.batch_id = "-1";
      this.onlyMasterData = false;
      this.timeTableServ.getProData(this.fetchFieldDataPro.standard_id, this.fetchFieldDataPro.subject_id).subscribe
        (
        res => {
          this.batchPro = res.batchLi;
        },
        err => {
          console.log(err);
        }
        )
    }
    else {
      this.fetchFieldData.batch_id = "-1";
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
  }

  getTeachersNameData() {
    this.onlyMasterData = false;
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

  fetchTimeTableReport(flag) {
    // this.showtable = false;
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
    this.timeTableHeader();
    this.fetchFieldData.enddate = moment(this.enddateweek).format('YYYY-MM-DD');
    this.fetchFieldData.startdate = moment(this.startdateweek).format('YYYY-MM-DD');

    this.timeTableServ.getTimeTable(this.fetchFieldData).subscribe
      (
      res => {
        this.datesArr = [];
        if (res.length != 0) {
          this.timeTableObj = res[0].batchTimeTableList;
          // this.datesArr = Object.keys(this.timeTableObj);
        }
        else {
          if (res.length != 0) {
            this.timeTableObj = res.batchTimeTableList;
            //  this.datesArr = Object.keys(this.timeTableObj);
          }
        }
        for (let key in this.timeTableObj) {
          let obj = {
            id: key,
            data: this.timeTableObj[key]
          }
          this.datesArr.push(obj);
        }
        this.showtable = true;
      },
      err => {
        console.log(err);
      }
      )
  }

  radiochangeData(para) {
    this.selectData = para;
    this.fetchFieldDataPro.teacher_id = "-1";
    this.fetchFieldDataPro.batch_id = "-1";
    this.fetchFieldDataPro.standard_id = "-1";
    this.fetchFieldDataPro.subject_id = "-1";
    if (para == 'all') {
      this.batchBox = false;
      this.teacherBox = false;
    }
    else if (para == 'teacher') {
      this.batchBox = false;
      this.teacherBox = true;
      this.getTeachersNameData();
    }
    else if (para == 'batch') {
      this.teacherBox = false;
      this.batchBox = true;
      this.getMasterCoursesData();
    }
  }

  fetchTimeTableReportPro(data) {
    // this.showtable = false;
    this.datesArr = [];

    // if (this.selectData == "all") {

    // }
    if (this.selectData == "teacher") {
      if (this.fetchFieldDataPro.teacher_id == "-1") {
        let obj = {
          type: "error",
          title: "Unable to Fetch Report",
          body: "Select a Teacher"
        }
        this.appC.popToast(obj);
        return;
      }
    }
    else if (this.selectData == "batch") {
      if (this.fetchFieldDataPro.batch_id == "-1") {
        let obj = {
          type: "error",
          title: "Unable to Fetch Report",
          body: "Select a Batch"
        }
        this.appC.popToast(obj);
        return;
      }
    }

    if (data == '-1') {
      this.startdateweek = moment(this.startdateweek).subtract(7, 'days').format('DD-MMM-YYYY');
      this.enddateweek = moment(this.enddateweek).subtract(7, 'days').format('DD-MMM-YYYY');
    }
    else if (data == '1') {
      this.startdateweek = moment(this.startdateweek).add(7, 'days').format('DD-MMM-YYYY');
      this.enddateweek = moment(this.enddateweek).add(7, 'days').format('DD-MMM-YYYY');
    }
    else {
      this.startdateweek = moment().startOf('week').add(1, 'day').format('DD-MMM-YYYY');
      this.enddateweek = moment().endOf('week').add(1, 'day').format('DD-MMM-YYYY');
    }
    this.timeTableHeader();
    this.fetchFieldData.enddate = moment(this.enddateweek).format('YYYY-MM-DD');
    this.fetchFieldData.startdate = moment(this.startdateweek).format('YYYY-MM-DD');

    this.timeTableServ.getTimeTable(this.fetchFieldData).subscribe
      (
      res => {
        if (res.length != 0) {
          this.timeTableObj = res.batchTimeTableList;
          this.datesArr = Object.keys(this.timeTableObj);
        }

        for (let stat in this.timeTableObj) {
          let obj = {
            id: stat,
            data: this.timeTableObj[stat]
          }
          this.datesArr.push(obj);
        }

        this.showtable = true;
      },
      err => {
        console.log(err);
      }
      )
  }

  timeTableHeader() {
    this.timeTablePrint = [];
    for (var i = 0; i < 7; i++) {
      this.timeTablePrint.push(moment(this.startdateweek).add(i, 'day').format("DD-MMM-YYYY dddd"));
    }
  }

}






