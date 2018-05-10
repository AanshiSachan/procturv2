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
