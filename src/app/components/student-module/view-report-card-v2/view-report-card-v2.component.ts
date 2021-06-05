import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageShowService } from '../../../services/message-show.service';
import { HttpService } from '../../../services/http.service';
import { AppComponent } from '../../../app.component';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { ProductService } from '../../../services/products.service';
import { StudentReportService } from '../../../services/report-services/student-report-service/student-report.service';
import { PostStudentDataService } from '../../../services/student-services/post-student-data.service';
import { CommonServiceFactory } from '../../../services/common-service';
import * as moment from 'moment';
declare var $;
@Component({
  selector: 'app-view-report-card-v2',
  templateUrl: './view-report-card-v2.component.html',
  styleUrls: ['./view-report-card-v2.component.scss']
})
export class ViewReportCardV2Component implements OnInit {

  constructor(
    private actRoute: ActivatedRoute,
    private apiService: StudentReportService,
    private httpService: HttpService,
    private auth: AuthenticatorService,
    private msgService: MessageShowService,
    private toastCtrl: AppComponent,
    private productService: ProductService,
    private appC: AppComponent,
    private router: Router,
    private route: ActivatedRoute,
    private PostStudService: PostStudentDataService,
    private _commService: CommonServiceFactory,

   ) { 
    this.student_id = this.route.snapshot.paramMap.get('id');

   }
   studentDetJson: any = {
    student_name: '',
    student_disp_id: '',
    student_phone: '',
    doj: '',
    photo: ''
  };
  displayImage: any = '';
   coursesAssignedlist: any = [];
   futureExamSch: any = [];
   studentReportInfo: any;
   examList: any = [];
   courseLevelExamList: any = [];
   tempData: any = [];
   attendanceDetPopUp: boolean = false;
   attendanceList: any = [];
   examType: any = '0';
   PTMDetList: any = [];
   selectedFiles: any[] = [];
   category_id: number | string = "";
parentProfileDocData:any=[];
studentCommanData:any=[];
FutureFeeList: any = [];
assignedCourses:any=[];
PastFeeList: any = [];
paymentHistoryList: any = [];
studentId: any = -1;
uploadedFileData: any[] = [];
optionalSubjects:any=[];
studentFile:any=[];
student_id: any;
schoolModel:boolean;
isLangInstitue: boolean = false;
institute_id=sessionStorage.getItem('institute_id');
  ngOnInit(): void {
    //check for school model
    this.schoolModel= this.auth.schoolModel.getValue();
    this.auth.institute_type.subscribe(
      res => {
         //batch module
         //isLangInstitue = true;
          //isProfessional==true
        if (res == "LANG") {
          this.isLangInstitue = true;
        } else {
          //course module
           //isLangInstitue = false;
          //isProfessional==false
          this.isLangInstitue = false;
        }
      }
    )
 
    this.actRoute.params.subscribe(
      (res: any) => {
        this.studentId = res.id;
      }
    )
    // this.timetablePayLoad.student_id = this.studentId;
    // this.viewAttendancePayload.student_id = this.studentId;
    // this.getStudentInfo();
    this.getParentProfileDoc();
  }
  //For tab active 
  isActiveTab ='profile';

openTab(param){ 
  this.isActiveTab =param;
  if (param === "fees") {
    //this.liFeeView = true;
    this.getPastDues();
    this.getPastHistory();
    this.getFutureDues();
  }
}
//function to get parent,profile ,document, data
getParentProfileDoc() {
  this.auth.showLoader();
  this.httpService.getData('/api/v1/students/get-student-detail/' +this.institute_id +'/' + this.studentId ).subscribe(
    (res: any) => {
      this.parentProfileDocData =res.result;
      this.studentCommanData =res.result;
      let course = this.studentCommanData.assignedCourses.split();
      this.assignedCourses =course;
     this.studentFile =this.studentCommanData.studentFile ;
     // console.log(this.studentFile)
      let optionalSubject =this.studentCommanData.optionalSubjects;
      if(this.studentCommanData.optionalSubjects!=null){
         optionalSubject =this.studentCommanData.optionalSubjects.split();
      }
     this.optionalSubjects= optionalSubject;
      this.auth.hideLoader();
    },
    err => {
      this.auth.hideLoader();
    }
  );
}
//============================document upload and delete code==============================//
deletefile(id) {
  console.log(id)
  if (confirm('Are you sure, you want to delete file?')) {
    this.auth.showLoader();
    const url = `/users-file/delete-file/?studentId=${this.student_id}&id=${id}`;
    this.productService.deleteFile(url).subscribe(
      (res: any) => {
        this.appC.popToast({ type: "success", title: "", body: "File deleted successfully" });
        if (res) {
         // this.getParentProfileDoc()
         this.getUploadedFileData();
        }
        this.auth.hideLoader();
      },
      err => {
        this.auth.hideLoader();
      }
    )
  }
}
storeFiles() {
  let manualUploadedFileList = (<HTMLInputElement>document.getElementById('uploadFileControl')).files;
  let filesArr = Array.from(manualUploadedFileList);
  this.selectedFiles = filesArr;
}
uploadHandler() {
  if (this.category_id != '') {
    if (this.selectedFiles.length == 0) {
      this.appC.popToast({ type: "error", body: "No file selected" })
      return
    }

    const path: string = "";
    let formData = new FormData();

    let arr = Array.from(this.selectedFiles)
    arr.map((ele, index) => {
      formData.append("files", ele);
    })
    const base = this.auth.getBaseUrl();
    const fileJson = { title: this.category_id, studentId: this.student_id, documentNumber: "" }
    const urlPostXlsDocument = base + `/users-file/uploadFile?fileJson=${JSON.stringify(fileJson)}`;
    const newxhr = new XMLHttpRequest();
    const auths: any = {
      userid: sessionStorage.getItem('userid'),
      userType: sessionStorage.getItem('userType'),
      password: sessionStorage.getItem('password'),
      institution_id: sessionStorage.getItem('institute_id'),
    }
    let Authorization = btoa(auths.userid + "|" + auths.userType + ":" + auths.password + ":" + auths.institution_id);

    newxhr.open("POST", urlPostXlsDocument, true);
    newxhr.setRequestHeader("x-proc-user-id", sessionStorage.getItem('userid'));
    newxhr.setRequestHeader("institute_id", sessionStorage.getItem('institute_id'));
    newxhr.setRequestHeader("Authorization", Authorization);
    newxhr.setRequestHeader("enctype", "multipart/form-data;");
    newxhr.setRequestHeader("keyName", path);
    newxhr.setRequestHeader("Accept", "application/json, text/javascript");
    newxhr.setRequestHeader("x-proc-inst-id", sessionStorage.getItem('institute_id'));
    newxhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    this.auth.showLoader()
    newxhr.onreadystatechange = () => {
      this.auth.hideLoader()
      if (newxhr.readyState == 4) {
        if (newxhr.status >= 200 && newxhr.status < 300) {
          let data = {
            type: 'success',
            title: "File uploaded successfully",
            body: newxhr.response.fileName
          }
          this.appC.popToast(data);
          this.getUploadedFileData();
        } else {
          let data = {
            type: 'info',
            title: "File upload Failed",
            body: newxhr.response.fileName
          }
          this.appC.popToast(data);
        }
      }
    }
    newxhr.send(formData);
  } else {
      this.appC.popToast({ type: "error", body: "Enter File Name!" })
      return
  }
  this.category_id = '';
  (<HTMLInputElement>document.getElementById('uploadFileControl')).value = null;
}
getUploadedFileData() {
  this.auth.showLoader();
  const url = `/users-file/downloadFile?studentId=${this.student_id}`;
  this.productService.getUploadFileData(url).subscribe(
    (res: any) => {
      this.uploadedFileData = res;
      this.studentFile =res;
      this.auth.hideLoader();
      $('#myModal').modal('hide');
    },
    err => {
      this.auth.hideLoader()
    }
  )
}
//============================fees tab code==============================//

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
messageNotifier(type, title, msg) {
  let data = {
    type: type,
    title: title,
    body: msg
  }
  this.toastCtrl.popToast(data);
}
//============================PTM Details==============================//

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
//============================Download Student Report card==============================//
downloadStudentReportCard() {
  this.auth.showLoader();
  let url = '/api/v1/reports/Student/downloadReportCard/' + sessionStorage.getItem('institute_id') + '/' + this.student_id;
  this.PostStudService.stdGetData(url).subscribe(
    (res: any) => {
      console.log(res);
      this.auth.hideLoader();
      if (res) {
        if (res.document != "") {
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
        else {
          this._commService.showErrorMessage('info', 'Info', "Document does not have any data.");
        }
      }
      else { this._commService.showErrorMessage('info', 'Info', "Document does not have any data."); }
    },
    err => {
      console.log(err);
      this._commService.showErrorMessage('info', 'Info', err.error.message);
      this.auth.hideLoader();
    })
}
//============================Attendence==============================//
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

onRadioButtonSelectionExam() {
  if (this.examType == "0") {

  } else {

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
  this.viewAttendancePayload.student_id =this.studentId;
  console.log(this.viewAttendancePayload)
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
//============================Attendence==============================//
viewAttendanceDet(rowData) {
  this.attendanceDetPopUp = true;
  this.tempData = rowData;
}

closePopup() {
  this.attendanceDetPopUp = false;
  this.tempData = [];
}
//============================Exam for course==============================//
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
show:boolean=false;
showArrow(param){
this.show =param;
}
}
