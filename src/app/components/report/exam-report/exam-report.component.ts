import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ColumnSetting } from '../../shared/custom-table/layout.model';
import { ExamService } from '../../../services/report-services/exam.service';
import { AppComponent } from '../../../app.component';
import { AuthenticatorService } from '../../../services/authenticator.service';


@Component({
  selector: 'app-exam-report',
  templateUrl: './exam-report.component.html',
  styleUrls: ['./exam-report.component.scss'],

})
export class ExamReportComponent implements OnInit {
  isProfessional: boolean = true;
  pageIndex: number = 1;
  isExamGrade: string;
  getSubjectData: any[] = [];
  batchExamRepo: any[] = [];
  totalRecords: number = 0;
  dateSource: any[] = [];
  dateStore: any[] = [];
  displayBatchSize: number = 10;
  Tdata: boolean = false;
  courseData: any[] = [];
  pagedDetailExamSource: any[] = [];
  batchCourseData: any = [];
  isRippleLoad: boolean = false;

  subjectData: any[] = [];
  masterCourses: any[] = [];

  addReportPopup: boolean = false;
  examTypeEntry: any[] = [];
  showTitle: boolean = false;
  exam_Sch_Data: any[] = [];
  examSource: any = [];
  detailSource: any = [];
  pagedExamSource: any[] = [];
  pageIndexPopup: number = 1;
  fetchApiData: any = [];
  dataExamIndex: any[] = [];
  typeDataForm: any[] = [];
  @ViewChild('examTable') examTable: ElementRef;
  @ViewChild('xlsDownloader') xlsDownloader: ElementRef;

  projectSettings: ColumnSetting[] = [

    { primaryKey: 'student_disp_id', header: 'Student ID' },
    { primaryKey: 'student_name', header: 'Student Name' },
    { primaryKey: 'student_phone', header: 'Contact No.' },
    { primaryKey: 'doj', header: 'Joining Date' },
    { primaryKey: 'grade', header: 'Grade' }
  ];
  HighestMarks: string = "";
  LowestMarks: string = "";
  AverageMarks: string = "";

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
  searchText: string = "";
  searchflag: boolean = false;
  searchData: any = [];

  property = "";
  direction = 0;
  sortingEnabled: boolean = true;
  constructor(
    private examdata: ExamService,
    private appC: AppComponent,
    private auth: AuthenticatorService
  ) {
    this.switchActiveView('exam');
  }

  professionalChecker() {
    this.auth.institute_type.subscribe(
      res => {
        if (res == "LANG") {
          this.isProfessional = true;
        } else {
          this.isProfessional = false;
        }
      }
    )
  }

  ngOnInit() {
    this.isExamGrade = sessionStorage.getItem('is_exam_grad_feature');
    this.professionalChecker();
    if (this.isProfessional) {
      this.showTitle = true
      this.projectSettings = [
        { primaryKey: 'student_disp_id', header: 'Student ID' },
        { primaryKey: 'student_name', header: 'Student Name' },
        { primaryKey: 'student_phone', header: 'Contact No.' },
        { primaryKey: 'doj', header: 'Joining Date' },
        { primaryKey: 'grade', header: 'Grade' }
      ];

    }

    else {
      this.showTitle = false;
      this.projectSettings = [
        { primaryKey: 'student_disp_id', header: 'Student Id' },
        { primaryKey: 'student_name', header: 'Student Name' },
        { primaryKey: 'student_phone', header: 'Contact No.' },
        { primaryKey: 'doj', header: 'Joining Date' },
        { primaryKey: 'total_marks', header: 'Total Marks' },
        { primaryKey: 'marks_obtained', header: 'Marks Obtained' },
        { primaryKey: 'rank', header: 'Rank' },
      ];

    }
    this.fetchExamData();
    this.pageIndex = 1;
  }

  closeReportPopup() {
    this.addReportPopup = false;
  }


  /* select exam repo fill master courses==================================================================================
  ================================================================================== */
  fetchExamData() {
    this.isRippleLoad = true;
    if (this.isProfessional) {
      this.isRippleLoad = false;
      this.batchExamRepo = [];
      this.subjectData = [];
      this.queryParam.subject_id = -1;
      this.queryParam.standard_id = -1;
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
          this.isRippleLoad = false;
          this.masterCourses = data;
          console.log(this.masterCourses);
        }
      )
    }
  }
  /*======================================================================================================
======================================================================================================== */

  getCourseData(i) {


    this.isRippleLoad = true;
    if (this.isProfessional) {

      this.batchCourseData = [];

      this.fetchFieldData.exam_schd_id = "";

      this.queryParam.subject_id = -1;

      this.examdata.batchExamReport(this.queryParam).subscribe(
        (res) => {
          this.isRippleLoad = false;
          console.log(res.subjectLi);

          this.batchCourseData = res.subjectLi;

          this.getSubjectData = res.batchLi;

          if (this.batchCourseData == null) {
            let obj = {
              type: "info",
              title: "No Exam Schedule Found",
              body: ""
            }
            this.appC.popToast(obj);
            this.isRippleLoad = false;
          }


        })
    }

    else {

      this.fetchFieldData.exam_schd_id = "";
      this.fetchFieldData.batch_id = "";
      this.fetchFieldData.subject_id = "";

      this.examdata.getCourses(i).subscribe(
        (data: any) => {
          this.isRippleLoad = false;
          this.courseData = data.coursesList;

          if (this.courseData == null) {
            let obj = {
              type: "info",
              title: "No Exam Schedule Found",
              body: ""
            }
            this.appC.popToast(obj);
            this.isRippleLoad = false;
          }
        },
        (error: any) => {

          this.isRippleLoad = false;

          let obj = {
            type: "error",
            title: "Unable to Fetch Report",
            body: "Please check your internet connection and if the issue persist contact support@proctur.com"
          }
          this.appC.popToast(obj);
        }
      )
    }
  }
  /*==================================================================================================
  ===================================================================================================== */
  getSubData(i) {
    this.isRippleLoad = true;
    console.log(i);

    if (this.isProfessional) {
      this.fetchFieldData.exam_schd_id = "";

      this.examdata.batchExamReport(this.queryParam).subscribe(
        (res) => {

          this.isRippleLoad = false;
          this.getSubjectData = res.batchLi;
          if (this.getSubjectData == null) {
            let obj = {
              type: "info",
              title: "No Exam Schedule Found",
              body: ""
            }
            this.appC.popToast(obj);

            this.isRippleLoad = false;

          }
        })
    }
    else {
      this.fetchFieldData.exam_schd_id = "";
      this.fetchFieldData.batch_id = "";
      this.examdata.getSubject(i).subscribe((data: any) => {

        this.subjectData = data.batchesList;
        this.isRippleLoad = false;
        if (this.subjectData == null) {
          let obj = {
            type: "info",
            title: "No Exam Schedule Found",
            body: ""
          }
          this.appC.popToast(obj);
          this.isRippleLoad = false;
        }
      })
    }
  }

  /*=======================================================================================
  ========================================================================================== */
  getExamScheduleData(i) {
    console.log(i);
    this.isRippleLoad = true;
    this.fetchFieldData.exam_schd_id = "";
    console.log(i);
    this.examdata.getExamSchedule(i).subscribe((data: any) => {
      this.isRippleLoad = false;
      this.exam_Sch_Data = data.otherSchd;

      if (this.exam_Sch_Data == null) {
        let obj = {
          type: "info",
          title: "No Exam Schedule Found",
          body: ""
        }
        this.appC.popToast(obj);
        this.isRippleLoad = false;
      }
    })
  }
  getData(i) {
    console.log(i);
  }
  fetchExamReport() {

    this.isRippleLoad = true;
    this.examSource = [];
    if (this.isProfessional) {
      if (this.fetchFieldData.batch_id == "" || this.fetchFieldData.exam_schd_id == "") {

        let msg = {
          type: "error",
          title: "Invalid Data Range Selected",
          body: "All field must be filled"
        }
        this.appC.popToast(msg);
        this.isRippleLoad = false;

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
          (res: any) => {
            if (res.length) {
              this.examSource = res;

              this.Tdata = true;

              this.HighestMarks = this.examSource[0].highest_marks;
              this.LowestMarks = this.examSource[0].lowest_marks;
              this.AverageMarks = this.examSource[0].average_marks;
              this.totalRecords = this.examSource.length;
              this.fetchTableDataByPage(this.pageIndex);
              this.isRippleLoad = false;
              if (this.isExamGrade == "0") {
                this.projectSettings = [
                  { primaryKey: 'student_disp_id', header: 'Student Id' },
                  { primaryKey: 'student_name', header: 'Student Name' },
                  { primaryKey: 'student_phone', header: 'Contact No.' },
                  { primaryKey: 'doj', header: 'Joining Date' },
                  { primaryKey: 'total_marks', header: 'Total Marks' },
                  { primaryKey: 'student_marks_obtained', header: 'Marks Obtained' },
                  { primaryKey: 'student_rank', header: 'Rank' },
                ];
              }
              else {
                this.projectSettings =
                  [{ primaryKey: 'student_disp_id', header: 'Student Id' },
                  { primaryKey: 'student_name', header: 'Student Name' },
                  { primaryKey: 'student_phone', header: 'Contact No.' },
                  { primaryKey: 'doj', header: 'Joining Date' },
                  { primaryKey: 'grade', header: 'Grade' },
                  ];
              }

            }
            else {
              let msg = {
                type: "info",
                body: "No Data Found"
              }
              this.examSource = [];


              this.totalRecords = this.examSource.length;
              this.fetchTableDataByPage(this.pageIndex);
              this.appC.popToast(msg);
              this.isRippleLoad = false;
            }
          },
          err => {
            this.isRippleLoad = false;
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
          body: "All fields must be filled"
        }

        this.appC.popToast(msg);
        this.isRippleLoad = false;
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
          (res: any) => {
            if (res.length) {

              this.examSource = res;
              this.Tdata = true;

              this.HighestMarks = this.examSource[0].highest_marks;
              this.LowestMarks = this.examSource[0].lowest_marks;
              this.AverageMarks = this.examSource[0].average_marks;
              this.totalRecords = this.examSource.length;
              this.fetchTableDataByPage(this.pageIndex);
              this.isRippleLoad = false;
              if (this.examSource[0].grade == "" || this.isExamGrade == "0") {
                this.projectSettings = [
                  { primaryKey: 'student_disp_id', header: 'Student Id' },
                  { primaryKey: 'student_name', header: 'Student Name' },
                  { primaryKey: 'student_phone', header: 'Contact No.' },
                  { primaryKey: 'doj', header: 'Joining Date' },
                  { primaryKey: 'total_marks', header: 'Total Marks' },
                  { primaryKey: 'student_marks_obtained', header: 'Marks Obtained' },
                  { primaryKey: 'student_rank', header: 'Rank' },
                ];
              }
              else {
                this.projectSettings =
                  [{ primaryKey: 'student_disp_id', header: 'Student Id' },
                  { primaryKey: 'student_name', header: 'Student Name' },
                  { primaryKey: 'student_phone', header: 'Contact No.' },
                  { primaryKey: 'doj', header: 'Joining Date' },
                  { primaryKey: 'grade', header: 'Grade' },
                  ];
              }
              console.log(res);
            }
            else {
              let msg = {
                type: "info",
                body: "No Data Found"
              }
              this.examSource = [];
              this.totalRecords = this.examSource.length;
              this.fetchTableDataByPage(this.pageIndex);
              this.appC.popToast(msg);
              this.isRippleLoad = false;
            }

          },
          err => {
            this.isRippleLoad = false;
            console.log(err);
          }
        );
      }
    }
  }

  fetchDetailReport() {
    this.isRippleLoad = true;
    if (this.isProfessional) {

      if (this.fetchFieldData.batch_id == "" || this.fetchFieldData.exam_schd_id == "") {
        let msg = {
          type: "error",
          title: "Invalid Data Range Selected",
          body: "All field must be filled"
        }
        this.appC.popToast(msg);
        this.isRippleLoad = false;
      }
      else {
        this.examdata.viewDetailData(this.fetchFieldData.batch_id)
          .subscribe(
            (res: any) => {
              if (res.length) {
                this.detailSource = res;
                this.dateSource = this.detailSource.map((store) => {
                  this.dateStore = store.detailExamReportList;
                  this.isRippleLoad = false;
                  //   this.totalRecords = this.detailSource.length;
                  //  this.fetchTableDataByPagePopup(this.pageIndexPopup);
                });
                this.addReportPopup = true;
              }
              else {
                let msg = {
                  type: "info",
                  title: "No Data Found",
                  body: ""
                }

                this.appC.popToast(msg);
                this.isRippleLoad = false;
              }

            },
            err => {
              this.isRippleLoad = false;
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
          body: "All Field must be filled"
        }
        this.isRippleLoad = false;
        this.appC.popToast(msg);
      }
      else {
        this.examdata.viewDetailData(this.fetchFieldData.batch_id)
          .subscribe(
            (res: any) => {
              if (res.length) {
                this.detailSource = res;
                this.dateSource = this.detailSource.map((store) => {
                  this.dateStore = store.detailExamReportList;
                  this.isRippleLoad = false;
                  // this.totalRecords = this.detailSource.length;
                  //this.fetchTableDataByPagePopup(this.pageIndexPopup);
                });

                this.addReportPopup = true;
              }
              else {
                let msg = {
                  type: "info",
                  title: "No Data Found",
                  body: ""
                }

                this.appC.popToast(msg);
                this.isRippleLoad = false;
              }
            },
            err => {
              this.isRippleLoad = false;
            }
          )
      }
    }
  }

  getColor(status) {
    switch (status) {
      case 'Leave': return 'blue';
      case 'Absent': return 'red';
    }
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
    if (this.searchflag) {
      let t = this.searchData.slice(startindex, startindex + this.displayBatchSize);
      return t;
    } else {
      let t = this.examSource.slice(startindex, startindex + this.displayBatchSize);
      return t;
    }

  }

  fetchTableDataByPagePopup(index) {
    this.pageIndexPopup = index;
    let startindex = this.displayBatchSize * (index - 1);
    this.pagedDetailExamSource = this.getDataFromDataSourcePopup(startindex);
  }

  fetchNextPopup() {
    this.pageIndexPopup++;
    this.fetchTableDataByPagePopup(this.pageIndexPopup);
  }

  fetchPreviousPopup() {
    if (this.pageIndexPopup != 1) {
      this.pageIndexPopup--;
      this.fetchTableDataByPagePopup(this.pageIndexPopup);
    }
  }

  getDataFromDataSourcePopup(startindex) {
    let t = this.detailSource.slice(startindex, startindex + this.displayBatchSize);
    return t;
  }

  closeExamReport() {
    this.addReportPopup = false;

  }

  downloadJsonToCSV() {
    console.log(this.xlsDownloader);
    let link = this.xlsDownloader.nativeElement;
    let outer = this.examTable.nativeElement.outerHTML.replace(/ /g, '%20');
    let data_type = 'data:application/vnd.ms-excel';
    link.setAttribute('href', data_type + ',' + outer);
    link.setAttribute('download', 'ExamReport.xls');
    link.click();
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
  searchDatabase() {
    if (this.searchText != "" && this.searchText != null) {
      this.pageIndex = 1;
      let searchRes: any;
      searchRes = this.examSource.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchText.toLowerCase()))
      );
      this.searchData = searchRes;
      this.totalRecords = searchRes.length;
      this.searchflag = true;
      this.fetchTableDataByPage(this.pageIndex);
    }
    else {
      this.searchflag = false;
      this.fetchTableDataByPage(this.pageIndex);
      this.totalRecords = this.examSource.length;
    }

  }
  sortedData(ev) {
    this.sortingEnabled = true;
    (this.direction == 0 || this.direction == -1) ? (this.direction = 1) : (this.direction = -1)
    {
      this.examSource = this.examSource.sort((a: any, b: any) => {
        if (a[ev] < b[ev]) {
          return -1 * this.direction;
        }
        else if (a[ev] > b[ev]) {
          return this.direction;
        }
        else {
          return 0;
        }
      })
    }
    this.pageIndex = 1;
    this.fetchTableDataByPage(this.pageIndex);
  }
}