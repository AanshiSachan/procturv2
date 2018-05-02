import { Component, OnInit } from '@angular/core';
import { BiometricServiceService } from '../../../services/biometric-service/biometric-service.service';
import { AppComponent } from '../../../app.component';
import { AuthenticatorService } from "../../../services/authenticator.service";
import * as moment from 'moment';
@Component({
  selector: 'app-biometric',
  templateUrl: './biometric.component.html',
  styleUrls: ['./biometric.component.scss']
})
export class BiometricComponent implements OnInit {

  masterCourse: any[] = [];
  studentsData: any[] = [];
  master: any = "";
  courses: any[] = [];
  masterCourseNames: boolean = true;
  students: any = "";
  isProfessional: boolean = true;
  addReportPopUp: boolean = false;
  popupCtrl: any = "";
  addAcademicPopUp: boolean = false;
  isRippleLoad: boolean = true;
  monthAttendance: any[] = [];
  showStudentTable: boolean = false;
  showTeachersTable: boolean = false;
  othersData: any[] = [];
  showCustomTable: boolean = false;
  PageIndex: number = 1;
  pagedisplaysize: number = 10;
  totalRow: number;
  showTable: boolean = false;
  showMonth: boolean = false;
  studentsDisplayData: any[] = [];
  showRange: boolean = false;
  showWeek: boolean = false;
  weekAttendance: any[] = [];
  range: any[] = [];
  addAbsentiesPopup = false;
  showButton: boolean = true;
  masters: any[] = [];
  subjects: any[] = [];
  absentiesRecords: any[] = [];
  absentTable: boolean = false;
  dummyArr: any[] = [0, 1, 2, 0, 1, 2];
  columnMaps: any[] = [0, 1, 2, 3, 4, 5,6];
  dataStatus : boolean = false;
  showTeacherButton : boolean =true;
  getData = {
    school_id: -1,
    name: "",
    is_active_status: 1,
    standard_id: -1,
    batch_id: -1,
    master_course_name: "",
    course_id: -1,
    subject_id: -1,
    user_Type: 1,
    biometric_attendance_date: moment().format('YYYY-MM-DD')
  }
  getAbsentiesData = {
    batch_id: -1,
    course_id: -1,
    from_date: "",
    institution_id: this.reportService.institute_id,
    master_course_name: -1,
    standard_id: -1,
    subject_id: -1
  }
  getAllData = {
    from_date: "",
    institute_id: this.reportService.institute_id,
    to_date: "",
    user_id: ""
  }
  constructor(private reportService: BiometricServiceService,
    private appc: AppComponent,
    private institute_id: AuthenticatorService) { }

  ngOnInit() {
    this.getMasterCourses();
  }
  getMasterCourses() {
    
    this.getData.biometric_attendance_date = moment().format('YYYY-MM-DD');
    this.getData.name = "";
    this.getData.master_course_name = "";
    this.reportService.getAllData().subscribe(
      (data: any) => {
        
        this.masterCourse = data;
        this.isRippleLoad = false;
      },
      (error) => {
        return error;
      }
    )
  }
  getCourses(i) {
    this.reportService.getCourses(i).subscribe(
      (data: any) => {
        this.courses = data.coursesList;
      },
      (error) => {
        return error;
      }
    )

  }
  getSubjects(i) {
    this.reportService.getSubjects(i).subscribe(
      (data: any) => {
        this.subjects = data.batchesList;
      },
      (error: any) => {
        return error;
      }
    )
  }
  fetchDataByName() {
    this.studentsData = [];
    this.showTeacherButton = true;
    if (this.getData.user_Type == 1) {
      this.showTeacherButton = true;
      this.showStudentTable = true;
      this.showTeachersTable = false;
      this.showCustomTable = false;
      this.dataStatus = true;
      this.reportService.getAttendanceReport(this.getData).subscribe(
        (data: any) => {
          this.dataStatus =  false;
          this.studentsData = data;
          this.totalRow = data.length;
          this.PageIndex = 1;
          this.fetchTableDataByPage(this.PageIndex);
        
        },
        (error) => {
          this.dataStatus =  false;
          this.isRippleLoad = false;
          return error;
        }
      )
    }
    else if (this.getData.user_Type == 3) {
      this.showTeacherButton = true;
      this.showTeachersTable = true;
      this.showStudentTable = false;
      this.showCustomTable = false;

      this.reportService.getAttendanceReportTeachers(this.getData).subscribe(
        (data: any) => {
          this.studentsData = data;
          this.totalRow = data.length;
          this.PageIndex = 1;
          this.fetchTableDataByPage(this.PageIndex);
        },
        (error: any) => {
          return error;
        }
      )
    }
    else {
      this.showTeacherButton = true;
      this.showStudentTable = false;
      this.showTeachersTable = false;
      this.showCustomTable = true;
      this.reportService.getAttendanceReportOthers(this.getData).subscribe(
        (data: any) => {
          this.studentsData = data;
          this.totalRow = data.length;
          this.PageIndex = 1;
          this.fetchTableDataByPage(this.PageIndex);
        },
        (error: any) => {
          return error;
        }
      )
    }
  }


  viewOlderRecords(i) {
    this.getAllData.user_id = i.user_id;
    this.addReportPopUp = true;
    this.reportService.getAllFinalReport(this.getAllData).subscribe(
      (data: any) => {

      },
      (error: any) => {
        return error;
      }
    )
  }
  closeReportPopup() {
    this.addReportPopUp = false;
  }

  showMaster(i) {
    if (i == 1) {
      this.showTeacherButton=true;
      this.showTeachersTable = false;
      this.masterCourseNames = true;
      this.showCustomTable = false;
      this.showButton = true;
    }
    else {
      this.showTeacherButton=true;
      this.showStudentTable = false;
      this.masterCourseNames = false;
      this.showButton = false;
    }
  }
  popupChange() {
    this.monthAttendance = [];
    this.weekAttendance = [];
    if (this.popupCtrl == 2) {

      this.addReportPopUp = false;
      this.addAcademicPopUp = true;
      this.showRange = true;
      this.showMonth = false;
      this.showWeek = false;

    }
    else if (this.popupCtrl == 0) {

      this.getAllData = {
        from_date: moment().subtract('months', 1).format('YYYY-MM-DD'),
        institute_id: this.reportService.institute_id,
        to_date: moment().format('YYYY-MM-DD'),
        user_id: this.getAllData.user_id
      }
      this.addReportPopUp = false;
      this.addAcademicPopUp = true;
      this.showMonth = true;
      this.showRange = false;
      this.showWeek = false;
      this.reportService.getAllFinalReport(this.getAllData).subscribe(
        (data: any) => {
          this.monthAttendance = data;

        },
        (error: any) => {
          return error;
        }
      )

    }
    else if (this.popupCtrl == 1) {
      this.getAllData = {
        from_date: moment().subtract('days', 7).format('YYYY-MM-DD'),
        institute_id: this.reportService.institute_id,
        to_date: moment().format('YYYY-MM-DD'),
        user_id: this.getAllData.user_id
      }
      this.addReportPopUp = false;
      this.addAcademicPopUp = true;
      this.showMonth = false;
      this.showRange = false;
      this.showWeek = true;
      this.reportService.getAllFinalReport(this.getAllData).subscribe(
        (data: any) => {
          this.weekAttendance = data;

        },
        (error: any) => {

        }
      )

    }

  }
  closeReportAcademicPopup() {
    this.addAcademicPopUp = false;
  }
  getInstitute() {
    let type: any = sessionStorage.getItem('institute_type');
    if (type == 'LANG') {
      this.isProfessional = true;
    }
    else {
      this.isProfessional = false;
    }
  }

  showDataTable() {
    this.range = [];
    this.getAllData = {
      from_date: moment(this.getAllData.from_date).format('YYYY-MM-DD'),
      institute_id: this.reportService.institute_id,
      to_date: moment(this.getAllData.to_date).format('YYYY-MM-DD'),
      user_id: this.getAllData.user_id
    }
    let diff = moment(this.getAllData.from_date).diff(moment(this.getAllData.to_date), 'months');
    // let futureDate = moment(this.getAllData.to_date).add('days',1);
    if (diff < -2) {
      let msg = {
        type: "error",
        title: "Incorrect Details",
        body: "Range should not be more than 2 months"
      }

      this.appc.popToast(msg);
    }
    else if (this.getAllData.from_date >= this.getAllData.to_date) {
      let msg = {
        type: "error",
        title: "Incorrect Details",
        body: "From date cannot be Greater than to date"
      }

      this.appc.popToast(msg);
    }
    // else if(this.getAllData.to_date == 'futureDate'){
    //   let msg = {
    //     type: "error",
    //     title: "Incorrect Details",
    //     body: "Future Date is not allowed"
    //   }

    //   this.appc.popToast(msg);
    // }

    else {
      this.reportService.getAllFinalReport(this.getAllData).subscribe(
        (data: any) => {
          this.range = data;

        },
        (error) => {
          return error;
        }

      )
      this.showTable = true;

    }
  }
  fetchAbsentiesReport() {
    this.addAbsentiesPopup = true;
  }

  closeAbsentiesPopup() {

    this.addAbsentiesPopup = false;
  }
  viewAbsentiesRecord() {
    this.absentTable = true;
    if (this.getAbsentiesData.from_date == "") {
      let msg = {
        type: "error",
        title: "Incorrect Details",
        body: "Please specify absent date"
      }

      this.appc.popToast(msg);
    }
    else {
      this.reportService.fetchAbsentiesData(this.getAbsentiesData).subscribe(
        (data: any) => {
          this.absentiesRecords = data;
        },
        (error: any) => {
          return error;
        }
      )
    }
  }  //pagination functions
  fetchTableDataByPage(index) {
    this.PageIndex = index;
    let startindex = this.pagedisplaysize * (index - 1);

    this.studentsDisplayData = this.getDataFromDataSource(startindex);

  }

  fetchNext() {
    this.PageIndex++;
    this.fetchTableDataByPage(this.PageIndex);
  }

  fetchPrevious() {
    if (this.PageIndex != 1) {
      this.PageIndex--;
      this.fetchTableDataByPage(this.PageIndex);
    }
  }

  getDataFromDataSource(startindex) {

    let d = this.studentsData.slice(startindex, startindex + this.pagedisplaysize);
    return d;

  }


}
