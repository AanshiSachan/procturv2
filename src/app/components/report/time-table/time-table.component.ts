import { Component, OnInit } from '@angular/core';
import { timeTableService } from '../../../services/TimeTable/timeTable.service';
import { AppComponent } from '../../../app.component';
import * as moment from 'moment';
//import { window } from '../../../../assets/imported_modules/ngx-bootstrap/utils/facade/browser';

@Component({
  selector: 'app-time-table',
  templateUrl: './time-table.component.html',
  styleUrls: ['./time-table.component.scss']
})
export class TimeTableComponent implements OnInit {
  flag: boolean = false;
  courseData: any = [];
  notProTimeTable = [];
  subjectData: any = [];
  emptytimeTable: boolean = false;
  masterCoursesData: any = [];
  getTeachersData: any = [];
  timeTableObj: any;
  timeTablePrint: any = [];
  datesArr = [];
  namesArr = [];
  timeTableArr = [];
  onlyMasterData: boolean = false;
  showtable: boolean;
  isProfessional: boolean;
  teacherBox: boolean;
  batchBox: boolean;
  selectData = "all";
  masterPro: any[] = [];
  coursePro: any[] = [];
  batchPro: any[] = [];
  maxEntries = 0;
  startdateweek = moment().startOf('week').add(1, 'day').format('DD-MMM-YYYY');
  enddateweek = moment().endOf('week').add(1, 'day').format('DD-MMM-YYYY');
  showFilters = true;;
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
          //console.log(err);
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
        }
        )
    }
  }

  getSubjects(i) {
    if (this.isProfessional) {
      this.fetchFieldDataPro.batch_id = "-1";

      this.timeTableServ.getProData(this.fetchFieldDataPro.standard_id, this.fetchFieldDataPro.subject_id).subscribe
        (
        res => {
          this.batchPro = res.batchLi;
        },
        err => {

        }
        )
    }
    else {
      this.onlyMasterData = false;
      this.fetchFieldData.batch_id = "-1";
      this.timeTableServ.getSubjectData(i).subscribe
        (
        res => {
          this.subjectData = res.batchesList;
          console.log(this.subjectData);
        },
        err => {

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

      },
      err => {

      }
      )
  }

  toggleFilter() {
    if (this.showFilters) {
      this.showFilters = false;
    } else {
      this.showFilters = true;
    }
  }

  fetchTimeTableReport(flag) {
    this.datesArr = [];
    if (this.fetchFieldData.master_course == "" && this.fetchFieldData.teacher_id == "-1") {
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
    this.toggleFilter();
    this.fetchFieldData.enddate = moment(this.enddateweek).format('YYYY-MM-DD');
    this.fetchFieldData.startdate = moment(this.startdateweek).format('YYYY-MM-DD');
    this.timeTableServ.getTimeTable(this.fetchFieldData).subscribe
      (
      res => {
        this.notProTimeTable = [];
        this.namesArr = [];
        this.datesArr = [];
        if (res.length != 0 && this.onlyMasterData) {

          res.map((element) => {
            this.namesArr.push(element.course_name);
            this.timeTableObj = element.batchTimeTableList;
            this.maxEntries = 0;
            this.maxDataLengthCount();
            this.timetableDataConstructor();
          })
          console.log(this.namesArr);
          //  this.timeTableObj = res[0].batchTimeTableList;
        }

        else {
          this.timeTableObj = res.batchTimeTableList;
          this.namesArr.push(res.course_name);
          this.maxEntries = 0;
          this.maxDataLengthCount();
          this.timetableDataConstructor();
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
    this.datesArr = [];
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
    this.toggleFilter();
    this.fetchFieldDataPro.enddate = moment(this.enddateweek).format('YYYY-MM-DD');
    this.fetchFieldDataPro.startdate = moment(this.startdateweek).format('YYYY-MM-DD');

    this.timeTableServ.getTimeTable(this.fetchFieldDataPro).subscribe
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
        this.maxEntries = 0;
        this.maxDataLengthCount();
        this.timetableDataConstructor();
        this.showtable = true;

      },
      err => {

      }
      )
  }
  /*==============================This is used to create custom json for the table =====================================*/

  timetableDataConstructor() {
    this.timeTableArr = [];
    for (var i = 0; i < 7; i++) {
      this.flag = false;
      for (let prop in this.timeTableObj) {
        if (moment(this.startdateweek).add(i, 'day').format("DD-MM-YYYY") == moment(prop).format("DD-MM-YYYY") && (moment(this.startdateweek).add(i, 'day').format("dddd") == moment(prop).format("dddd"))) {
          let obj = {
            headerDate: moment(prop).format("DD"),
            headerDays: moment(prop).format("ddd"),
            data: this.timeTableObj[prop],
          }
          this.timeTableArr.push(obj);
          this.flag = true;
          break;
        }
      }

      if (this.flag == false) {
        let obj = {
          headerDate: (moment(this.startdateweek).add(i, 'day').format("DD")),
          headerDays: (moment(this.startdateweek).add(i, 'day').format("ddd")),
          data: [],
        }
        this.emptytimeTable = true;
        this.timeTableArr.push(obj);
      }
      this.timeTableArr.map((element) => {
        element.data.length = this.maxEntries;
      })
    }
    if (!this.isProfessional) {
      this.notProTimeTable.push(this.timeTableArr);
    }
    console.log(this.timeTableArr);
  }

  maxDataLengthCount() {
    for (let i in this.timeTableObj) {
      if (this.timeTableObj[i].length > this.maxEntries) {
        this.maxEntries = this.timeTableObj[i].length;
      }
    }
  }

  printTimeTableData() {

    var header = document.getElementsByTagName('core-header');
    var sidebar = document.getElementsByTagName('core-sidednav');

    [].forEach.call(header, function (el) {
      el.classList.add('hide');
    });
    [].forEach.call(sidebar, function (el) {
      el.classList.add('hide');
    });

    [].forEach.call(document.querySelectorAll('.bot-wrapper'), function (el) {
      el.style.display = 'none';
    });

    document.getElementById('middle-sectionId').style.display = "none";
    document.getElementById('printTimeTable').style.display = "block";
    window.print();
    document.getElementById('middle-sectionId').style.display = "block";
    document.getElementById('printTimeTable').style.display = "none";
    document.getElementById('tableHead').style.display = "none";
    document.getElementById('header').style.display = "block";
    document.getElementById('commonLeftNav').style.display = "block";
    [].forEach.call(document.querySelectorAll('.bot-wrapper'), function (el) {
      el.style.display = 'block';
    });
    [].forEach.call(header, function (el) {
      el.classList.remove('hide');
    });
    [].forEach.call(sidebar, function (el) {
      el.classList.remove('hide');
    });
  }

}






