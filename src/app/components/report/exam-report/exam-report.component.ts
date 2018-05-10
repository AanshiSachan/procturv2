import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../services/login-services/login.service';
import { ColumnSetting } from '../../shared/custom-table/layout.model';
import { ExamService } from '../../../services/report-services/exam.service';
import { AppComponent } from '../../../app.component';
import { FilterPipe } from './filter.pipe';
@Component({
  selector: 'app-exam-report',
  templateUrl: './exam-report.component.html',
  styleUrls: ['./exam-report.component.scss']
})
export class ExamReportComponent implements OnInit {

  pageIndex: number = 1;
  totalRecords: number = 0;
  displayBatchSize: number = 10;
  Tdata: boolean = false;
  courseData: any[] = [];
  subjectData: any[] = [];
  masterCourses: any[] = [];
  masterData = "";
  addReportPopup: boolean = false;
  exam_Sch_Data: any[] = [];
  examSource: any = [];
  DetailSource: any = [];
  pagedExamSource: any[] = [];
  pagedDetailedExamSource:any[]=[];
  isRippleLoad:boolean = false;
  projectSettings: ColumnSetting[] = [
    { primaryKey: 'student_id', header: 'Student Id' },
    { primaryKey: 'student_name', header: 'Student Name' },
    { primaryKey: 'total_marks', header: 'Total Marks' },
    { primaryKey: 'marks_obtained', header: 'Marks Obtained' },
    { primaryKey: 'student_phone', header: 'Contact No.' },
    { primaryKey: 'rank', header: 'Rank' },
    { primaryKey: 'doj', header: 'Joining Date' }
  ]

  constructor(private examdata: ExamService, private appC: AppComponent,private login: LoginService,
  ) {
    this.switchActiveView('exam');
  }

  fetchFieldData = {
    institution_id: parseInt(sessionStorage.getItem('institute_id')),
    standard_id: '',
    subject_id: '',
    batch_id: '',
    exam_schd_id: ''
  }
  ngOnInit() {
    this.fetchExamData();
    this.pageIndex = 1;
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));
    
  }
  /*==============================================================================
  ======================================================================================= */
  closeReportPopup() {

    this.addReportPopup = false;
  }
  /*========================================================================================
  ========================================================================================== */
  fetchExamData() {
this.isRippleLoad = true;
    this.examdata.ExamReport().subscribe(
      (data: any) => {
        this.isRippleLoad = false
        this.masterCourses = data;
      }
    )
  }
  /*=============================================================================================
  ============================================================================================== */
  fetchExamReport() {
    this.isRippleLoad = true;
    if (this.fetchFieldData.subject_id == "" || this.fetchFieldData.standard_id == "" || this.fetchFieldData.batch_id == "" ||
      this.fetchFieldData.exam_schd_id == "") {

      let msg = {
        type: "error",
        title: "Invalid Date Range Selected",
        Body: "From date cannot be greater than To date"
      }
      this.appC.popToast(msg);
      this.isRippleLoad = false
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
        
        (res:any) => {
          if(res.length){
            this.examSource = res;
            this.Tdata = true;
            this.totalRecords = this.examSource.length;
            this.fetchTableDataByPage(this.pageIndex);
            this.isRippleLoad = false;
  
          }
          else{
            let msg = {
              type: "info",
              title: "No Data Found",
              body: "We did not find any data in this range "
            }
            this.appC.popToast(msg);
            this.isRippleLoad = false;
          }
        },
        err => {
          this.isRippleLoad = false
        }
      );
    }
  }
  /*=============================================================================
  =========================================================================================== */

  fetchDetailReport() {
    this.isRippleLoad = true;
    this.examdata.viewDetailData(this.fetchFieldData.batch_id)
      .subscribe(
        (res:any) => {
          console.log(res);
          if(res.length){
            this.DetailSource = res;

            this.addReportPopup = true;
            this.pageIndex = 1;
            this.totalRecords = this.DetailSource.length;
            this.fetchTableDataByPagePopup(this.pageIndex);
            this.isRippleLoad = false
          }
         else{
          let msg = {
            type: "info",
            title: "No Data Found",
            body: "We did not find any data in this range "
          }
          this.appC.popToast(msg);
          this.isRippleLoad = false
         }

        },
        err => {
          this.isRippleLoad = false
        })
  };
  /*====================================================================================
  ======================================================================================= */
  getCourseData(i) {
    this.isRippleLoad = true;
    this.fetchFieldData.exam_schd_id = "";
    this.fetchFieldData.batch_id = "";
    this.fetchFieldData.subject_id = "";

    this.examdata.getCourses(i).subscribe(
      (data: any) => {

        this.courseData = data.coursesList;
        this.isRippleLoad = false
      },
      (error: any) => {
        this.isRippleLoad = false
        return error;
      }
    )
  }
  /*====================================================================================
  ======================================================================================= */
  getSubData(i) {
    this.isRippleLoad = true;
    this.fetchFieldData.exam_schd_id = "";
    this.fetchFieldData.batch_id = "";
    this.examdata.getSubject(i).subscribe((data: any) => {
      this.subjectData = data.batchesList;
      this.isRippleLoad = false
    })
  }
  /*=====================================================================================
  ======================================================================================== */
  getExamScheduleData(i) {
    this.isRippleLoad = true;
    this.fetchFieldData.exam_schd_id = "";
    this.examdata.getExamSchedule(i).subscribe((data: any) => {
      this.exam_Sch_Data = data.otherSchd;
      this.isRippleLoad = false;
    })
  }
  /*==============================pagination ===========================================
  =========================================================================================*/

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
   
    let t = this.examSource.slice(startindex, startindex + this.displayBatchSize);
    return t;
    
   
  }
  getDataFromDataSourcePopup(startindex) {
   
    let t = this.DetailSource.slice(startindex, startindex + this.displayBatchSize);
    return t;
    
   
  }
  fetchTableDataByPagePopup(index) {
    this.pageIndex = index;
    let startindex = this.displayBatchSize * (index - 1);
    this.pagedDetailedExamSource = this.getDataFromDataSourcePopup(startindex);
    console.log(this.pagedDetailedExamSource);
  }
  fetchNextPopup() {
    this.pageIndex++;
    this.fetchTableDataByPagePopup(this.pageIndex);
  }
  fetchPreviousPopup() {
    if (this.pageIndex != 1) {
      this.pageIndex--;
      this.fetchTableDataByPagePopup(this.pageIndex);
    }
  }

  switchActiveView(id) {
    document.getElementById('email').classList.remove('active');
  }
}
// import { Component, OnInit } from '@angular/core';
// import { ColumnSetting } from '../../shared/custom-table/layout.model';
// import { ExamService } from '../../../services/report-services/exam.service';
// import { AppComponent } from '../../../app.component';
// import { FilterPipe } from './filter.pipe';
// import { lang } from 'moment';
// @Component({
//   selector: 'app-exam-report',
//   templateUrl: './exam-report.component.html',
//   styleUrls: ['./exam-report.component.scss']
// })
// export class ExamReportComponent implements OnInit {
//   isProfessional: boolean = true;
//   pageIndex: number = 1;
//   getSubjectData:any[]=[];
//   batchExamRepo:any[]=[];
//   totalRecords: number = 0;
//   dateSource :any[]=[];
//   dateStore :any[]=[];
//   displayBatchSize: number = 10;
//   Tdata: boolean = false;
//   courseData: any[] = [];
//   batchCourseData:any=[];
//   subData = "";
//   SubjectData: any[] = [];
//   masterCourses: any[] = [];
//   masterData = "";
//   addReportPopup: boolean = false;
//   examTypeEntry: any[] = [];
//   Exam_sche_Data = "";
//   Exam_Sch_Data: any[] = [];
//   ExamSource: any = [];
//   detailSource: any = [];
//   pagedExamSource: any[] = [];
//   studentName = "";
//   FetchApiData: any = [];
//   dataExamIndex: any[] = [];
//   typeDataForm: any[] = [];


//   projectSettings: ColumnSetting[] = [

//     { primaryKey: 'student_id', header: 'Student Id' },
//     { primaryKey: 'student_name', header: 'Student Name' },
//     { primaryKey: 'total_marks', header: 'Total Marks' },
//     { primaryKey: 'marks_obtained', header: 'Marks Obtained' },
//     { primaryKey: 'student_phone', header: 'Contact No.' },
//     { primaryKey: 'rank', header: 'Rank' },
//     { primaryKey: 'doj', header: 'Joining Date' }
//   ];

//   constructor(private examdata: ExamService, private appC: AppComponent) {
//     this.switchActiveView('exam');
//   }

//   queryParam={

// standard_id:-1,
// subject_id:-1,
// assigned :"N",

//   }
//   fetchFieldData = {
//     institution_id: parseInt(sessionStorage.getItem('institute_id')),
//     standard_id: '',
//     subject_id: '',
//     batch_id: '',
//     exam_schd_id: ''
//   }

//   ngOnInit() {
//     this.isProfessional = sessionStorage.getItem('institute_type') == 'LANG';

//     this.fetchExamData();
//     this.pageIndex = 1;
//   }
//   closeReportPopup() {

//     this.addReportPopup = false;
//   };
// /*1111*/
//   fetchExamData() {
//   if(this.isProfessional){
//     this.examdata.batchExamReport(this.queryParam).subscribe((res)=>
//   {  
//     this.batchExamRepo=res;

//     console.log(res);
//   })
//     }
//   else{
//     this.examdata.ExamReport().subscribe(
//       (data: any) => {
//         this.masterCourses = data;
//         console.log(this.masterCourses);
//       }
//     )
// }};



// /*view btn*/
//   fetchExamReport() {

//     console.log(this.fetchFieldData);

//     if (this.fetchFieldData.subject_id == "" || this.fetchFieldData.standard_id == "" || this.fetchFieldData.batch_id == "" ||
//     this.fetchFieldData.exam_schd_id == "") {

//       let msg = {
//         type: "error",
//         title: "Invalid Date Range Selected",
//         Body: "From date cannot be greater than To date"
//       }
//       this.appC.popToast(msg);
//     }
//     else {
//       let o = {
//         batch_id: this.fetchFieldData.batch_id,
//         exam_schd_id: this.fetchFieldData.exam_schd_id,
//         institution_id: this.fetchFieldData.institution_id,
//         standard_id: '',
//         subject_id: ''
//       }
//       this.examdata.viewExamData(o).subscribe(
//         res => {
//           this.ExamSource = res;
//           this.Tdata = true;
//           this.totalRecords = this.ExamSource.length;
//           this.fetchTableDataByPage(this.pageIndex);
//           console.log(res);
//         },
//         err => {
//           console.log(err);
//         }
//       );
//     }
//   }
// /*detailbtn*/
//   fetchDetailReport() {
//     this.addReportPopup= true;
//     if (this.fetchFieldData.standard_id == "" || this.fetchFieldData.subject_id == "" || this.fetchFieldData.batch_id == "" ||
//       this.fetchFieldData.exam_schd_id == "") {
//       let msg = {
//         type: "error",
//         title: "Invalid Date Range Selected",
//         Body: "From date cannot be greater than To date"
//       }
//       this.appC.popToast(msg);
//     }
//     else {
//      this.examdata.viewDetailData(this.fetchFieldData.batch_id)
//         .subscribe(
//           res => {
//             this.detailSource = res;
//             this.dateSource=this.detailSource.map((store)=>{
//             this.dateStore=store.detailExamReportList; 
//             });

//             console.log(this.detailSource);
//             console.log(res);
//             this.addReportPopup = true;
//           },
//           err => {
//             console.log(err);
//           }
//         )
//     }
//   };


//   getCourseData(i) {
     
//     if(this.isProfessional){

//       this.examdata.batchExamReport(this.queryParam).subscribe((res)=>
//       {
//         console.log(res);
//         this.getSubjectData=res;
//         console.log(this.SubjectData);
//       }

//       )
  
//    }
  


// else{

//     this.fetchFieldData.exam_schd_id = "";
//     this.fetchFieldData.batch_id = "";
//     this.fetchFieldData.subject_id = "";

//     this.examdata.getCourses(i).subscribe(
//       (data: any) => {
//         console.log(data);
//         this.courseData = data.coursesList;
//         console.log(this.courseData);
//       },
//       (error: any) => {
//         return error;
//       }
//     )
//   }
//   }
//   getSubData(i) {
//     console.log(i);
//     this.fetchFieldData.exam_schd_id = "";
//     this.fetchFieldData.batch_id = "";
//     this.examdata.getSubject(i).subscribe((data: any) => {
//       console.log(data);
//       this.SubjectData = data.batchesList;
//       console.log(this.SubjectData);
//     })
//   }

//   getExamScheduleData(i) {
//     console.log(this.SubjectData);
           
//     this.fetchFieldData.exam_schd_id = "";
//     console.log(i);
//     this.examdata.getExamSchedule(i).subscribe((data: any) => {
//       console.log(data);
//       this.Exam_Sch_Data = data.otherSchd;
//       console.log(this.Exam_Sch_Data);
//     })
//   }


//   fetchTableDataByPage(index) {
//     this.pageIndex = index;
//     let startindex = this.displayBatchSize * (index - 1);
//     this.pagedExamSource = this.getDataFromDataSource(startindex);
//   }

//   fetchNext() {
//     this.pageIndex++;
//     this.fetchTableDataByPage(this.pageIndex);
//   }

//   fetchPrevious() {
//     if (this.pageIndex != 1) {
//       this.pageIndex--;
//       this.fetchTableDataByPage(this.pageIndex);
//     }
//   }

//   getDataFromDataSource(startindex) {
//     let t = this.ExamSource.slice(startindex, startindex + this.displayBatchSize);
//     return t;
//   }


//   switchActiveView(id) {
//     document.getElementById('email').classList.remove('active');
//   }

// }
