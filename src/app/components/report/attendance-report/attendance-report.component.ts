import { Component, OnInit } from '@angular/core';
import { AttendanceReportServiceService } from '../../../services/attendance-report/attendance-report-service.service';
import { AppComponent } from '../../../app.component';
import { AuthenticatorService } from "../../../services/authenticator.service";
import * as moment from 'moment';
import { error } from 'util';
import { ColumnSetting } from '../../shared/custom-table/layout.model';
import { searchPipe } from '../../shared/pipes/searchBarPipe';
import { arraySortPipe } from '../../shared/pipes/sortBarPipe';
import { start } from 'repl';
@Component({
  selector: 'app-attendance-report',
  templateUrl: './attendance-report.component.html',
  styleUrls: ['./attendance-report.component.scss']
})
export class AttendanceReportComponent implements OnInit {

  attendanceDataSource: any;
  masterCourses: any[] = [];
  postData: any[] = [];
  pagedPostData: any[] = [];
  courses: any[] = [];
  batchCourses: any[] = [];
  SummaryReports: boolean = false;
  PageIndex: number = 1;
  PageIndexPopup: number = 1;
  pagedisplaysize: number = 10;
  pagedisplaysizePopup: number = 10;
  totalRow: number;
  totalRowPopup: number;
  addReportPopUp: boolean = false;
  dateWiseAttendance: any[] = [];
  dateWiseAttendancePro: any[] = [];
  pageDetailedData: any[] = [];
  dataTypeAttendance: any[] = [];
  dataTypeAttendancePro: any[] = [];
  typeAttendance: any[] = [];
  attendanceIndex0: any[] = [];
  attendanceIndexi: number;
  attendanceIndexiPro: number;
  attendanceIndex0Pro: any[] = [];
  attendanceIndexiOf: any[] = [];
  attendanceIndexiOfPro: any[] = [];
  isProfessional: boolean = true;
  masterCoursePro: any[] = [];
  subjectPro: any[] = [];
  batchPro: any[] = [];
  typeAttendancePro: any[] = [];
  pagedPostDataPro: any[] = [];
  queryParamsPro: any[] = [];
  pageDetailedDataPro: any[] = [];
  projectSettings: ColumnSetting[] = [
    { primaryKey: 'student_id', header: 'Student id' },
    { primaryKey: 'student_name', header: 'Student name' },
    { primaryKey: 'student_phone', header: 'Contact no' },
    { primaryKey: 'doj', header: 'Joining date' },
    { primaryKey: 'total_classes', header: 'Total classes' },
    { primaryKey: 'total_attended', header: 'Present' },
    { primaryKey: 'total_absent', header: 'Absent' },
    { primaryKey: 'total_leave', header: 'Leave' },
    { primaryKey: 'spent_percentage', header: 'Attendance' }
  ];
  getData = {
    standard_id: "",
    subject_id: "",
    institution_id: parseInt(this.institute_id.getInstituteId()),
    course_id: "",
    batch_id: "",
    master_course_name: "",
    from_date: "",
    to_date: ""
  }
  /*for professional*/
  queryParams = {
    standard_id: -1,
    subject_id: -1,
    institution_id: parseInt(this.institute_id.getInstituteId()),
    course_id: -1,
    batch_id: -1,
    master_course_name: "",
    from_date: "",
    to_date: ""
  }
  constructor(
    private reportService: AttendanceReportServiceService,
    private appc: AppComponent,
    private institute_id: AuthenticatorService
  ) { }


  ngOnInit() {
    this.isProfessional = sessionStorage.getItem('institute_type') == 'LANG';
    this.getMasterCourseData();
  }
  getMasterCourseData() {
    if (this.isProfessional) {

      this.reportService.masterCoursePro(this.queryParams).subscribe(
        (data: any) => {
          this.masterCoursePro = data.standardLi;
          this.subjectPro = data.batchLi;
          console.log(this.masterCoursePro);
        },
        (error: any) => {
          return error;
        }
      )


    }
    else {
      this.reportService.getMasterCourse().subscribe(
        (data: any) => {
          this.masterCourses = data;
          console.log(this.masterCourses);
        },
        (error: any) => {
          return error;
        }
      )
    }
  }
  getCourseData(i) {
    this.queryParams = {
      subject_id: -1,
      standard_id: i,
      institution_id: parseInt(this.institute_id.getInstituteId()),
      course_id: -1,
      batch_id: -1,
      master_course_name: "",
      from_date: "",
      to_date: ""
    }
    if (this.isProfessional) {

      this.reportService.masterCoursePro(this.queryParams).subscribe(
        (data: any) => {
          this.subjectPro = data.subjectLi;
        },
        (error: any) => {
          return error;
        }
      )
      this.batchPro = [];
      this.subjectPro = [];
    }
    else {
      this.getData.batch_id = "";
      this.getData.course_id = "";
      this.reportService.getCourses(i).subscribe(

        (data: any) => {
          this.courses = data.coursesList;
          // this.getPostData();
        }
        ,
        (error: any) => {
          return error;
        }
      )
      this.courses = [];
      this.batchCourses = [];

    }

  }
  getSubjectData(i) {

    this.queryParams = {
      subject_id: i,
      standard_id: this.queryParams.standard_id,
      institution_id: parseInt(this.institute_id.getInstituteId()),
      course_id: -1,
      batch_id: -1,
      master_course_name: "",
      from_date: "",
      to_date: ""
    }
    if (this.isProfessional) {

      this.reportService.masterCoursePro(this.queryParams).subscribe(
        (data: any) => {
          this.batchPro = data.batchLi;
        },
        (error: any) => {
          return error;
        }
      )
      this.batchPro = [];
    }
    else {
      this.getData.batch_id = "";
      this.reportService.getSubject(i).subscribe(
        (data: any) => {
          this.batchCourses = data.batchesList;
          // this.getPostData();
        }
      )
      this.batchCourses = [];
    }
  }

  getBatchData(i) {
    this.queryParams = {
      subject_id: i,
      standard_id: this.queryParams.standard_id,
      institution_id: parseInt(this.institute_id.getInstituteId()),
      course_id: -1,
      batch_id: this.queryParams.batch_id,
      master_course_name: "",
      from_date: "",
      to_date: ""
    }
    if (this.isProfessional) {
      this.reportService.postDataToTablePro(this.queryParams).subscribe(
        (data: any) => {
          // this.getPostData();
        }
      )
    }
    else {
      this.reportService.postDataToTable(this.getData).subscribe(
        (data: any) => {
          // this.getPostData();
        }
      )
    }
  }


  getPostData() {
    this.SummaryReports = true;
    if (this.isProfessional) {
      this.reportService.postDataToTablePro(this.queryParams).subscribe(
        (data: any) => {
          this.queryParams = data;
          this.queryParamsPro = data;
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
      this.reportService.postDataToTable(this.getData).subscribe(
        (data: any) => {
          this.postData = data;
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
  postDetails() {
    if (this.isProfessional) {
      if (this.queryParams.from_date == "" || this.queryParams.to_date == "" || this.queryParams.batch_id == -1 || this.queryParams.subject_id==-1 || this.queryParams.standard_id==-1) {

        let msg = {
          type: "error",
          title: "Incorrect Details",
          body: "All fields Are required"
        }
        this.appc.popToast(msg);
      }
      else if (this.queryParams.from_date > this.queryParams.to_date) {
        let msg = {
          type: "error",
          title: "Incorrect Details",
          body: "From Date Must Be less than to date"
        }
        this.appc.popToast(msg);
      }
      else {

        this.addReportPopUp = true;
        this.reportService.postDetailedData(this.queryParams).subscribe(
          (data: any) => {
            this.dateWiseAttendancePro = data;
            console.log(this.dateWiseAttendancePro);
            this.dataTypeAttendancePro = data.map((ele) => {
              this.typeAttendancePro = ele.attendanceDateType;
            });
            console.log(this.typeAttendancePro);
            this.attendanceIndex0Pro = this.typeAttendancePro[0];
            this.attendanceIndexiPro = this.typeAttendancePro.length;
            this.attendanceIndexiOfPro = this.typeAttendancePro[this.attendanceIndexiPro - 1];

            this.totalRowPopup = data.length;
            this.PageIndexPopup = 1;
            this.fetchTableDataByPagePopup(this.PageIndexPopup);
            ;
          },
          (error: any) => {
            return error;

          }
        )
      }
    }
    else {
      if (this.getData.master_course_name == "" || this.getData.course_id == "" || this.getData.batch_id == "" || this.getData.from_date == "" || this.getData.to_date == "") {

        let msg = {
          type: "error",
          title: "Incorrect Details",
          body: "All fields Are required"
        }
        this.appc.popToast(msg);
      }
      else if (this.getData.from_date > this.getData.to_date) {
        let msg = {
          type: "error",
          title: "Incorrect Details",
          body: "From Date Must Be less than to date"
        }
        this.appc.popToast(msg);
      }
      else {

        this.addReportPopUp = true;
        this.reportService.postDetailedData(this.getData).subscribe(
          (data: any) => {
            this.dateWiseAttendance = data;
            this.dataTypeAttendance = this.dateWiseAttendance.map((ele) => {
              this.typeAttendance = ele.attendanceDateType;
            })

            console.log(this.typeAttendance);
            this.attendanceIndex0 = this.typeAttendance[0];
            this.attendanceIndexi = this.typeAttendance.length;
            this.attendanceIndexiOf = this.typeAttendance[this.attendanceIndexi - 1];

            this.totalRowPopup = data.length;
            this.PageIndexPopup = 1;
            this.fetchTableDataByPagePopup(this.PageIndexPopup);
            ;
          },
          (error: any) => {
            return error;

          }
        )
      }
    }
  }
  closeReportPopup() {
    if(this.pagedPostData.length==0){
      this.addReportPopUp = false;
    }
    this.addReportPopUp = false;
  }
  // pagination functions 
  //for summary report
  fetchTableDataByPage(index) {
    this.PageIndex = index;
    let startindex = this.pagedisplaysize * (index - 1);
    if (this.isProfessional) {
      this.pagedPostDataPro = this.getDataFromDataSource(startindex);
    }
    this.pagedPostData = this.getDataFromDataSource(startindex);

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
    if (this.isProfessional) {
      let t = this.queryParamsPro.slice(startindex, startindex + this.pagedisplaysize);
      return t;
    }
    else {
      let t = this.postData.slice(startindex, startindex + this.pagedisplaysize);
      return t;
    }
  }

  //for detailed report

  fetchTableDataByPagePopup(index) {
    this.PageIndexPopup = index;
    let startindex = this.pagedisplaysizePopup * (index - 1);
    if (this.isProfessional) {
      this.pageDetailedDataPro = this.getDataFromDataSourcePopup(startindex);
    }
    else {
      this.pageDetailedData = this.getDataFromDataSourcePopup(startindex);
    }
  }

  fetchNextPopup() {
    this.PageIndexPopup++;
    this.fetchTableDataByPage(this.PageIndexPopup);
  }

  fetchPreviousPopup() {
    if (this.PageIndexPopup != 1) {
      this.PageIndexPopup--;
      this.fetchTableDataByPage(this.PageIndexPopup);
    }
  }

  getDataFromDataSourcePopup(startindex) {
    if (this.isProfessional) {
      let d = this.dateWiseAttendancePro.slice(startindex, startindex + this.pagedisplaysizePopup);
      return d;
    }
    else {
      let d = this.dateWiseAttendance.slice(startindex, startindex + this.pagedisplaysizePopup);
      return d;
    }
  }

  sortedData(ev) {
    console.log(ev);
  }

}




