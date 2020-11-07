import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { AppComponent } from '../../../../app.component';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { StudentReportService } from '../../../../services/report-services/student-report-service/student-report.service';

@Component({
  selector: 'app-view-report-card',
  templateUrl: './view-report-card.component.html',
  styleUrls: ['./view-report-card.component.scss']
})
export class ViewReportCardComponent implements OnInit {

  studentId: any = -1;
  studentReportInfo: any;
  timetablePayLoad: any = {
    batch_id: -1,
    standard_id: -1,
    subject_id: -1,
    teacher_id: -1,
    type: '0',
    student_id: -1,
    startdate: "",
    enddate: ""
  };
  viewAttendancePayload: any = {
    batch_id: -1,
    standard_id: -1,
    enddate: moment().format('YYYY-MM-DD'),
    startdate: moment().format('YYYY-MM-DD'),
    student_id: -1,
    subject_id: -1,
    teacher_id: -1,
    type: '0'
  };
  liAttendanceView: boolean = true;
  liExamView: boolean = false;
  liFeeView: boolean = false;
  liTableView: boolean = false;
  liPTMView: boolean = false;
  @ViewChild('liAttendance',{static: false}) liAttendance: ElementRef;
  @ViewChild('liExam',{static: false}) liExam: ElementRef;
  @ViewChild('liFee',{static: false}) liFee: ElementRef;
  @ViewChild('liTable',{static: false}) liTable: ElementRef;
  @ViewChild('liPTM',{static: false}) liPTM: ElementRef;
  containerWidth: string = "75px";
  displayImage: any = '';
  attendanceList: any = [];
  attendanceDetPopUp: boolean = false;
  tempData: any = [];
  examList: any = [];
  paymentHistoryList: any = [];
  PastFeeList: any = [];
  FutureFeeList: any = [];
  timeTableDet: any = [];
  PTMDetList: any = [];
  timeTableSchedule: any = [];
  coursesAssignedlist: any = [];
  studentDetJson: any = {
    student_name: '',
    student_disp_id: '',
    student_phone: '',
    doj: '',
    photo: ''
  };
  isLangInstitue: boolean = false;
  examType: any = '0';
  courseLevelExamList: any = [];
  futureExamSch: any = [];

  constructor(
    private route: Router,
    private actRoute: ActivatedRoute,
    private apiService: StudentReportService,
    private toastCtrl: AppComponent,
    private auth: AuthenticatorService
  ) { }

  ngOnInit() {
    this.auth.institute_type.subscribe(
      res => {
        if (res == "LANG") {
          this.isLangInstitue = true;
        } else {
          this.isLangInstitue = false;
        }
      }
    )
    this.actRoute.params.subscribe(
      (res: any) => {
        this.studentId = res.id;
      }
    )
    this.timetablePayLoad.student_id = this.studentId;
    this.viewAttendancePayload.student_id = this.studentId;
    this.getStudentInfo();
  }

    // take print of report 
    takePrint(id){
      // window.print();
      let divToPrint=document.getElementById(id);
      let newWin= window.open("");
      newWin.document.write(divToPrint.outerHTML);
      newWin.print();
      newWin.close();
    }

  getStudentInfo() {
    this.auth.showLoader();
    this.apiService.fetchStudentReportDet(this.studentId).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.studentReportInfo = res;
        if (res.attendanceReportJsonList != null) {
          if (res.attendanceReportJsonList.length > 0) {
            this.attendanceList = res.attendanceReportJsonList;
          }
        }
        if (res.studentExamJsonList != null) {
          if (res.studentExamJsonList.length > 0) {
            this.examList = res.studentExamJsonList;
          }
          if (res.pastCourseExamSchdJson != null) {
            if (res.pastCourseExamSchdJson.length > 0) {
              for (let i = 0; i < res.pastCourseExamSchdJson.length; i++) {
                if (res.pastCourseExamSchdJson[i].pastCourseExamList.length > 0) {
                  for (let j = 0; j < res.pastCourseExamSchdJson[i].pastCourseExamList.length; j++) {
                    if (res.pastCourseExamSchdJson[i].pastCourseExamList[j].subjectWiseExamSchdList == null) {
                      let obj: any = {
                        course_Name: res.pastCourseExamSchdJson[i].course_Name,
                        master_course_name: res.pastCourseExamSchdJson[i].master_course_name,
                        pastCourseExamList: []
                      }
                      obj.pastCourseExamList.push(res.pastCourseExamSchdJson[i].pastCourseExamList[j]);
                      this.courseLevelExamList.push(obj);
                    }
                  }
                }
              }
            }
          }
        }
        if (res.batchExamSchdJsons.otherSchd != null) {
          if (res.batchExamSchdJsons.otherSchd.length > 0) {
            this.futureExamSch = res.batchExamSchdJsons.otherSchd;
          }
        }
        if (this.isLangInstitue) {
          if (res.assignBatchList != "" && res.assignBatchList != null) {
            this.coursesAssignedlist = res.assignBatchList.split(' , ');
          }
        } else {
          if (res.assignCourseList != "" && res.assignCourseList != null) {
            this.coursesAssignedlist = res.assignCourseList.split(' , ');
          }
        }
        this.studentDetJson = res.studentJson;
        if (res.studentJson.photo != null && res.studentJson.photo != "") {
          this.displayImage = res.studentJson.photo;
        }
      },
      err => {
        this.auth.hideLoader();
        this.messageNotifier('error', '', err.error.message);
      }
    )
  }

  expandCollapseAll() {
    for (let i = 0; i < this.courseLevelExamList.length; i++) {
      this.showhideInnerTable(i);
    }
  }


  showhideInnerTable(ind) {
    document.getElementById('showMarksInnerTable' + ind).classList.toggle('hide');
    document.getElementById('plusIcon' + ind).classList.toggle('hide');
    document.getElementById('minusIcon' + ind).classList.toggle('hide');
  }

  onRadioButtonSelectionExam() {
    if (this.examType == "0") {

    } else {

    }
  }

  getPastDues() {
    let obj: any = {
      from_date: '',
      to_date: ''
    }
    this.auth.showLoader();
    this.apiService.fetchPastDues(obj, this.studentId).subscribe(
      res => {
        this.auth.hideLoader();
        this.paymentHistoryList = res;
      },
      err => {
        this.auth.hideLoader();
        this.messageNotifier('error', '', err.error.message);
      }
    )
  }

  getPastHistory() {
    this.auth.showLoader();
    this.apiService.fetchPastHistory(this.studentId).subscribe(
      res => {
        this.auth.hideLoader();
        this.PastFeeList = res;
      },
      err => {
        this.auth.hideLoader();
        this.messageNotifier('error', '', err.error.message);
      }
    )
  }

  getFutureDues() {
    this.auth.showLoader();
    this.apiService.fetchFutureDues(this.studentId).subscribe(
      res => {
        this.auth.hideLoader();
        this.FutureFeeList = res;
      },
      err => {
        this.auth.hideLoader();
        this.messageNotifier('error', '', err.error.message);
      }
    )
  }

  validateAllField() {
    if (this.timetablePayLoad.type == '2') {
      if (this.timetablePayLoad.startdate == "" || this.timetablePayLoad.startdate == null) {
        this.messageNotifier('error', '', 'Please enter start date');
        return false;
      } else {
        this.timetablePayLoad.startdate = moment(this.timetablePayLoad.startdate).format('YYYY-MM-DD');
      }
      if (this.timetablePayLoad.enddate == "" || this.timetablePayLoad.enddate == null) {
        this.messageNotifier('error', '', 'Please enter end date');
        return false;
      } else {
        this.timetablePayLoad.enddate = moment(this.timetablePayLoad.enddate).format('YYYY-MM-DD');
      }
    } else {
      this.timetablePayLoad.startdate = "";
      this.timetablePayLoad.enddate = "";
    }
    return true;
  }

  onTimeTableRadioBtnChange() {
    if (this.timetablePayLoad.type == "0") {
      this.getTimeTableDetails();
    } else if (this.timetablePayLoad.type == "1") {
      this.getTimeTableDetails();
    } else {
      this.timeTableSchedule = [];
      this.timetablePayLoad.startdate = moment().format('YYYY-MM-DD');
      this.timetablePayLoad.enddate = moment().format('YYYY-MM-DD');
    }
  }

  getTimeTableDetails() {
    let check = this.validateAllField();
    if (check) {
      this.auth.showLoader();
      this.apiService.fetchTimetable(this.timetablePayLoad).subscribe(
        res => {
          this.auth.hideLoader();
          this.timeTableDet = res;
          this.makeJSONForTimeTable(res.batchTimeTableList);
        },
        err => {
          this.auth.hideLoader();
          this.messageNotifier('error', '', err.error.message);
        }
      )
    }
  }

  makeJSONForTimeTable(data) {
    this.timeTableSchedule = [];
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        let tr = {
          date: key,
          schedule: data[key]
        }
        this.timeTableSchedule.push(tr);
      }
    }
    console.log(this.timeTableSchedule);
  }

  toggleClass(index) {
    document.getElementById('innerTr' + index).classList.toggle('hide');
    document.getElementById('accodianMinus' + index).classList.toggle('hide');
    document.getElementById('accodianPlus' + index).classList.toggle('hide');
  }

  getPTMDetails() {
    this.auth.showLoader();
    this.apiService.getPTMDetails(this.studentId).subscribe(
      res => {
        this.auth.hideLoader();
        this.PTMDetList = res;
      },
      err => {
        this.auth.hideLoader();
        this.messageNotifier('error', '', err.error.message);
      }
    )
  }

  viewAttendanceDet(rowData) {
    this.attendanceDetPopUp = true;
    this.tempData = rowData;
  }

  closePopup() {
    this.attendanceDetPopUp = false;
    this.tempData = [];
  }

  switchActiveView(id) {
    this.liAttendanceView = false;
    this.liExamView = false;
    this.liFeeView = false;
    this.liTableView = false;
    this.liPTMView = false;
    this.liAttendance.nativeElement.classList.remove('active');
    this.liExam.nativeElement.classList.remove('active');
    this.liFee.nativeElement.classList.remove('active');
    this.liPTM.nativeElement.classList.remove('active');
    this.liTable.nativeElement.classList.remove('active');
    this[id].nativeElement.classList.add('active');
    if (id == "liAttendance") {
      this.viewAttendancePayload.type = '0';
      this.liAttendanceView = true;
    } else if (id == "liExam") {
      this.liExamView = true;
    } else if (id == "liFee") {
      this.liFeeView = true;
      this.getPastDues();
      this.getPastHistory();
      this.getFutureDues();
    } else if (id == "liTable") {
      this.timetablePayLoad.type = '0';
      this.liTableView = true;
      this.getTimeTableDetails();
    } else {
      this.liPTMView = true;
      this.getPTMDetails();
    }
  }

  onRadioButtonSelection() {
    this.attendanceList = [];
    if (this.viewAttendancePayload.type == '2') {
      return;
    } else {
      this.goBtnAttendaceClick();
    }
  }


  goBtnAttendaceClick() {
    let check = this.validateDataAttendance(this.viewAttendancePayload);
    if (check) {
      this.auth.showLoader();
      this.apiService.fetchAttendance(this.viewAttendancePayload).subscribe(
        (res: any) => {
          this.auth.hideLoader();
          this.attendanceList = res.attendanceReportJsonList;
        },
        err => {
          this.auth.hideLoader();
          this.messageNotifier('error', '', err.error.message);
        }
      )
    } else {
      return;
    }
  }

  validateDataAttendance(data) {
    if (data.type == '2') {
      if (data.startdate == "" || data.startdate == null) {
        this.messageNotifier('error', '', 'Please enter start date');
        return false;
      } else {
        data.startdate = moment(data.startdate).format('YYYY-MM-DD');
      }
      if (data.enddate == "" || data.enddate == null) {
        this.messageNotifier('error', '', 'Please enter end date');
        return false;
      } else {
        data.enddate = moment(data.enddate).format('YYYY-MM-DD');
      }
    } else {
      data.startdate = "";
      data.enddate = "";
    }
    return true;
  }

  //helper Function

  messageNotifier(type, title, msg) {
    let data = {
      type: type,
      title: title,
      body: msg
    }
    this.toastCtrl.popToast(data);
  }

}
