import { Component, OnInit } from '@angular/core';
import { AttendanceReportServiceService } from '../../../services/attendance-report/attendance-report-service.service';
import { AppComponent } from '../../../app.component';
import { AuthenticatorService } from "../../../services/authenticator.service";
import * as moment from 'moment';
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
  masterData = "";
  courseData = "";
  batchesData = "";
  SummaryReports: boolean = false;
  PageIndex: number = 1;
  studentdisplaysize: number = 10;
  totalRow: number;
  addReportPopUp:boolean=false;
  dateWiseAttendance:any[]=[];
  pageDetailedData:any[]=[];
  dataTypeAttendance:any[]=[];
  typeAttendance:any[]=[];
  attendanceIndex0:any[]=[];
  attendanceIndexi:number;
  attendanceIndexiOf:any[]=[];
  getData = {
    standard_id: -1,
    subject_id: -1,
    institution_id: parseInt(this.institute_id.getInstituteId()),
    course_id: -1,
    batch_id: -1,
    master_course_name:"",
    from_date:moment().format('YYYY-MM-DD'),
    to_date: moment().format('YYYY-MM-DD')
  }
  postedData = {
    standard_id: -1,
    subject_id: -1,
    institution_id: parseInt(this.institute_id.getInstituteId()),
    course_id: -1,
    batch_id: -1,
    from_date:moment().format('YYYY-MM-DD'),
    to_date: moment().format('YYYY-MM-DD')
  }
  
  
  constructor(
    private reportService: AttendanceReportServiceService,
    private appc: AppComponent,
    private institute_id: AuthenticatorService
  ) { }


  ngOnInit() {
    this.getMasterCourseData();
    
  }
  getMasterCourseData() {
    this.reportService.getMasterCourse().subscribe(
      (data: any) => {
        this.masterCourses = data;

      },
      (error: any) => {
        return error;
      }
    )

  }
  getCourseData(i) {
    this.getData.batch_id = -1;
    this.getData.course_id = -1;
    this.reportService.getCourses(i).subscribe(
      (data: any) => {
        this.courses = data.coursesList;
        // this.getPostData();
      },
      (error: any) => {
        return error;
      }
    )
  }
  getSubjectData(i) {
    this.getData.batch_id = -1;
    this.reportService.getSubject(i).subscribe(
      (data: any) => {
        this.batchCourses = data.batchesList;
        // this.getPostData();
      }
    )
  }
  getBatchData(i) {
    this.reportService.postDataToTable(this.getData).subscribe(
      (data: any) => {
        // this.getPostData();
      }
    )
  }

  getPostData() {
    this.SummaryReports = true;
    this.reportService.postDataToTable(this.getData).subscribe(
      (data: any) => {
        console.log(data);
        this.postData = data;
        console.log(this.postData);
        this.getData.master_course_name = "";
        this.batchCourses = [];
        this.courses = [];
         this.totalRow = data.length;
         this.PageIndex = 1;
         this.fetchTableDataByPage(this.PageIndex);
        
      },
      (error: any) => {
        return error;
      }
    )

  }
  postDetails(){
    this.addReportPopUp=true;   
    this.reportService.postDetailedData(this.postedData).subscribe(
      (data:any)=>{
        
        this.dateWiseAttendance=data;
        this.dataTypeAttendance=data.map((ele)=>{
          this.typeAttendance=(ele.attendanceDateType);
          console.log(this.typeAttendance);
        });
      this.attendanceIndex0=this.typeAttendance[0];
      console.log(this.attendanceIndex0);
      this.attendanceIndexi=this.typeAttendance.length;
      this.attendanceIndexiOf=this.typeAttendance[this.attendanceIndexi-1];
      this.totalRow = data.length;
        this.PageIndex = 1;
        this.fetchTableDataByPagePopup(this.PageIndex);
      
     ;
      },
      (error:any)=>{
        return error;

      }
    )
  }
  closeReportPopup(){
    this.addReportPopUp=false;
  }
  // pagination functions 

  fetchTableDataByPage(index) {
    this.PageIndex = index;
    let startindex = this.studentdisplaysize * (index - 1);
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
    let t = this.postData.slice(startindex, startindex + this.studentdisplaysize);
    let d=this.dateWiseAttendance.slice(startindex, startindex + this.studentdisplaysize);

    return t;
  }
  
  fetchTableDataByPagePopup(index) {
    this.PageIndex = index;
    let startindex = this.studentdisplaysize * (index - 1);
  
    this.pageDetailedData=this.getDataFromDataSource(startindex);
  }

  fetchNextPopup() {
    this.PageIndex++;
    this.fetchTableDataByPage(this.PageIndex);
  }

  fetchPreviousPopup() {
    if (this.PageIndex != 1) {
      this.PageIndex--;
      this.fetchTableDataByPage(this.PageIndex);
    }
  }

  getDataFromDataSourcePopup(startindex) {
    
    let d=this.dateWiseAttendance.slice(startindex, startindex + this.studentdisplaysize);
    console.log(d);
    
  }

}




