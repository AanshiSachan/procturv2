import { Component, OnInit } from '@angular/core';
import { StudentReportService } from '../../../services/report-services/student-report-service/student-report.service';
import { AppComponent } from '../../../app.component';
import { AuthenticatorService } from '../../../services/authenticator.service';

@Component({
  selector: 'app-report-card',
  templateUrl: './report-card.component.html',
  styleUrls: ['./report-card.component.scss']
})
export class ReportCardComponent implements OnInit {

  isRippleLoad: boolean = false;
  isLangInstitue: boolean = false;
  masterCourseList: any = [];
  courseList: any = [];
  payLoad: any = {
    standard_id: -1,
    subject_id: -1,
    assigned: 'N',
    name: '',
  }
  studentList: any = [];
  dummyArr: any[] = [0, 1, 2, 3, 4, 0, 1, 2, 3, 4];
  columnMaps: any[] = [0, 1, 2, 3, 4, 5];
  dataStatus: number = 3;

  constructor(
    private apiService: StudentReportService,
    private appC: AppComponent,
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
    if (this.isLangInstitue) {
      this.fetchMasterCourseList();
    }
  }

  fetchMasterCourseList() {
    this.studentList = [];
    this.isRippleLoad = true;
    this.courseList = [];
    this.payLoad.subject_id = -1;
    this.apiService.getMasterCourseAndSubjectList(this.payLoad.standard_id, this.payLoad.subject_id, this.payLoad.assigned).subscribe(
      (res: any) => {
        this.isRippleLoad = false;
        if (this.masterCourseList.length == 0) {
          this.masterCourseList = res.standardLi;
        }
        if (res.subjectLi != null && res.subjectLi.length > 0) {
          this.courseList = res.subjectLi;
        }
      },
      err => {
        this.isRippleLoad = false;
        this.messageToast('error', 'Error', err.error.message);
      }
    )
  }

  onGoBtnClick() {
    let obj = this.validateAndMakeJSON();
    if (obj == false) {
      return;
    }
    this.isRippleLoad = true;
    this.dataStatus = 1;
    this.studentList = [];
    this.apiService.getStudentList(this.payLoad.standard_id, this.payLoad.subject_id, this.payLoad.assigned, obj.name, obj.number).subscribe(
      res => {
        this.dataStatus = 2;
        this.isRippleLoad = false;
        this.studentList = res;
      },
      err => {
        this.dataStatus = 2;
        this.isRippleLoad = false;
        this.messageToast('error', 'Error', err.error.message);
      }
    )
  }

  validateAndMakeJSON() {
    let obj: any = {};
    if (this.payLoad.name == "") {
      // if (this.isLangInstitue) {
      //   if (this.payLoad.standard_id == -1 && this.payLoad.subject_id == -1) {
      //     this.messageToast('error', 'Error', 'Please provide fields');
      //     return false;
      //   }
      // } else {
      //   this.messageToast('error', 'Error', 'Please provide fields to search');
      //   return false;
      // }
      obj.name = null;
      obj.number = null;
    } else {
      if (isNaN(this.payLoad.name)) {
        obj.name = this.payLoad.name;
        obj.number = null;
      } else {
        obj.number = this.payLoad.name;
        obj.name = null;
      }
    }
    return obj;
  }

  // Helper Function

  messageToast(err, title, msg) {
    let obj = {
      type: err,
      title: title,
      body: msg
    }
    this.appC.popToast(obj);
  }

}
