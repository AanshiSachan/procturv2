import { Component, OnInit } from '@angular/core';
import { AttendanceReportServiceService } from '../../../services/attendance-report/attendance-report-service.service';
import { AppComponent } from '../../../app.component';
import { AuthenticatorService } from "../../../services/authenticator.service";
import * as moment from 'moment';
import { error } from 'util';
import { ColumnSetting } from '../../shared/custom-table/layout.model';
import{searchPipe} from '../../shared/pipes/searchBarPipe';
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
  PageIndexPopup:number = 1;
  pagedisplaysize: number = 10;
  pagedisplaysizePopup:number = 10;
  totalRow: number;
  totalRowPopup:number;
  addReportPopUp:boolean=false;
  dateWiseAttendance:any[]=[];
  pageDetailedData:any[]=[];
  dataTypeAttendance:any[]=[];
  typeAttendance:any[]=[];
  attendanceIndex0:any[]=[];
  attendanceIndexi:number;
  attendanceIndexiOf:any[]=[];
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
    master_course_name:"",
    from_date:"",
    to_date:""
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
    this.courses=[];
    this.batchCourses=[];
  }
  getSubjectData(i) {
    this.getData.batch_id = "";
    this.reportService.getSubject(i).subscribe(
      (data: any) => {
        this.batchCourses = data.batchesList;
        // this.getPostData();
      }
    )
    this.batchCourses=[];
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
  postDetails(){
    if(this.getData.master_course_name == "" && this.getData.course_id == "" && this.getData.batch_id == "" && this.getData.from_date == "" && this.getData.to_date == ""){

        let msg={
          type:"error",
          title:"Incorrect Details",
          body:"All fields Are required"
        }
        this.appc.popToast(msg);
    } 
    else if(this.getData.from_date > this.getData.to_date){
      let msg={
        type:"error",
        title:"Incorrect Details",
        body:"From Date Must Be less than to date"
      }
      this.appc.popToast(msg);
    }
    else{
      
    this.addReportPopUp=true;   
    this.reportService.postDetailedData(this.getData).subscribe(
      (data:any)=>{  
        this.dateWiseAttendance=data;
        console.log(this.dateWiseAttendance);
        this.dataTypeAttendance=data.map((ele)=>{
        this.typeAttendance=(ele.attendanceDateType); 
        });
        
        this.attendanceIndex0=this.typeAttendance[0];
        this.attendanceIndexi=this.typeAttendance.length;
        this.attendanceIndexiOf=this.typeAttendance[this.attendanceIndexi-1];
        
        this.totalRowPopup = data.length;
        this.PageIndexPopup = 1;
        this.fetchTableDataByPagePopup(this.PageIndexPopup);
     ;
      },
      (error:any)=>{
        return error;

      }
    )
  }
}
  closeReportPopup(){
    this.addReportPopUp=false;
  }
  // pagination functions 
  //for summary report
  fetchTableDataByPage(index) {
    this.PageIndex = index;
    let startindex = this.pagedisplaysize * (index - 1);
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
    let t = this.postData.slice(startindex, startindex + this.pagedisplaysize);
    return t;
  }

  //for detailed report

  fetchTableDataByPagePopup(index) {
    this.PageIndexPopup = index;
    let startindex = this.pagedisplaysizePopup * (index - 1);
    this.pageDetailedData=this.getDataFromDataSourcePopup(startindex);
   
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
    
    let d=this.dateWiseAttendance.slice(startindex, startindex + this.pagedisplaysizePopup);
    return d;
    
  }

}




