import { Component, OnInit } from '@angular/core';
import { AttendanceReportServiceService } from '../../../services/attendance-report/attendance-report-service.service';
import { AppComponent } from '../../../app.component';
@Component({
  selector: 'app-attendance-report',
  templateUrl: './attendance-report.component.html',
  styleUrls: ['./attendance-report.component.scss']
})
export class AttendanceReportComponent implements OnInit {

  attendanceDataSource: any;
  masterCourses: any[] = [];
  courses: any[] = [];
  batchCourses: any[] = [];
  masterData="";
  courseData="";
  batchesData="";

  constructor(
    private reportService: AttendanceReportServiceService,
    private appc: AppComponent
  ) {
  }


  ngOnInit() {
  this.getMasterCourseData();
  
  }
  getMasterCourseData(){
    
    this.reportService.getMasterCourse().subscribe(
      (data:any)=>{
        console.log(data);
        this.masterCourses=data;
      },
      (error:any)=>{
        return error;
      }
    )

  }

  getCourseData(i){
    
    this.reportService.getCourses(i).subscribe(
      (data:any)=>{
        console.log(data);
        this.courseData=data.coursesList;
        console.log(this.courseData);
      },
      (error:any)=>{
        return error;
      }
    )
      
  }
    
  getSubjectData(i){

    this.reportService.getSubject(i).subscribe(
      (data:any)=>{
        console.log(data);
      }
    )
  }


  }



