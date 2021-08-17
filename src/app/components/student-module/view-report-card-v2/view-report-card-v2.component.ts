import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { isExternalModuleNameRelative } from 'typescript';
import { NgForm } from '@angular/forms';
import { role } from '../../../model/role_features';
import { WidgetService } from '../../../services/widget.service';
declare var $;
@Component({
  selector: 'app-view-report-card-v2',
  templateUrl: './view-report-card-v2.component.html',
  styleUrls: ['./view-report-card-v2.component.scss']
})
export class ViewReportCardV2Component implements OnInit {
  role_feature = role.features;

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
    private widgetService:WidgetService

  ) {
    this.student_id = this.route.snapshot.paramMap.get('id');
    this.tax = sessionStorage.getItem('enable_tax_applicable_fee_installments') == '1';
   
  }
  feesAllData: any = [];
  academicYrList: any = [];
  timeTableDet: any = [];
  timeTableSchedule: any = [];
  currencySymbol: String = ""
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
  studentDetJson: any = {
    student_name: '',
    student_disp_id: '',
    student_phone: '',
    doj: '',
    photo: ''
  };
  Fee_model = {
    master_course: '',
    course_id: -1,
    standard_id: -1,
    academic_yr_id: -1,
    batch_id: -1,
    country_id: -1,
    fee_assigned: 1
  }
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
  parentProfileDocData: any = [];
  studentCommanData: any = [];
  FutureFeeList: any = [];
  assignedCourses: any = [];
  PastFeeList: any = [];
  paymentHistoryList: any = [];
  studentId: any = -1;
  uploadedFileData: any[] = [];
  optionalSubjects: any = [];
  studentFiles: any = [];
  studentFile: any = [];
  student_id: any;
  settingInfo:any=[];
  schoolModel: boolean;
  isLangInstitue: boolean = false;
  tax: boolean = false;
  institute_id = sessionStorage.getItem('institute_id');
  enable_homework;
  //tax=sessionStorage.getItem('enable_tax_applicable_fee_installments');
  ngOnInit(): void {

   
   
    //check for school model
    this.schoolModel = this.auth.schoolModel.getValue();
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
    this.checkDownloadRoleAccess();
    this.fetchWidgetPrefill();
  }
  fetchWidgetPrefill() {
    this.settingInfo =[];
    this.widgetService.getSettings().subscribe(
      res => {
        this.settingInfo = res;
        this.enable_homework = this.settingInfo.home_work_feature_enable;
        console.log(this.enable_homework );
      },
      err => {

      }
    )
    
  }
  //For tab active 
  isActiveTab = 'profile';
  downloadStudentReportAccess: boolean = false;
  studentReport: boolean = false;
  allowEdit: boolean = false;

  checkDownloadRoleAccess() {
    if (sessionStorage.getItem('downloadStudentReportAccess') == 'true') {
      this.downloadStudentReportAccess = true;
    }
    const permissionArray = sessionStorage.getItem('permissions');
    const userType = sessionStorage.getItem('userType');
    if (userType == '3' ||(userType == '0' && (permissionArray != "" && permissionArray != null))) {
      this.studentReport = this.role_feature.STUDENT_REPORT_CARD;
      this.allowEdit = this.role_feature.STUDENT_MANAGE;
    } else {
      this.studentReport = true;
      this.allowEdit = true;
    }
  }

  openTab(param) {
    this.isActiveTab = param;
    if (param === "fees") {
      //this.liFeeView = true;
      this.fetchAcademicYearList();
      this.fetchDefaultAY();
      //this.getFeesDetails(this.Fee_model.academic_yr_id)
      this.getPastFeeDetails();
    
    }
    else if (param == "exam_course") {
      this.getStudentInfo();
    }
    else if (param == "attendance") {
      this.viewAttendancePayload.type == '0';
      this.goBtnAttendaceClick();
     
    }
    else if (param == "exam") {
      this.getExamDetailsForSchool();
    }
    else if (param == "inventory") {
      this.getInventoryDetails();
    }
    else if(param=="timeTable"){
      this.getTimeTableDetails();
    }
    else if(param=="documents"){
      this.getUploadedFileData();
    }
    else if(param=='ptm'){
      this.getPTMDetails();
    }
  }
  //function to get parent,profile ,document, data
  getParentProfileDoc() {
    this.studentCommanData =[];
    this.auth.showLoader();
    this.httpService.getData('/api/v1/students/get-student-detail/' + this.institute_id + '/' + this.studentId).subscribe(
      (res: any) => {
        this.parentProfileDocData = res.result;
        this.studentCommanData = res.result;
        let course = this.studentCommanData.assignedCourses.split(",");
        this.assignedCourses = course;
        this.studentFile = this.studentCommanData.studentFile;
        let optionalSubject = this.studentCommanData.optionalSubjects;
        if (this.studentCommanData.optionalSubjects != null) {
          optionalSubject = this.studentCommanData.optionalSubjects.split();
        }
        this.optionalSubjects = optionalSubject;
        this.auth.hideLoader();
      },
      err => {
        this.auth.hideLoader();
      }
    );
  }
  //============================document upload and delete code==============================//
  goBtnFilesClick() {
    if (this.viewFiles.type == '1') {
      this.downloadStudentIDCard();
    } else if (this.viewFiles.type == '2') {
      //this.downloadStudentIDCard();
    }
  }
  onRadioButtonSelectionDoc() {
    if (this.viewFiles.type == '1') {
      // this.downloadStudentIDCard();
    } else if (this.viewFiles.type == '2') {
      //this.downloadStudentIDCard();
    }
  }
  deletefile(id) {
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
        this.studentFiles = res;
        this.auth.hideLoader();
        $('#myModal').modal('hide');
      },
      err => {
        this.auth.hideLoader()
      }
    )
  }
  //============================fees Data acoording to course==============================//
  payementHistory: any = [];
  pastFeesDetails: any = [];
  getFeesDetails(academic_yr_id) {
    this.payementHistory= [];
    this.pastFeesDetails = [];
    this.futureFees = [];
    this.pastFee = [];
    //this.fetchDefaultAY();
    //Request URL: https://test999.proctur.com/StdMgmtWebAPI/api/v1/studentWise/fee/100058/students/13121/515
    this.auth.showLoader();
    let url = "/api/v1/studentWise/fee/" + this.institute_id + "/students/" + this.student_id + "/" + academic_yr_id;
    this.httpService.getData(url).subscribe(
      (res: any) => {
        this.feesAllData = res.result;
        this.currencySymbol = this.feesAllData.currency_code;
        this.payementHistory = res.result.p_install_li;
        this.pastFeesDetails = res.result.a_install_li;
        this.getPastFeeDetails();
       
        this.auth.hideLoader();
      },
      (error: any) => {
        this.auth.hideLoader();
        this._commService.showErrorMessage('error', '', 'Something went wrong. Please try after sometime!');

      }
    )

  }

  pastFee: any = [];
  futureFees: any = [];
  getPastFeeDetails() {
    this.pastFee =[];
    this.futureFees =[];
    let date: any = new Date();
    date = moment(date).format('YYYY-MM-DD');
    this.pastFeesDetails.forEach(elements => {
      if (elements && elements.p_status == 'N' && moment(elements.d_date).valueOf() >= moment(date).valueOf()) {
      
        this.futureFees.push(elements);
      }
      else if (elements && elements.p_status == 'N' && moment(elements.d_date).valueOf() < moment(date).valueOf()) {
        this.pastFee.push(elements)
      }
    })
   
  }
  fetchAcademicYearList() {
    this.auth.showLoader();
    let url = "/api/v1/academicYear/all/" + this.institute_id;
    this.httpService.getData(url).subscribe(
      (res: any) => {
        this.academicYrList = res;
        this.fetchDefaultAY();
        this.auth.hideLoader();
      },
      (error: any) => {
        this.auth.hideLoader();
        this._commService.showErrorMessage('error', '', 'Something went wrong. Please try after sometime!');

      }
    )
  }
  fetchDefaultAY() {
    if (this.academicYrList != null) {
      for (let data of this.academicYrList) {
        if (data.default_academic_year == 1) {
          this.Fee_model.academic_yr_id = data.inst_acad_year_id;
    this.getFeesDetails(this.Fee_model.academic_yr_id);
          break;
        }
      }
    }
  }

  checkIfUserHadAccess(id) {
    let permissionArray = sessionStorage.getItem('permissions');
    if (permissionArray == "" || permissionArray == null || !permissionArray) {
      return true;
    } else {
      if (id) {
        return true;
      } else {
        return false;
      }
    }
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
    this.PTMDetList=[];
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
            dwldLink.setAttribute("href","")
          }
          else {
            this._commService.showErrorMessage('info', 'Info', "Document does not have any data.");
          }
        }
        else { this._commService.showErrorMessage('info', 'Info', "Document does not have any data."); }
      },
      err => {
        this._commService.showErrorMessage('info', 'Info', err.error.message);
        this.auth.hideLoader();
      })
  }
  //============================Download Student ID card==============================//
  downloadStudentIDCard() {
    this.auth.showLoader();
    let url = '/admit-card/download';
    this.PostStudService.stdPostData(url, [this.student_id]).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        if (res) {
          let resp = res.response;
          if (resp.document != "") {
            let byteArr = this._commService.convertBase64ToArray(resp.document);
            let fileName = 'card.pdf'; //res.docTitle;
            let file = new Blob([byteArr], { type: 'application/pdf;charset=utf-8;' });
            let url = URL.createObjectURL(file);
            let dwldLink = document.getElementById('downloadFileClick1');
            dwldLink.setAttribute("href", url);
            dwldLink.setAttribute("download", fileName);
            document.body.appendChild(dwldLink);
            dwldLink.click();
            dwldLink.setAttribute("href","")
          }
          else {
            this._commService.showErrorMessage('info', 'Info', "Document does not have any data.");
          }
        } else {
          this._commService.showErrorMessage('info', 'Info', "Document does not have any data.");
        }
      },
      err => {
        this.auth.hideLoader();
      }
    )

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
    type: 0
  };
  viewFiles: any = {
    type: '0'
  }
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
   // alert(this.viewAttendancePayload.type)
    this.viewAttendancePayload.student_id = this.studentId;
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
    console.log(this.tempData)
  }

  closePopup() {
    this.attendanceDetPopUp = false;
    this.tempData = [];
  }
  //============================Exam for course==============================//
  expandCollapseAll() {
    for (let i = 0; i < this.courseLevelExamList.length; i++) {
      this.showhideInnerTable(i);
      this.courseLevelExamList[i].isShow = true;
    }
  }
  showhideInnerTable(ind) {

    document.getElementById('showMarksInnerTable' + ind).classList.toggle('hide');
    document.getElementById('plusIcon' + ind).classList.toggle('hide');
    document.getElementById('minusIcon' + ind).classList.toggle('hide');
  }
  getStudentInfo() {
    this.courseLevelExamList =[];
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
  show: boolean = false;
  showArrow(param) {
    this.show = param;
  }
  editStudent(id) {
    this.router.navigate(["/view/students/edit/" + id]);
  }
  //============================Time Table==============================//
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
    this.timeTableDet =[];
    this.timetablePayLoad.student_id =this.student_id;
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
  toggleClass(index) {
    document.getElementById('innerTr' + index).classList.toggle('hide');
    document.getElementById('accodianMinus' + index).classList.toggle('hide');
    document.getElementById('accodianPlus' + index).classList.toggle('hide');
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
  }

  //============================Exam Details for school Module==============================//
  examdata = [
    {
      "exam_type_id": 38,
      "exam_type": "Term 1",
      "subject_list": [
        {
          "subject_id": 7208,
          "subject_name": "Biology2",
          "marks_dist_list": [
            {
              "marks_distribution_id": 12,
              "marks_distribution_name": "Practical",
              "marks_max_value": 15,
              "marks_value": 11
            },
            {
              "marks_distribution_id": 14,
              "marks_distribution_name": "written",
              "marks_max_value": 48,
              "marks_value": 44
            },
            {
              "marks_distribution_id": 48,
              "marks_distribution_name": "Practical 2",
              "marks_max_value": 27,
              "marks_value": 22
            }
          ],
          "total_marks": 77,
          "grade": "E",
          "grade_points": 7,
          "rank": 0,
          "attendance": "N",
          "_optional": false
        }
      ],
      "grand_total": 100,
      "total_obtained_marks": 77,
      "total_average_marks": 77,
      "total_average_marks_percent": 77,
      "gpa": 7
    },
    {
      "exam_type_id": 38,
      "exam_type": "Term 2",
      "subject_list": [
        {
          "subject_id": 7208,
          "subject_name": "Math3",
          "marks_dist_list": [
            {
              "marks_distribution_id": 12,
              "marks_distribution_name": "Practical",
              "marks_max_value": 11,
              "marks_value": 11
            },
            {
              "marks_distribution_id": 14,
              "marks_distribution_name": "written",
              "marks_max_value": 44,
              "marks_value": 44
            },
            {
              "marks_distribution_id": 48,
              "marks_distribution_name": "Practical 2",
              "marks_max_value": 22,
              "marks_value": 22
            }
          ],
          "total_marks": 77,
          "grade": "E",
          "grade_points": 7,
          "rank": 0,
          "attendance": "N",
          "_optional": false
        },
        {
          "subject_id": 7208,
          "subject_name": "Math22",
          "marks_dist_list": [
            {
              "marks_distribution_id": 12,
              "marks_distribution_name": "Practical",
              "marks_max_value": 11,
              "marks_value": 11
            },
            {
              "marks_distribution_id": 14,
              "marks_distribution_name": "written",
              "marks_max_value": 44,
              "marks_value": 44
            },
            {
              "marks_distribution_id": 48,
              "marks_distribution_name": "Practical 2",
              "marks_max_value": 22,
              "marks_value": 22
            }
          ],
          "total_marks": 77,
          "grade": "E",
          "grade_points": 7,
          "rank": 0,
          "attendance": "N",
          "_optional": false
        },
        {
          "subject_id": 7208,
          "subject_name": "Math33",
          "marks_dist_list": [

            {
              "marks_distribution_id": 12,
              "marks_distribution_name": "Practical",
              "marks_max_value": 11,
              "marks_value": 11
            },
            {
              "marks_distribution_id": 14,
              "marks_distribution_name": "written",
              "marks_max_value": 44,
              "marks_value": 44
            },
            {
              "marks_distribution_id": 48,
              "marks_distribution_name": "Practical 2",
              "marks_max_value": 22,
              "marks_value": 22
            }
          ],
          "total_marks": 200,
          "grade": "D",
          "grade_points": 7,
          "rank": 0,
          "attendance": "N",
          "_optional": false
        }
      ],
      "grand_total": 200,
      "total_obtained_marks": 177,
      "total_average_marks": 187,
      "total_average_marks_percent": 87,
      "gpa": 7
    },
    {
      "exam_type_id": 38,
      "exam_type": "Term 3",
      "subject_list": [
        {
          "subject_id": 7208,
          "subject_name": "History3",
          "marks_dist_list": [
            {
              "marks_distribution_id": 12,
              "marks_distribution_name": "Practical",
              "marks_max_value": 11,
              "marks_value": 11
            },
            {
              "marks_distribution_id": 14,
              "marks_distribution_name": "written",
              "marks_max_value": 44,
              "marks_value": 44
            },
            {
              "marks_distribution_id": 48,
              "marks_distribution_name": "Practical 2",
              "marks_max_value": 22,
              "marks_value": 22
            }
          ],
          "total_marks": 77,
          "grade": "E",
          "grade_points": 7,
          "rank": 0,
          "attendance": "N",
          "_optional": false
        }
      ],
      "grand_total": 100,
      "total_obtained_marks": 77,
      "total_average_marks": 77,
      "total_average_marks_percent": 77,
      "gpa": 7
    }
  ];

  dataforexam = [{
    "exam_type_id": 38,
    "exam_type": "Term 1",
    " mark_dist": [{
      "all_dist": ['pra', 'theory', 'written'],
      "subject_lst": [{
        "sub_name": 'A',
        "dist": [{ "h": "0", "0": "0" }],
      }, {
        "sub_name": 'c',
        "dist": [{ "h": "0", "0": "0" }],
      }, {
        "sub_name": 'b',
        "dist": [{ "h": "0", "0": "0" }],
      }]
    }
    ],
    "grand_total": 100,
    "total_obtained_marks": 77,
    "total_average_marks": 77,
    "total_average_marks_percent": 77,
    "gpa": 7
  },
  {
    "exam_type_id": 38,
    "exam_type": "Term 2",
    " mark_dist": [{
      "all_dist": ['pra', 'theory', 'written'],
      "subject_lst": [{
        "sub_name": 'A',
        "dist": [{ "h": "0", "0": "0" }],
      }, {
        "sub_name": 'A',
        "dist": [{ "h": "0", "0": "0" }],
      }, {
        "sub_name": 'A',
        "dist": [{ "h": "0", "0": "0" }],
      }]
    }
    ],
    "grand_total": 100,
    "total_obtained_marks": 77,
    "total_average_marks": 77,
    "total_average_marks_percent": 77,
    "gpa": 7
  }]
  ///v1/reports/Student/school/{student_id}
  // let url = "/api/v1/StdCourseExam/fetch-student-view-marks-report/"+this.institute_id + "/" + this.student_id;
  examDetailsForSchool: any = [];
  subjectlist: any = [];
  marklist: any = [];
  getExamDetailsForSchool() {
    //   let data:any =[];
    //   let markdata:any=[];
    //   alert(this.student_id);
    //   for(let i in this.examdata){
    // for(let j in this.examdata[i].subject_list){
    // data.push(this.examdata[i].subject_list[j]);
    // for(let k in data.marks_dist_list){
    //   markdata.push(data[j].marks_dist_list[k]);
    // }
    // }
    // this.marklist =markdata;
    // console.log(this.marklist);
    //   }
    //   this.subjectlist =data;
    // console.log(this.subjectlist)
    this.auth.showLoader();
    let url = "/api/v1/StdCourseExam/fetch-student-view-marks-report/" + this.institute_id + "/" + this.student_id;
    this.httpService.getData(url).subscribe(
      (res: any) => {
        this.examDetailsForSchool = res;
        // this.fetchDefaultAY();
        this.auth.hideLoader();
      },
      (error: any) => {
        this.auth.hideLoader();
        this._commService.showErrorMessage('error', '', error.error.message);

      }
    )
  }
  inventoryDetails: any = [];
  getInventoryDetails() {
    //https://test999.proctur.com/StdMgmtWebAPI/api/v1/inventory/item/student/txHistory/11769
    this.auth.showLoader();
    let url = "/api/v1/inventory/item/student/txHistory" + "/" + this.student_id;
    this.httpService.getData(url).subscribe(
      (res: any) => {
        this.inventoryDetails = res;
        // this.fetchDefaultAY();
        this.auth.hideLoader();

      },
      (error: any) => {
        this.auth.hideLoader();
        this._commService.showErrorMessage('error', '', error.error.message);

      }

    )
  }
  tempForInventory=[];
  deletePopup(obj){
    this.tempForInventory =obj.allocation_id;
    //this.tempForCat= obj;
    $('#deleteModalCat').modal('show');
  }
  deleteInventory(obj){
    this.auth.showLoader();
      this.httpService.deleteData('/api/v1/inventory/item/txHistory/' + obj, null).subscribe(
        (res: any) => {
          this.auth.hideLoader();
          this.msgService.showErrorMessage('success', '', 'Inventory Deleted Successfully');
          this.getInventoryDetails();
         $('#deleteModalCat').modal('hide');
        },
        err => {
         this.msgService.showErrorMessage('error', '', err.error.message);
          this.auth.hideLoader();
        }
      );
    
  
  }
  manageFees() {
    this.router.navigate(['/view/fee/update-fee/view-fee/' + this.student_id]);
    // this.router.navigate(["/view/students/edit/" + event]);
  }
  @ViewChild('fileForm', { static: false }) fileForm: NgForm;
  @ViewChild('uploadFileControl',{ static: false }) myInputVariable: ElementRef;
  clear(){
    this.fileForm.resetForm();
    this.myInputVariable.nativeElement.value = '';
  this.selectedFiles=[];
  }
  //download fees
  paymentMode: number = 0;
  studentFeeInstallment(userType) {
    let object = {
      student_ids: this.student_id,// string by ids common seperated
      institution_id: '',
      sendEmail: userType,
    }
    object['user_role'] = this.paymentMode;
    this.auth.showLoader()
    this.PostStudService.getFeeInstallments(object).subscribe((res: any) => {
      this.auth.hideLoader()
      if (userType == -1) {
        let byteArr = this._commService.convertBase64ToArray(res.document);
        let fileName = res.docTitle;
        let file = new Blob([byteArr], { type: 'text/csv;charset=utf-8;' });
        let url = URL.createObjectURL(file);
        const dwldLink = document.createElement('a');
        dwldLink.setAttribute("href", url);
        dwldLink.setAttribute("download", fileName);
        document.body.appendChild(dwldLink);
        dwldLink.click();
        document.body.removeChild(dwldLink);
      } else {
        $('#sendModal').modal('hide');
        this._commService.showErrorMessage('success', '', 'fee installement send on your mail successfully');
      }
    },
      (err: any) => {
        this.auth.hideLoader()
        this._commService.showErrorMessage('error', '', err.error.message);
      })
  }
}

