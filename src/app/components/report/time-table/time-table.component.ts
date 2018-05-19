import { Component, OnInit } from '@angular/core';
import { timeTableService } from '../../../services/TimeTable/timeTable.service';
import { AppComponent } from '../../../app.component';
@Component({
  selector: 'app-time-table',
  templateUrl: './time-table.component.html',
  styleUrls: ['./time-table.component.scss']
})
export class TimeTableComponent implements OnInit {
  courseData:any=[];
  subjectData:any=[];
  masterCoursesData:any=[];
  getTeachersData:any=[];
 
  fetchFieldData = {
    batch_id:"",
    course_id:"",
    master_course:"",
    teacher_id:"",
    institute_id:""
}

  constructor(private timeTableServ: timeTableService) { }

  ngOnInit() {
    this.getMasterCoursesData();
    this.getTeachersNameData();
  }

  /*========================================================================================================
  ========================================================================================================== */
  getMasterCoursesData() {
    this.timeTableServ.getMasterCourses().subscribe
      (
      res => {
         this.masterCoursesData =res;
        console.log(this.masterCoursesData);
      },
      err => {
        console.log(err);
      }
      )
  }

  getCourses(i) {
    this.timeTableServ.getCoursesData(i).subscribe
      (
      res => {
        this.courseData = res.coursesList;
        console.log( this.courseData);
      },
      err => {
        console.log(err);
      }
      )
  }

  getSubjects() {
    this.timeTableServ.getSubjectData(this.fetchFieldData.batch_id).subscribe
      (
      res => {
        this.subjectData = res.batchesList;
        console.log(this.subjectData);
      },
      err => {
        console.log(err);
      }
      )
  }
  
  getTeachersNameData() {
    this.timeTableServ.getTeachersName().subscribe
      (
      res => {
        console.log(res);
      },
      err => {
        console.log(err);
      }
      )
  }


}






