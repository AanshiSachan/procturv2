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
    //this.getPrefetchData();
    let obj={
      subject_id:-1,
      standard_id:-1,
      assigned:"N"
    }
    this.reportService.getMasterCourse(obj).subscribe(
      (data:any) =>{
        console.log(data);
        this.masterCourses=data.standardLi;
        console.log(this.masterCourses);
        this.batchCourses=data.batchLi;
        //console.log(this.batchCourses);
        this.courses=data.subjectLi;
      },
        (error:any) =>{
          return error;
        }
    )
  }
  changeValue(){

    let obj={
      subject_id:this.courseData,
      standard_id:this.masterData,
      assigned:"N"
    }
    this.reportService.getMasterCourse(obj).subscribe(
      (data:any) =>{
        console.log(data);
        this.masterCourses=data.standardLi;
        console.log(this.masterCourses);
        this.batchCourses=data.batchLi;
        console.log(this.batchCourses);
        this.courses=data.subjectLi;
        console.log(this.courses);
      },
      (error:any) =>{
        return error;
        
      }
    )
  }

  // getPrefetchData() {
  //   // this.reportService.getMasterCourse().subscribe(
  //   //   (data: any) => {
  //   //     this.attendanceDataSource = data;
  //   //     console.log(data);
  //   //     this.masterCourses = data.standardLi;
  //   //     this.batchCourses = data.batchLi;
  //   //   },
  //   //   error => {
  //   //     let msg = {
  //   //       type: "error",
  //   //       title: "",
  //   //       body: "An Error Occured"
  //   //     }
  //   //     this.appc.popToast(msg);
  //   //   }
  //   )




  }



