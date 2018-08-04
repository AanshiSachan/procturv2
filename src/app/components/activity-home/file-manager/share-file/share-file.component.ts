import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FileManagerService } from '../file-manager.service';
import { AppComponent } from '../../../../app.component';
import * as moment from 'moment';

@Component({
  selector: 'share-file',
  templateUrl: './share-file.component.html',
  styleUrls: ['./share-file.component.scss']
})
export class ShareFileComponent implements OnInit {


  @Output() closePopup = new EventEmitter<any>();
  CloseValuePopup: boolean = false;
  getStandards: any[] = []
  getStandardsId = ""
  getSubjects: any[] = [];
  fetchBatchesData = {
    institute_id: this.fileService.institute_id,
    file_id: "",
    subject_id: ""
  }
  getStudentsData: any[] = [];
  subjectId: string = ""
  getBatchesData: any[] = [];
  studentsId: boolean = false;
  batchesId: boolean = true;
  dataStatus: boolean = false;
  dummyArr: any[] = [0, 1, 2, 0, 1, 2];
  columnMaps: any[] = [0, 1, 2, 3];
  dataIdBatches;
  getBatch: string = "0";
  getStudent: string = "";
  fetchShareOption = {
    batches: [],
    desc: "",
    file_id: "",
    institute_id: this.fileService.institute_id,
    share_type: "",
    standard_id: "",
    student_batch_share: "",
    students: [],
    subject_id: ""
  }
  fileSharePublic = {
    course_types: "",
    file_id: "",
    institute_id: this.fileService.institute_id,
    public_share: 1,
    share_type: 2,
    standard_id: "",
    subject_id: "",
  }
  isChecked: boolean = false;
  isStudentChecked: boolean = false;

  @Input() fileIdGet: string;
  @Input() fileName: any;
  @Input() shareOptions: any;

  courseMappingArray: any[] = [];
  tabChoice = "student";

  categoryId: any;
  editBatchShare = false;
  editInstituteShare = false;
  editPublicShare = false;
  courseValue = ""
  courseType = []
  date: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
  month: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  year: any[] = [2015, 2016, 2017, 2018, 2019, 2020]

  constructor(private fileService: FileManagerService, private appC: AppComponent) { }

  ngOnInit() {
    this.getAllStandards();
    this.multiCourseMapping();
  }

  ngOnChanges() {
    this.categoryId = this.fileName.res.category_id;
    this.editBatchShare = false;
    this.editInstituteShare = false;
    this.editPublicShare = false;
    this.selectTab(2);
  }

  close() {
    this.closePopup.emit(this.CloseValuePopup);
  }

  chooseTab(index) {

    /*Disabling Buttons
    if(this.shareOptions.batchShare == '0'){
      (<HTMLFormElement>document.getElementById('tab1')).disabled = true;
    }else if(this.shareOptions.publicShare == '0'){
      (<HTMLFormElement>document.getElementById('tab2')).disabled = true;
    }else if(this.shareOptions.instituteShare == '0'){
      (<HTMLFormElement>document.getElementById('tab3')).disabled = true;
    }*/
    let share_type = 0;
    if (index == '1' && this.shareOptions.batchShare == '1') {
      share_type = 3;
      this.editBatchShare = true;
    } else if (index == '2' && this.shareOptions.publicShare == '1') {
      share_type = 2;
      this.editPublicShare = true;
    } else if (index == '3' && this.shareOptions.instituteShare == '1') {
      share_type = 1;
      this.editInstituteShare = true;
    }
    if (share_type != 0) {
      this.editFileFetch(share_type);
    }

  }

  editApiSwitch(key) {
    switch (key) {
      case 1:

        break;
      case 2:

        break;
      case 3:

        break;
    }
  }

  editFileFetch(share_type) {
    let Obj = {
      file_id: this.fileIdGet,
      institute_id: this.fileService.institute_id,
      share_type: share_type
    }
    this.fileService.editFileShare(Obj).subscribe(
      (data: any) => {

        if (share_type == '2') {

          this.fileSharePublic.standard_id = data.standard_id;
          this.getAllSubjects(data.standard_id);
          this.fileSharePublic.subject_id = data.subject_id;
          this.fileSharePublic.course_types = data.course_types.split(',');

        } else if (share_type == '3') {

          this.getStandardsId = data.standard_id;
          this.getAllSubjects(data.standard_id);
          this.subjectId = data.subject_id;
          this.fetchShareOption.desc = data.desc;
          this.getBatches(1);
          this.fetchCoursesData(this.subjectId, 0, 1);
        }
      },
      (error: any) => {

      }
    )
  }

  getAllStandards() {
    this.fileService.getAllStandards().subscribe(
      (data: any) => {
        this.getStandards = data;
      },
      (error: any) => {

      }
    )
  }


  getAllSubjects(i) {
    this.fileService.getSubjects(i).subscribe(
      (data: any) => {
        this.getSubjects = data;
      },
      (error: any) => {

      }
    )
  }

  getBatches(update?) {
    this.isChecked = false;
    this.getBatch = "0";
    this.batchesId = true;
    this.dataStatus = true;
    (<HTMLFormElement>document.getElementById('batch')).checked = true;
    this.fetchBatchesData = {
      institute_id: this.fileService.institute_id,
      file_id: this.fileIdGet,
      subject_id: this.subjectId
    }
    this.fileService.shareFileWithBatches(this.fetchBatchesData).subscribe(
      (data: any) => {
        this.getBatchesData = data;
        this.getBatchesData.map(
          (data: any) => {
            this.dataStatus = false;
            let endTime = data.file_access_end_time.split("-");
            let startTime = data.file_access_start_time.split("-");
            if (endTime[0] == '') {
              data.end_date = moment().date();
              data.end_month = moment().month() + 1;
              data.end_year = moment().year();
            } else {
              data.end_date = parseInt(endTime[2]);
              data.end_month = parseInt(endTime[1]);
              data.end_year = endTime[0];
            }

            if (startTime[0] == '') {
              data.start_month = moment().month() + 1;
              data.start_year = moment().year();
              data.start_date = moment().date();
            } else {
              data.start_month = parseInt(startTime[1]);
              data.start_year = startTime[0];
              data.start_date = parseInt(startTime[2]);
            }

            if (update != 1) {
              data.is_file_shared = "N"
              data.isChecked = false
            } else {
              if (data.is_file_shared == 'Y') {
                data.isChecked = true;
              } else {
                data.isChecked = false;
              }
            }
          }
        )
      }

    )
  }

  // fetchUpdatedBatches(){
  //   this.fetchBatchesData = {
  //     institute_id: this.fileService.institute_id,
  //     file_id: this.fileIdGet,
  //     subject_id: this.subjectId
  //   }
  //   this.fileService.shareFileWithBatches(this.fetchBatchesData).subscribe(
  //     (data: any) => {
  //       this.getBatchesData = data;

  //     }
  //   )
  // }

  // fetchStudentsShare(){
  //     this.studentsId = true;
  //     this.batchesId = false;
  //     this.fetchBatchesData = {
  //       institute_id: this.fileService.institute_id,
  //       file_id: this.fileIdGet,
  //       subject_id: subject_id
  //     }
  //     this.fileService.shareFileWithStudents(this.fetchBatchesData).subscribe(
  //       (data: any) => {

  //         this.getStudentsData = data;
  //         this.getStudentsData.map(
  //           (data: any) => {
  //             data.start_month = moment().month() + 1;
  //             data.start_year = moment().year();
  //             data.start_date = moment().date();
  //             data.end_date = moment().date();
  //             data.end_month = moment().month() + 1;
  //             data.end_year = moment().year();
  //             data.is_file_shared = "N",
  //               data.isChecked = false
  //           }
  //         )

  //       },
  //       (error: any) => {

  //       }
  //     )
  // }

  multiCourseMapping() {
    this.fileService.courseMapping().subscribe(
      (data: any) => {
        this.courseMappingArray = data;
      },
      (error: any) => {
        let msg = {
          type: "error",
          body: error.error.message
        }
        this.appC.popToast(msg);
      }
    )
  }

  fetchCoursesData(subject_id, event, update?) {
    this.dataStatus = true;
    (update == true) ? update = 1 : update = 0;
    if (event == 0) {
      let arr = [];
      this.studentsId = false;
      this.batchesId = true;
    }
    else if (event == "1") {
      this.studentsId = true;
      this.batchesId = false;
      this.fetchBatchesData = {
        institute_id: this.fileService.institute_id,
        file_id: this.fileIdGet,
        subject_id: subject_id
      }
      this.fileService.shareFileWithStudents(this.fetchBatchesData).subscribe(
        (data: any) => {
          this.getStudentsData = data;
          this.getStudentsData.map(
            (data: any) => {
              this.dataStatus = false;
              let endTime = data.file_access_end_time.split("-");
              let startTime = data.file_access_start_time.split("-");
              if (endTime[0] == "") {
                data.end_date = moment().date();
                data.end_month = moment().month() + 1;
                data.end_year = moment().year();
              } else {
                data.end_date = parseInt(endTime[2]);
                data.end_month = parseInt(endTime[1]);
                data.end_year = endTime[0];
              }
              if (startTime[0] == "") {
                data.start_month = moment().month() + 1;
                data.start_year = moment().year();
                data.start_date = moment().date();
              } else {
                data.start_month = parseInt(startTime[1]);
                data.start_year = startTime[0];
                data.start_date = parseInt(startTime[2]);
              }

              if (update != 1) {
                data.is_file_shared = "N"
                data.isChecked = false
              } else {
                if (data.is_file_shared == 'Y') {
                  data.isChecked = true;
                } else {
                  data.isChecked = false;
                }
              }
            }
          )
        },
        (error: any) => {

        }
      )
    }
  }


  getStartDate(date, index) {

    if (this.getBatchesData.length == 0) {
      this.getStudentsData[index].start_date = date;
    }
    else if (this.getStudentsData.length == 0) {
      this.getBatchesData[index].start_date = date;
    }

  }

  getStartMonth(month, index) {
    if (this.getBatchesData.length == 0) {
      this.getStudentsData[index].start_month = month;
    }
    else if (this.getStudentsData.length == 0) {
      this.getBatchesData[index].start_month = month;
    }

  }

  getStartYear(year, index) {
    if (this.getBatchesData.length == 0) {
      this.getStudentsData[index].start_year = year;
    }
    else if (this.getStudentsData.length == 0) {
      this.getBatchesData[index].start_year = year;
    }
  }

  getEndDate(date, index) {
    if (this.getBatchesData.length == 0) {
      this.getStudentsData[index].end_date = date;

    }
    else if (this.getStudentsData.length == 0) {
      this.getBatchesData[index].end_date = date;
    }
  }

  getEndMonth(month, index) {
    if (this.getBatchesData.length == 0) {
      this.getStudentsData[index].end_month = month;
    }
    else if (this.getStudentsData.length == 0) {
      this.getBatchesData[index].end_month = month;
    }
  }

  getEndYear(year, index) {
    if (this.getBatchesData.length == 0) {
      this.getStudentsData[index].end_year = year;
    }
    else if (this.getStudentsData.length == 0) {
      this.getBatchesData[index].end_year = year;
      // this.batches.file_access_end_time = this.getBatchesData[index].end_year + "-" + this.getBatchesData[index].end_month + "-" + this.getBatchesData[index].end_date;
    }

  }

  fileSharedBatches(event) {

    if (event == true) {
      for (let i = 0; i < this.getBatchesData.length; i++) {
        this.getBatchesData[i].is_file_shared = "Y";
        this.getBatchesData[i].isChecked = true;
      }
    }
    else if (event == false) {
      for (let i = 0; i < this.getBatchesData.length; i++) {
        this.getBatchesData[i].is_file_shared = "N";
        this.getBatchesData[i].isChecked = false;
      }
    }

  }


  fileSharedStudents(event) {
    if (event == true) {
      for (let i = 0; i < this.getStudentsData.length; i++) {
        this.getStudentsData[i].is_file_shared = "Y";
        this.getStudentsData[i].isChecked = true;
      }
    }
    else if (event == false) {
      for (let i = 0; i < this.getStudentsData.length; i++) {
        this.getStudentsData[i].is_file_shared = "N";
        this.getStudentsData[i].isChecked = false;
      }
    }

  }


  getFileSharedBatches(event, index) {
    if (event == true) {
      this.getBatchesData[index].is_file_shared = "Y"
      this.getBatchesData[index].isChecked = true;
    }
    else {
      this.getBatchesData[index].is_file_shared = "N"
      this.isChecked = false;
      this.getBatchesData[index].isChecked = false;
    }
  }

  getFileSharedStudents(event, index) {
    if (event == true) {
      this.getStudentsData[index].is_file_shared = "Y"
      this.getStudentsData[index].isChecked = true;
    }
    else {
      this.getStudentsData[index].is_file_shared = "N"
      this.isStudentChecked = false;
      this.getStudentsData[index].isChecked = false;
    }
  }


  shareFile(unshare?) {
    let temparrBatch = [];
    let temparrStudent = [];

    this.getBatchesData.map(
      (data: any) => {
        if (data.isChecked == true) {
          let obj = {
            file_access_end_time: data.end_year + "-" + data.end_month + "-" + data.end_date,
            file_access_start_time: data.start_year + "-" + data.start_month + "-" + data.start_date,
            is_file_shared: data.is_file_shared,
            batch_id: data.batch_id
          }
          temparrBatch.push(obj);
        }
        else {
          let obj = {
            is_file_shared: data.is_file_shared,
            batch_id: data.batch_id
          }
          temparrBatch.push(obj);
        }
      }
    )

    this.getStudentsData.map(
      (data: any) => {
        if (data.isChecked == true) {
          let obj = {
            file_access_end_time: data.end_year + "-" + data.end_month + "-" + data.end_date,
            file_access_start_time: data.start_year + "-" + data.start_month + "-" + data.start_date,
            is_file_shared: data.is_file_shared,
            student_id: data.student_id
          }
          temparrStudent.push(obj);
        }
        else {
          let obj = {
            is_file_shared: data.is_file_shared,
            student_id: data.student_id
          }
          temparrStudent.push(obj);
        }
      }
    )
    this.fetchShareOption.file_id = this.fileIdGet;
    this.fetchShareOption.share_type = "3";
    this.fetchShareOption.student_batch_share = "1"
    this.fetchShareOption.standard_id = this.getStandardsId;
    this.fetchShareOption.subject_id = this.subjectId;
    this.fetchShareOption.batches = temparrBatch;
    this.fetchShareOption.students = temparrStudent;


    if (this.tabChoice == "student") {

      if (this.fetchShareOption.standard_id == "" || this.fetchShareOption.subject_id == "") {
        let msg = {
          type: "error",
          body: "Please select master course and course"
        }
        this.appC.popToast(msg);
      }

      else if (this.getBatchesData == [] || this.getStudentsData == []) {
        let msg = {
          type: "error",
          body: "No student/batches to be shared"
        }
        this.appC.popToast(msg);
      }

      else {
        this.fileService.shareFile(this.fetchShareOption).subscribe(
          (data: any) => {
            let msg = {
              type: "success",
              body: "File Shared Successfully"
            }
            this.appC.popToast(msg);
            this.closePopup.emit(this.CloseValuePopup);
          },
          (error: any) => {
            let msg = {
              type: "error",
              body: error.error.message
            }
            this.appC.popToast(msg);
          }
        )
      }

    }

    else if (this.tabChoice == "public") {

      if (unshare == '1') {
        let Obj = {
          file_id: this.fileIdGet,
          institute_id: this.fileService.institute_id,
          public_share: 1,
          share_type: 0
        }
        this.fileService.shareFile(Obj).subscribe(
          (data: any) => {
            let msg = {
              type: "success",
              body: "File UnShared Successfully"
            }
            this.appC.popToast(msg);
            this.closePopup.emit(this.CloseValuePopup);
          },
          (error: any) => {

          }
        )
      }
      else {
        this.courseValue = this.courseType.join();
        this.fileSharePublic.course_types = this.courseValue;
        this.fileSharePublic.file_id = this.fileIdGet;

        if (this.fileSharePublic.standard_id == "" || this.fileSharePublic.subject_id == "") {
          let msg = {
            type: "error",
            body: "Please select master course and course"
          }
          this.appC.popToast(msg);
        }
        else {
          this.fileService.shareFile(this.fileSharePublic).subscribe(
            (data: any) => {
              let msg = {
                type: "success",
                body: "File Shared Successfully"
              }
              this.appC.popToast(msg);
              this.closePopup.emit(this.CloseValuePopup);
            },
            (error: any) => {
              let msg = {
                type: "error",
                body: error.error.message
              }
              this.appC.popToast(msg);
            }
          )
        }
      }

    }

    else if (this.tabChoice == "institute") {
      let instituteObj = {
        file_id: this.fileIdGet,
        institute_id: this.fileService.institute_id,
        share_type: 1
      }
      let mess = "Shared";
      if (unshare == '1') {
        instituteObj.share_type = 0;
        mess = "Unshared";
      }
      this.fileService.shareFile(instituteObj).subscribe(
        (data: any) => {
          let msg = {
            type: "success",
            body: "File " + mess + " Successfully"
          }
          this.appC.popToast(msg);
          this.closePopup.emit(this.CloseValuePopup);
        },
        (error: any) => {

        }
      )
    }
  }

  courseTypeSelection(event) {
    event.push(this.courseType);
  }


  selectTab(tabIndex) {
    //Hide All Tabs
    document.getElementById('tab1Content').style.display = "none";
    document.getElementById('tab2Content').style.display = "none";
    document.getElementById('tab3Content').style.display = "none";


    if (tabIndex == 1) {
      document.getElementById('tab' + 1).style.backgroundColor = "#0084f6bf";
      document.getElementById('tab' + 1).style.color = "#fff";
      document.getElementById('tab' + 2).style.backgroundColor = "";
      document.getElementById('tab' + 2).style.color = "#0084f6";
      document.getElementById('tab' + 3).style.backgroundColor = "";
      document.getElementById('tab' + 3).style.color = "#0084f6";
      this.tabChoice = "student";
    }
    else if (tabIndex == 2) {
      document.getElementById('tab' + 1).style.backgroundColor = "";
      document.getElementById('tab' + 2).style.backgroundColor = "#0084f6bf";
      document.getElementById('tab' + 2).style.color = "#fff";
      document.getElementById('tab' + 1).style.color = "#0084f6";
      document.getElementById('tab' + 3).style.backgroundColor = "";
      document.getElementById('tab' + 3).style.color = "#0084f6";
      this.tabChoice = "public";
    }
    else {
      document.getElementById('tab' + 1).style.backgroundColor = "";
      document.getElementById('tab' + 2).style.backgroundColor = "";
      document.getElementById('tab' + 1).style.color = "#0084f6";
      document.getElementById('tab' + 2).style.color = "#0084f6";
      document.getElementById('tab' + 3).style.backgroundColor = "#0084f6bf";
      document.getElementById('tab' + 3).style.color = "#fff";
      this.tabChoice = "institute";
    }
    //Show the Selected Tab
    document.getElementById('tab' + tabIndex + 'Content').style.display = "block";
    this.chooseTab(tabIndex);
  }
}




