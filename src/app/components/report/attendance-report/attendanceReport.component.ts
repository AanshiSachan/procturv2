import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  templateUrl: './attendanceReport.component.html',
  styleUrls: ['./attendanceReport.component.scss']
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
  property = "";
  direction = -1;
  dummyArr: any[] = [0, 1, 2, 0, 1, 2];
  columnMaps: any[] = [0, 1, 2, 3, 4, 5, 6];
  dataStatus: boolean = false;
  
  projectSettings: ColumnSetting[] = [
    { primaryKey: 'student_disp_id', header: 'Student id' },
    { primaryKey: 'student_name', header: 'Student name' },
    { primaryKey: 'student_phone', header: 'Contact no' },
    { primaryKey: 'doj', header: 'Joining date' },
    { primaryKey: 'total_classes', header: 'Total classes' },
    { primaryKey: 'total_attended', header: 'Present' },
    { primaryKey: 'total_absent', header: 'Absent' },
    { primaryKey: 'total_leave', header: 'Leave' },
    { primaryKey: 'spent_percentage', header: 'Attendance(%)' }
  ];
  
  attendanceFetchForm = {
    standard_id: "",
    subject_id: "",
    institution_id: sessionStorage.getItem('institute_id'),
    course_id: "",
    batch_id: "",
    master_course_name: "",
    from_date: "",
    to_date: ""
  }
  /*for professional*/
  queryParams = {
    standard_id: "",
    subject_id: "",
    institution_id: sessionStorage.getItem('institute_id'),
    course_id: -1,
    batch_id: "",
    master_course_name: "",
    from_date: "",
    to_date: ""
  };
  searchText: string = "";
  searchflag: boolean = false;
  searchData : any =[];


  @ViewChild('attendanceTable') attendanceTable: ElementRef;
  @ViewChild('xlsDownloader') xlsDownloader: ElementRef;


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
          this.dataStatus = false;
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
      subject_id: "",
      standard_id: i,
      institution_id: sessionStorage.getItem('institute_id'),
      course_id: -1,
      batch_id: "",
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
      this.attendanceFetchForm.batch_id = "";
      this.attendanceFetchForm.course_id = "";
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
      institution_id: sessionStorage.getItem('institute_id'),
      course_id: -1,
      batch_id: "",
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
      this.attendanceFetchForm.batch_id = "";
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
      institution_id: sessionStorage.getItem('institute_id'),
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
      this.reportService.postDataToTable(this.attendanceFetchForm).subscribe(
        (data: any) => {
          // this.getPostData();
        }
      )
    }
  }


  getPostData() {
    this.SummaryReports = true;
    this.dataStatus = true;
    this.PageIndex = 1;
    if (this.isProfessional) {
      this.reportService.postDataToTablePro(this.queryParams).subscribe(
        (data: any) => {
          this.dataStatus = false;
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
      this.reportService.postDataToTable(this.attendanceFetchForm).subscribe(
        (data: any) => {
          this.dataStatus = false;
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
      if (this.queryParams.from_date == "" || this.queryParams.to_date == "" || this.queryParams.batch_id == "" || this.queryParams.subject_id == "" || this.queryParams.standard_id == "") {

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
      if (this.attendanceFetchForm.master_course_name == "" || this.attendanceFetchForm.course_id == "" || this.attendanceFetchForm.batch_id == "" || this.attendanceFetchForm.from_date == "" || this.attendanceFetchForm.to_date == "") {

        let msg = {
          type: "error",
          title: "Incorrect Details",
          body: "All fields Are required"
        }
        this.appc.popToast(msg);
      }
      else if (this.attendanceFetchForm.from_date > this.attendanceFetchForm.to_date) {
        let msg = {
          type: "error",
          title: "Incorrect Details",
          body: "From Date Must Be less than to date"
        }
        this.appc.popToast(msg);
      }
      else {

        this.addReportPopUp = true;
        this.reportService.postDetailedData(this.attendanceFetchForm).subscribe(
          (data: any) => {
            this.dateWiseAttendance = data;
            this.dataTypeAttendance = this.dateWiseAttendance.map((ele) => {
              this.typeAttendance = ele.attendanceDateType;

            })

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
    else {
      this.pagedPostData = this.getDataFromDataSource(startindex);
    }
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
      if (this.searchflag) {
        let t = this.searchData.slice(startindex, startindex + this.pagedisplaysize);
        return t;
      } else {
        let t = this.queryParamsPro.slice(startindex, startindex + this.pagedisplaysize);
        return t;
      }
    }
    else {
      if (this.searchflag) {
        let t = this.searchData.slice(startindex, startindex + this.pagedisplaysize);
        return t;
      } else {
        let t = this.postData.slice(startindex, startindex + this.pagedisplaysize);
        return t;
      }
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
    this.property = ev;
    if (this.direction == -1) {
      this.direction = 1;
    }
    else {
      this.direction = -1;
    }
  }
  getColor(status) {
    switch (status) {
      case 'A': return 'red';
      case 'L': return 'blue';
    }
  }

  DownloadJsonToCsv() {
    console.log(this.attendanceTable.nativeElement.innerHtml);
    let link = this.xlsDownloader.nativeElement;
    let outer = this.attendanceTable.nativeElement.outerHTML.replace(/ /g, '%20');
    let data_type = 'data:application/vnd.ms-excel';

    link.setAttribute('href', data_type + ',' + outer);
    link.setAttribute('download', 'test.xls');
    link.click();
  }

  searchDatabase() {
    if (this.searchText != "" && this.searchText != null) {
      let searchData: any;
      if (this.isProfessional) {
        searchData = this.queryParamsPro.filter(item =>
          Object.keys(item).some(
            k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchText.toLowerCase()))
        );
      } else {
        searchData = this.postData.filter(item =>
          Object.keys(item).some(
            k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchText.toLowerCase()))
        );
      }
      this.searchData = searchData;
      this.totalRow = searchData.length;
      this.searchflag = true;
      this.fetchTableDataByPage(this.PageIndex);
    } else {
      this.searchflag = false;
      this.fetchTableDataByPage(this.PageIndex);
      if (this.isProfessional) {
        this.totalRow = this.queryParamsPro.length;
      } else {
        this.totalRow = this.postData.length;
      }
    }
  }


}
