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
  getSubjectData: any[] = [];
  batchExamRepo: any[] = [];
  totalRecords: number = 0;
  dateSource: any[] = [];
  dateStore: any[] = [];
  displayBatchSize: number = 10;
  Tdata: boolean = false;
  courseData: any[] = [];
  batchCourseData: any = [];
  

  subjectData: any[] = [];
  masterCourses: any[] = [];

  addReportPopup: boolean = false;
  examTypeEntry: any[] = [];

  exam_Sch_Data: any[] = [];
  examSource: any = [];
  detailSource: any = [];
  pagedExamSource: any[] = [];

  fetchApiData: any = [];
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


  queryParam = {
    standard_id: -1,
    subject_id: -1,
    assigned: "N",
  }


  fetchFieldData = {
    institution_id: parseInt(sessionStorage.getItem('institute_id')),
    standard_id: '',
    subject_id: '',
    batch_id: '',
    exam_schd_id: ''
  }

  constructor(private examdata: ExamService, private appC: AppComponent) {
    this.switchActiveView('exam');
  }

  ngOnInit() {
    this.isProfessional = sessionStorage.getItem('institute_type') == 'LANG';
    this.fetchExamData();
    this.pageIndex = 1;
  }

  closeReportPopup() {
    this.addReportPopup = false;
  }

/* select exam repo fill master courses==================================================================================
================================================================================== */
  fetchExamData() {
    if (this.isProfessional) {
      this.examdata.batchExamReport(this.queryParam).subscribe((res) => {
        {
          this.batchExamRepo = res.standardLi;
          this.getSubjectData = res.batchLi;
        }
      })
    }
    else {
      this.examdata.ExamReport().subscribe(
        (data: any) => {
          this.masterCourses = data;
          console.log(this.masterCourses);
        }
      )
    }
  }
  /*======================================================================================================
======================================================================================================== */
 
  getCourseData(i) {

    if (this.isProfessional) {

      this.fetchFieldData.exam_schd_id = "";

      this.fetchFieldData.subject_id = "";

      this.examdata.batchExamReport(this.queryParam).subscribe(
        (res) => {
          console.log(res.subjectLi);

          this.batchCourseData = res.subjectLi;
          /*update*/
          this.getSubjectData = res.batchLi;
        
          if (this.batchCourseData == null) {
            let obj = {
              type: "info",
              title: "There is no Record in this  Field",
              Body: "Don't go in next field"
            }
            this.appC.popToast(obj);
          }


        })
    }

    else {

      this.fetchFieldData.exam_schd_id = "";
      this.fetchFieldData.batch_id = "";
      this.fetchFieldData.subject_id = "";

      this.examdata.getCourses(i).subscribe(
        (data: any) => {
          console.log(data);
          this.courseData = data.coursesList;
          console.log(this.courseData);
          if(this.courseData==null){
            let obj = {
              type: "info",
              title: "There is no Record in this  Field",
              Body: "Don't go in next field"
            } 
            this.appC.popToast(obj);
          }
           },
        (error: any) => {

          let obj = {
            type: "error",
            title: "Unable to Fetch Report",
            body: ""

          }
        }
      )
    }
  }
  /*==================================================================================================
  ===================================================================================================== */
  getSubData(i) {

    console.log(i);

    if (this.isProfessional) {
      this.fetchFieldData.exam_schd_id = "";

      this.examdata.batchExamReport(this.queryParam).subscribe(
        (res) => {
          console.log(res);
          this.getSubjectData = res.batchLi;

          console.log(this.getSubjectData);
        
          if (this.getSubjectData==null) {
            let obj = {
              type: "info",
              title: "There is no Record in this Field",
              Body: "Don't go in next field"
            }
            this.appC.popToast(obj);
          }
         })
    }
    else {
      this.fetchFieldData.exam_schd_id = "";
      this.fetchFieldData.batch_id = "";
      this.examdata.getSubject(i).subscribe((data: any) => {
        console.log(data);
        this.subjectData = data.batchesList;
        console.log(this.subjectData);
        if(this.subjectData==null){
          let obj = {
            type: "info",
            title: "There is no Record in this  Field",
            Body: "Don't go in next field"
          }
          this.appC.popToast(obj);
        }
      })
    } }

 

/*=======================================================================================
========================================================================================== */
  getExamScheduleData(i) {

    this.fetchFieldData.exam_schd_id = "";
    console.log(i);
    this.examdata.getExamSchedule(i).subscribe((data: any) => {
      console.log(data);
       this.exam_Sch_Data = data.otherSchd;
        console.log(this.exam_Sch_Data);
        if(this.exam_Sch_Data==null){
          let obj = {
            type: "info",
            title: "There is no Record in this  Field",
            Body: "Don't go in next field"
          }
          this.appC.popToast(obj);
        }
        })
  }
    /*view btn*/
  fetchExamReport() {

    console.log(this.fetchFieldData);
    if (this.isProfessional) {
      if (this.queryParam.standard_id == -1 || this.queryParam.subject_id == -1 || this.fetchFieldData.batch_id == "" || this.fetchFieldData
        .exam_schd_id == "") {

        let msg = {
          type: "error",
          title: "Invalid Data Range Selected",
          Body: "All field must be filled"
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
            this.examSource = res;
            this.Tdata = true;
            this.totalRecords = this.examSource.length;
            this.fetchTableDataByPage(this.pageIndex);
            console.log(res);
          },
          err => {
            console.log(err);
          }
        );
      }
    }
    else {
      if (this.fetchFieldData.subject_id == "" || this.fetchFieldData.standard_id == "" || this.fetchFieldData.batch_id == "" ||
        this.fetchFieldData.exam_schd_id == "") {

        let msg = {
          type: "error",
          title: "Invalid Data Range Selected",
          Body: "All fields must be filled"
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
            this.examSource = res;
            this.Tdata = true;
            this.totalRecords = this.examSource.length;
            this.fetchTableDataByPage(this.pageIndex);
            console.log(res);
          },
          err => {
            console.log(err);
          }
        );
      }
    }
  }

  /*detailbtn*/
  fetchDetailReport() {
    if (this.isProfessional) {

      if (this.queryParam.standard_id == -1 || this.queryParam.subject_id == -1 || this.fetchFieldData.batch_id == ""
        || this.fetchFieldData.exam_schd_id == "") {



        let msg = {
          type: "error",
          title: "Invalid Data Range Selected",
          Body: "All field must be filled"
        }
        this.appC.popToast(msg);
      }
      else {
        this.examdata.viewDetailData(this.fetchFieldData.batch_id)
          .subscribe(
            res => {
              this.detailSource = res;
              this.dateSource = this.detailSource.map((store) => {
                this.dateStore = store.detailExamReportList;
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
    }
    else {
      if (this.fetchFieldData.standard_id == "" || this.fetchFieldData.subject_id == "" || this.fetchFieldData.batch_id == "" ||
        this.fetchFieldData.exam_schd_id == "") {
        let msg = {
          type: "error",
          title: "Invalid Data Range Selected",
          Body: "All Field must be filled"
        }
        this.appC.popToast(msg);
      }
      else {
        this.examdata.viewDetailData(this.fetchFieldData.batch_id)
          .subscribe(
            res => {
              this.detailSource = res;
              this.dateSource = this.detailSource.map((store) => {
                this.dateStore = store.detailExamReportList;
              });

              console.log(this.detailSource);
              console.log(res);
              this.fetchTableDataByPage(this.pageIndex);
              this.addReportPopup = true;
            },
            err => {
              console.log(err);
            }
          )
      }
    }

  }



/*=========================================================================================
========================================================================================== */
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

  closeExamReport() {
    this.addReportPopup = false;

  }

  switchActiveView(id) {

    document.getElementById('home').classList.remove('active');
    document.getElementById('attendance').classList.remove('active');
    document.getElementById('sms').classList.remove('active');
    document.getElementById('fee').classList.remove('active');
    document.getElementById('exam').classList.remove('active');
    document.getElementById('report').classList.remove('active');
    document.getElementById('time').classList.remove('active');
    document.getElementById('email').classList.remove('active');
    document.getElementById('profit').classList.remove('active');
    switch (id) {
      case 'home': { document.getElementById('home').classList.add('active'); break; }
      case 'attendance': { document.getElementById('attendance').classList.add('active'); break; }
      case 'sms': { document.getElementById('sms').classList.add('active'); break; }
      case 'fee': { document.getElementById('fee').classList.add('active'); break; }
      case 'exam': { document.getElementById('exam').classList.add('active'); break; }
      case 'report': { document.getElementById('report').classList.add('active'); break; }
      case 'time': { document.getElementById('time').classList.add('active'); break; }
      case 'email': { document.getElementById('email').classList.add('active'); break; }
      case 'profit': { document.getElementById('profit').classList.add('active'); break; }
    }
  }

}
