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

  attendanceReport = {
    standard_id:"",
    subject_id:"",
    batch_id:""
 }
    

  constructor(
    private reportService: AttendanceReportServiceService,
    private appc: AppComponent
  ) {
  }


  ngOnInit() {
    this.getPrefetchData();
    console.log(this.attendanceReport);
  }

  getPrefetchData() {
    this.reportService.getMasterCourse().subscribe(
      (data: any) => {
        this.attendanceDataSource = data;
        console.log(data);
        this.masterCourses = data.standardLi;
        this.batchCourses = data.batchLi;
      },
      error => {
        let msg = {
          type: "error",
          title: "",
          body: "An Error Occured"
        }
        this.appc.popToast(msg);
      }
    )




  }

}

