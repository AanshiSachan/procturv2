import { Component, OnInit } from '@angular/core';
import { ColumnSetting } from '../../shared/custom-table/layout.model';
import {ExamService} from '../../../services/report-services/exam.service';
@Component({
  selector: 'app-exam-report',
  templateUrl: './exam-report.component.html',
  styleUrls: ['./exam-report.component.scss']
})
export class ExamReportComponent implements OnInit {

Tdata:boolean= false;
CourseData="";
courseData:any[]=[];
subData="";
Subjectdata="";
SubjectData:any[]=[];
masterCourses:any[]=[];
masterData="";
Exam_sche_Data="";
Exam_Sch_Data:any[]=[];
ExamSource:any[]=[];
projectSettings: ColumnSetting[] = [

{primaryKey:'student_id',header:'Student Name'},
{primaryKey:'student_name',header:'Student Id'},
{primaryKey:'total_marks',header:'Total Marks'},
{primaryKey:'marks_obtained',header: 'Marks Obtained'},
{primaryKey:'student_phone',header:'Contact No.'},
{primaryKey:'rank',header:'Rank'},
{primaryKey:'doj',header:'Joining Date'}
]







  constructor(private examdata :ExamService) {
    this.switchActiveView('exam');
   }

  ngOnInit() {
  this.fetchExamData();
  this.fetchExamReport();
  }
 fetch(){
  this.Tdata=true;
  }

  fetchExamData(){
    this.examdata.ExamReport().subscribe(
      (data:any)=>{
        this.masterCourses=data;
        console.log(this.masterCourses);
      }
    )

  }

  fetchExamReport(){

  }


  
  getCourseData(i){
    
     this.examdata.getCourses(i).subscribe(
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
getSubData(i){
this.examdata.getSubject(i).subscribe((data:any)=>
{
  console.log(data);
  this.SubjectData=data.batchesList;
  console.log(this.SubjectData);
})}

getExamScheduleData(i){
this.examdata.getExamSchedule(i).subscribe((data:any)=>{
  console.log(data);
  this.Exam_Sch_Data=data.otherSchd;
  console.log(this.Exam_Sch_Data);
})
}

  
  switchActiveView(id){
    document.getElementById('exam').classList.remove('active');
  }
}
