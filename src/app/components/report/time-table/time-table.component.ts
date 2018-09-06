import { Component, OnInit } from '@angular/core';
import { timeTableService } from '../../../services/TimeTable/timeTable.service';
import { AppComponent } from '../../../app.component';
import * as moment from 'moment';
import { AuthenticatorService } from '../../../services/authenticator.service';

@Component({
  selector: 'app-time-table',
  templateUrl: './time-table.component.html',
  styleUrls: ['./time-table.component.scss']
})
export class TimeTableComponent implements OnInit {
  flag: boolean = false;
  courseData: any = [];
  insContact: string;
  insName: string;
  isRippleLoad: boolean;
  notProTimeTable = [];
  subjectData: any = [];
  masterCoursesData: any = [];
  getTeachersData: any = [];
  timeTableObj: any;
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
  startdateweek = moment().isoWeekday("Monday").format("DD-MMM-YYYY");
  enddateweek = moment().isoWeekday("Sunday").format("DD-MMM-YYYY");
  showFilters: boolean = true;

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

  constructor(
    private timeTableServ: timeTableService,
    private appC: AppComponent,
    private auth: AuthenticatorService
  ) {
    this.insContact = sessionStorage.getItem('inst_phone');
    this.insName = sessionStorage.getItem('institute_name');
  }

  ngOnInit() {
    this.auth.institute_type.subscribe(
      res => {
        if (res == "LANG") {
          this.isProfessional = true;
          this.fetchTimeTableReportPro('0');
          this.showFilters = true;
        } else {
          this.isProfessional = false;
          this.getMasterCoursesData();
          this.getTeachersNameData();
        }
      }
    )
    console.log(this.isProfessional);
  }

  /*========================================================================================================
  ========================================================================================================== */

  getMasterCoursesData() {
    this.isRippleLoad = true;
    if (this.isProfessional) {
      this.fetchFieldDataPro.standard_id = "-1";
      this.fetchFieldDataPro.batch_id = "-1";
      this.timeTableServ.getProData(this.fetchFieldDataPro.standard_id, this.fetchFieldDataPro.subject_id).subscribe
        (
        res => {
          this.masterPro = res.standardLi;
          this.batchPro = res.batchLi;
          this.isRippleLoad = false;
        },
        err => {
          this.isRippleLoad = false;
          console.log(err);
        }
        )
    }
    else {
      this.isRippleLoad = true;
      this.timeTableServ.getMasterCourses().subscribe
        (
        res => {
          this.isRippleLoad = false;
          this.masterCoursesData = res;
          console.log(this.masterCoursesData);
          this.isRippleLoad = false;
        },
        err => {
          this.isRippleLoad = false;
          console.log(err);
        }
        )
    }
  }

  getCourses(i) {
    this.isRippleLoad = true;
    if (this.isProfessional) {
      this.fetchFieldDataPro.batch_id = "-1";
      this.fetchFieldDataPro.subject_id = "-1";
      this.timeTableServ.getProData(this.fetchFieldDataPro.standard_id, this.fetchFieldDataPro.subject_id).subscribe
        (
        res => {
          this.isRippleLoad = false;
          this.coursePro = res.subjectLi;
          this.batchPro = res.batchLi;
        },
        err => {
          this.isRippleLoad = false;
          console.log(err);
        }
        )
    }
    else {
      this.isRippleLoad = true;
      this.fetchFieldData.batch_id = "-1";
      this.subjectData = [];
      this.fetchFieldData.course_id = "-1";
      this.courseData = [];

      this.onlyMasterData = true;
      this.timeTableServ.getCoursesData(i).subscribe
        (
        res => {
          this.isRippleLoad = false;
          this.courseData = res.coursesList;

        },
        err => {
          this.isRippleLoad = false;
          console.log(err);
        }
        )
    }
  }

  getSubjects(i) {
    this.isRippleLoad = true;
    if (this.isProfessional) {
      this.fetchFieldDataPro.batch_id = "-1";
      this.timeTableServ.getProData(this.fetchFieldDataPro.standard_id, this.fetchFieldDataPro.subject_id).subscribe
        (
        res => {
          this.isRippleLoad = true;
          this.batchPro = res.batchLi;
        },
        err => {
          this.isRippleLoad = false;
          console.log(err);
        }
        )
    }
    else {
      this.isRippleLoad = true;
      this.onlyMasterData = false;
      this.fetchFieldData.subject_id = "-1";
      this.subjectData = [];
      this.fetchFieldData.batch_id = "-1";
      this.timeTableServ.getSubjectData(i).subscribe
        (
        res => {
          this.isRippleLoad = false;
          this.subjectData = res.batchesList;
          console.log(this.subjectData);
        },
        err => {
          this.isRippleLoad = false;
          console.log(err);
        }
        )
    }
  }

  getTeachersNameData() {
    this.onlyMasterData = false;
    this.isRippleLoad = true;
    this.timeTableServ.getTeachersName().subscribe(
      res => {
        this.isRippleLoad = false;
        this.getTeachersData = res.sort((a, b) => {
          return a.teacher_name.localeCompare(b.teacher_name);
        });
      },
      err => {
        this.isRippleLoad = false;
        console.log(err);
      })
  }


  /*To show an hide filters */
  toggleFilter() {
    if (this.showFilters) {
      this.showFilters = false;
    } else {
      this.showFilters = true;
    }
  }
  /*fetch time table list for nonProfessional model */
  fetchTimeTableReport(flag) {
    this.isRippleLoad = true;
    if (this.fetchFieldData.master_course == "-1" && this.fetchFieldData.teacher_id == "-1") {
      let obj = {
        type: "error",
        title: "Unable to Fetch Report",
        body: " Please Select a Master Course or Teacher"
      }
      this.appC.popToast(obj);
      this.isRippleLoad = false;
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
      this.startdateweek = moment().isoWeekday("Monday").format("DD-MMM-YYYY");
      this.enddateweek = moment().isoWeekday("Sunday").format("DD-MMM-YYYY");
    }
    this.showFilters = false;
    this.fetchFieldData.enddate = moment(this.enddateweek).format('YYYY-MM-DD');
    this.fetchFieldData.startdate = moment(this.startdateweek).format('YYYY-MM-DD');
    if (this.fetchFieldData.master_course == "-1") {
      this.onlyMasterData = false;
    }
    this.timeTableServ.getTimeTable(this.fetchFieldData).subscribe
      (
      res => {
        this.isRippleLoad = false;
        this.notProTimeTable = [];
        this.namesArr = [];
        if (res.length != 0 && this.onlyMasterData) {

          res.map((element) => {

            this.namesArr.push(element.course_name);
            this.timeTableObj = element.batchTimeTableList;
            this.maxEntries = 0;
            this.maxDataLengthCount();
            this.timetableDataConstructor();
          })
        }
        else {
          this.isRippleLoad = false;
          this.timeTableObj = res.batchTimeTableList;
          this.namesArr.push(res.course_name);
          this.maxEntries = 0;
          this.maxDataLengthCount();
          this.timetableDataConstructor();
        }
        this.showtable = true;
      },
      err => {

        this.isRippleLoad = false;
        console.log(err);
      }
      )
  }
  /* for changing radio buttons in professional Model */
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
  /*fecthing report in Professional model */
  fetchTimeTableReportPro(data) {
    this.isRippleLoad = true;
    if (this.selectData == "teacher") {
      if (this.fetchFieldDataPro.teacher_id == "-1") {
        let obj = {
          type: "error",
          title: "Unable to Fetch Report",
          body: "Please Select a Teacher"
        }
        this.appC.popToast(obj);
        this.isRippleLoad = false;
        return;
      }
    }
    else if (this.selectData == "batch") {
      if (this.fetchFieldDataPro.batch_id == "-1") {
        this.isRippleLoad = false;
        let obj = {
          type: "error",
          title: "Unable to Fetch Report",
          body: " Please Select a Batch"
        }
        this.appC.popToast(obj);
        this.isRippleLoad = false;
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
      this.startdateweek = moment().isoWeekday("Monday").format("DD-MMM-YYYY");
      this.enddateweek = moment().isoWeekday("Sunday").format("DD-MMM-YYYY");
    }
    this.showFilters = false;
    this.fetchFieldDataPro.enddate = moment(this.enddateweek).format('YYYY-MM-DD');
    this.fetchFieldDataPro.startdate = moment(this.startdateweek).format('YYYY-MM-DD');

    this.timeTableServ.getTimeTable(this.fetchFieldDataPro).subscribe
      (
      res => {
        this.isRippleLoad = false;
        if (res.length != 0) {
          this.timeTableObj = res.batchTimeTableList;
        }
        this.maxEntries = 0;
        this.maxDataLengthCount();
        this.timetableDataConstructor();
        this.showtable = true;
      },
      err => {
        this.isRippleLoad = false;
        console.log(err);
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
        this.timeTableArr.push(obj);
      }
      this.timeTableArr.map((element) => {
        element.data.length = this.maxEntries;
      })
    }
    if (!this.isProfessional) {
      this.notProTimeTable.push(this.timeTableArr);
    }
  }
  /* counting max length in a Coloumn */
  maxDataLengthCount() {
    for (let i in this.timeTableObj) {
      if (this.timeTableObj[i].length > this.maxEntries) {
        this.maxEntries = this.timeTableObj[i].length;
      }
    }
  }

  /* for changing date format */

  dateFormat(printdate) {
    if (printdate == "" || printdate == undefined) {
      return "";
    }
    else {
      return (moment(printdate).format("DD MMM YYYY"))
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
    document.getElementById('printTimeTable').style.pageBreakAfter = "always"
    window.print();
    [].forEach.call(header, function (el) {
      el.classList.remove('hide');
    });
    [].forEach.call(sidebar, function (el) {
      el.classList.remove('hide');
    });
    [].forEach.call(document.querySelectorAll('.bot-wrapper'), function (el) {
      el.style.display = 'block';
    });
    document.getElementById('middle-sectionId').style.display = "block";
    document.getElementById('printTimeTable').style.display = "none";
    // document.getElementById('tableHead').style.display = "none";



  }

}






