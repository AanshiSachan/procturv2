import { Component, OnInit } from '@angular/core';
import { ColumnSetting } from '../../shared/custom-table/layout.model';
import { ExamService } from '../../../services/report-services/exam.service';
import { AppComponent } from '../../../app.component';
import { FilterPipe } from './filter.pipe';
import { lang } from 'moment';
@Component({
  selector: 'app-exam-report',
  templateUrl: './exam-report.component.html',
  styleUrls: ['./exam-report.component.scss']
})
export class ExamReportComponent implements OnInit {
  isProfessional: boolean = true;
  pageIndex: number = 1;
  getSubjectData:any[]=[];
  batchExamRepo:any[]=[];
  totalRecords: number = 0;
  dateSource :any[]=[];
  dateStore :any[]=[];
  displayBatchSize: number = 10;
  Tdata: boolean = false;
  courseData: any[] = [];
  batchCourseData:any=[];
  subData = "";
  SubjectData: any[] = [];
  masterCourses: any[] = [];
  masterData = "";
  addReportPopup: boolean = false;
  examTypeEntry: any[] = [];
  Exam_sche_Data = "";
  Exam_Sch_Data: any[] = [];
  ExamSource: any = [];
  detailSource: any = [];
  pagedExamSource: any[] = [];
  studentName = "";
  FetchApiData: any = [];
  dataExamIndex: any[] = [];
  typeDataForm: any[] = [];


  projectSettings: ColumnSetting[] = [

    { primaryKey: 'student_id', header: 'Student Id' },
    { primaryKey: 'student_name', header: 'Student Name' },
    { primaryKey: 'total_marks', header: 'Total Marks' },
    { primaryKey: 'marks_obtained', header: 'Marks Obtained' },
    { primaryKey: 'student_phone', header: 'Contact No.' },
    { primaryKey: 'rank', header: 'Rank' },
    { primaryKey: 'doj', header: 'Joining Date' }
  ];

  constructor(private examdata: ExamService, private appC: AppComponent) {
    this.switchActiveView('exam');
  }

  queryParam={

standard_id:-1,
subject_id:-1,
assigned :"N",

  }
  fetchFieldData = {
    institution_id: parseInt(sessionStorage.getItem('institute_id')),
    standard_id: '',
    subject_id: '',
    batch_id: '',
    exam_schd_id: ''
  }

  ngOnInit() {
    this.isProfessional = sessionStorage.getItem('institute_type') == 'LANG';

    this.fetchExamData();
    this.pageIndex = 1;
  }
  closeReportPopup() {

    this.addReportPopup = false;
  };
/*1111*/
  fetchExamData() {
  if(this.isProfessional){
    this.examdata.batchExamReport(this.queryParam).subscribe((res)=>
  {  
    this.batchExamRepo=res;

    console.log(res);
  })
    }
  else{
    this.examdata.ExamReport().subscribe(
      (data: any) => {
        this.masterCourses = data;
        console.log(this.masterCourses);
      }
    )
}};



/*view btn*/
  fetchExamReport() {

    console.log(this.fetchFieldData);

    if (this.fetchFieldData.subject_id == "" || this.fetchFieldData.standard_id == "" || this.fetchFieldData.batch_id == "" ||
    this.fetchFieldData.exam_schd_id == "") {

      let msg = {
        type: "error",
        title: "Invalid Date Range Selected",
        Body: "From date cannot be greater than To date"
      }
      this.appC.popToast(msg);
    }
    else {
      let o = {
        batch_id: this.fetchFieldData.batch_id,
        exam_schd_id: this.fetchFieldData.exam_schd_id,
        institution_id: this.fetchFieldData.institution_id,
        standard_id: '',
        subject_id: ''
      }
      this.examdata.viewExamData(o).subscribe(
        res => {
          this.ExamSource = res;
          this.Tdata = true;
          this.totalRecords = this.ExamSource.length;
          this.fetchTableDataByPage(this.pageIndex);
          console.log(res);
        },
        err => {
          console.log(err);
        }
      );
    }
  }
/*detailbtn*/
  fetchDetailReport() {
    this.addReportPopup= true;
    if (this.fetchFieldData.standard_id == "" || this.fetchFieldData.subject_id == "" || this.fetchFieldData.batch_id == "" ||
      this.fetchFieldData.exam_schd_id == "") {
      let msg = {
        type: "error",
        title: "Invalid Date Range Selected",
        Body: "From date cannot be greater than To date"
      }
      this.appC.popToast(msg);
    }
    else {
     this.examdata.viewDetailData(this.fetchFieldData.batch_id)
        .subscribe(
          res => {
            this.detailSource = res;
            this.dateSource=this.detailSource.map((store)=>{
            this.dateStore=store.detailExamReportList; 
            });

            console.log(this.detailSource);
            console.log(res);
            this.addReportPopup = true;
          },
          err => {
            console.log(err);
          }
        )
    }
  };


  getCourseData(i) {
     
    if(this.isProfessional){

      this.examdata.batchExamReport(this.queryParam).subscribe((res)=>
      {
        console.log(res);
        this.getSubjectData=res;
        console.log(this.SubjectData);
      }

      )
   this.examdata.batchExamReport(this.queryParam).subscribe(
     (res)=>
    
   {
     console.log(res);
    this.batchCourseData=res;

  console.log(this.batchCourseData);
   })
  }
  

else{

    this.fetchFieldData.exam_schd_id = "";
    this.fetchFieldData.batch_id = "";
    this.fetchFieldData.subject_id = "";

    this.examdata.getCourses(i).subscribe(
      (data: any) => {
        console.log(data);
        this.courseData = data.coursesList;
        console.log(this.courseData);
      },
      (error: any) => {
        return error;
      }
    )
  }
  }
  getSubData(i) {
    console.log(i);
    this.fetchFieldData.exam_schd_id = "";
    this.fetchFieldData.batch_id = "";
    this.examdata.getSubject(i).subscribe((data: any) => {
      console.log(data);
      this.SubjectData = data.batchesList;
      console.log(this.SubjectData);
    })
  }

  getExamScheduleData(i) {
    console.log(this.SubjectData);
           
    this.fetchFieldData.exam_schd_id = "";
    console.log(i);
    this.examdata.getExamSchedule(i).subscribe((data: any) => {
      console.log(data);
      this.Exam_Sch_Data = data.otherSchd;
      console.log(this.Exam_Sch_Data);
    })
  }


  fetchTableDataByPage(index) {
    this.pageIndex = index;
    let startindex = this.displayBatchSize * (index - 1);
    this.pagedExamSource = this.getDataFromDataSource(startindex);
  }

  fetchNext() {
    this.pageIndex++;
    this.fetchTableDataByPage(this.pageIndex);
  }

  fetchPrevious() {
    if (this.pageIndex != 1) {
      this.pageIndex--;
      this.fetchTableDataByPage(this.pageIndex);
    }
  }

  getDataFromDataSource(startindex) {
    let t = this.ExamSource.slice(startindex, startindex + this.displayBatchSize);
    return t;
  }


  switchActiveView(id) {
    document.getElementById('email').classList.remove('active');
  }

}
