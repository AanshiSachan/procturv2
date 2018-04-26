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
  teachersData: any[] = [];
  showStudentTable: boolean = false;
  showTeachersTable: boolean = false;
  othersData: any[] = [];
  showCustomTable: boolean = false;
  getData = {
    school_id: -1,
    name: "",
    is_active_status: 1,
    standard_id: -1,
    batch_id: -1,
    master_course_name: "",
    course_id: -1,
    subject_id: -1,
    user_Type: "",
    
    // biometric_attendance_date:""
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
  fetchDataByName() {

    if (this.getData.user_Type == "1") {
      this.showStudentTable = true;
      this.showTeachersTable = false;
      this.showCustomTable = false;
      this.reportService.getAttendanceReport(this.getData).subscribe(
        (data: any) => {

          this.studentsData = data;

        },
        (error) => {
          this.isRippleLoad = false;
          return error;
        }
      )
    }
    else if (this.getData.user_Type == "3") {
      this.showTeachersTable = true;
      this.showStudentTable = false;
      this.showCustomTable = false;
      this.reportService.getAttendanceReportTeachers(this.getData).subscribe(
        (data: any) => {
          this.teachersData = data;
        },
        (error: any) => {
          return error;
        }
      )
    }
    else {
      this.showStudentTable = false;
      this.showTeachersTable = false;
      this.showCustomTable = true;
      this.reportService.getAttendanceReportOthers(this.getData).subscribe(
        (data: any) => {
          this.othersData = data;
        },
        (error: any) => {
          return error;
        }
      )
    }
  }
  
  viewOlderRecords(i) {
    this.getAllData = {
      from_date: "",
      institute_id: this.reportService.institute_id,
      to_date: "",
      user_id: i.student_id
    }
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
      this.showTeachersTable = false;
      this.masterCourseNames = true;
      this.teachersData = [];
      this.showCustomTable = false;
      this.othersData = [];
    }
    else {
      this.showStudentTable = false;
      this.masterCourseNames = false;
      this.studentsData = [];
    }
  }
  popupChange() {
    if (this.popupCtrl == 2) {
      this.addReportPopUp = false;
      this.addAcademicPopUp = true;
    }
    else {
      this.addAcademicPopUp = false;
      this.addReportPopUp = true;
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
}
