import { Component, OnInit } from '@angular/core';
import { StudentReportService } from '../../../services/report-services/student-report-service/student-report.service';
import { AppComponent } from '../../../app.component';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { HttpService } from '../../../services/http.service';
import { CommonServiceFactory } from '../../../services/common-service';
import * as moment from 'moment';

@Component({
  selector: 'app-report-card',
  templateUrl: './report-card.component.html',
  styleUrls: ['./report-card.component.scss']
})
export class ReportCardComponent implements OnInit {

  institute_id: any = null;
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
    private auth: AuthenticatorService,
    private _http: HttpService,
    private _commService: CommonServiceFactory
  ) {
    this.auth.currentInstituteId.subscribe(id => {
      this.institute_id = id;
    });
  }

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

  /*
  *** Created By Amol Arun Betwar ***
  */
  //Next two method is used for student report download

  getDownload(student_id) {
    this.isRippleLoad = true;
    let url='/api/v1/reports/Student/downloadReportCard/'+ this.institute_id + '/' + student_id;
    this._http.getData(url).subscribe(
      (res: any) => {
        this.isRippleLoad = false;
        if(res.document!=""){
          let byteArr = this._commService.convertBase64ToArray(res.document);
          let fileName = res.docTitle;
          let file = new Blob([byteArr], { type: 'application/pdf;charset=utf-8;' });
          let url = URL.createObjectURL(file);
          let dwldLink = document.getElementById('downloadFileClick1');
          dwldLink.setAttribute("href", url);
          dwldLink.setAttribute("download", fileName);
          document.body.appendChild(dwldLink);
          dwldLink.click();
        }
        else{
          this._commService.showErrorMessage('info', 'Info', "Document does not have any data.");
        }
      },
      err => {
        this.isRippleLoad = false;
        this._commService.showErrorMessage('error', 'Error', err.error.message);
      }
    )
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
        this.messageToast('error', '', err.error.message);
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
        this.messageToast('error', '', err.error.message);
      }
    )
  }

  validateAndMakeJSON() {
    let obj: any = {};
    if (this.payLoad.name == "") {
        // if (this.isLangInstitue) {
      //   if (this.payLoad.standard_id == -1 && this.payLoad.subject_id == -1) {
      //     this.messageToast('error', '', 'Please enter fields');
      //     return false;
      //   }
      // } else {
      //   this.messageToast('error', '', 'Please enter fields to search');
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
