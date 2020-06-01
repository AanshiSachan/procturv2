import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FileManagerService } from '../file-manager.service';
import { AppComponent } from '../../../../app.component';
import * as moment from 'moment';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { MessageShowService } from '../../../../services/message-show.service';

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
  isProfessional: boolean = false;
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
    subject_id: "",
    is_readonly: "N"
  }
  fileSharePublic = {
    course_types: "",
    file_id: "",
    institute_id: this.fileService.institute_id,
    public_share: 1,
    share_type: 2,
    standard_id: "",
    subject_id: "",
    is_readonly: "N"
  }
  startAccessTimeStudent = moment().format('YYYY-MM-DD');
  endAccessTimeStudent = moment().format('YYYY-MM-DD');
  endAccessTimeBatch = moment().format('YYYY-MM-DD');
  startAccessTimeBatch = moment().format('YYYY-MM-DD')
  isChecked: boolean = false;
  isStudentChecked: boolean = false;
  isReadonlyStu: boolean = false;
  isReadonlyInst: boolean = false;
  isReadonlyPub: boolean = false;
  @Input() fileIdGet: string;
  @Input() fileName: any;
  @Input() shareOptions: any;
  @Output() treeUpdater = new EventEmitter<any>();

  courseMappingArray: any[] = [];
  tabChoice = "student";
  unshare: number;
  categoryId: any;
  editBatchShare = false;
  editInstituteShare = false;
  editPublicShare = false;
  courseValue = ""
  courseType = []
  date: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
  month: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  year: any[] = [2015, 2016, 2017, 2018, 2019, 2020]
  instituteObj = {
    file_id: '',
    institute_id: this.fileService.institute_id,
    share_type: 1,
    is_readonly: "N"
  }
  temparrBatch: any[] = [];
  temparrStudent: any[] = [];
  publicObj = {
    file_id: '',
    institute_id: this.fileService.institute_id,
    share_type: 2,
    is_readonly: "N"
  }

  getFileType: string = "";

  constructor(private fileService: FileManagerService, private appC: AppComponent, private auth: AuthenticatorService, private services: MessageShowService) { }

  ngOnInit() {
    this.getAllStandards();
    this.multiCourseMapping();
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

    this.getFileType = this.shareOptions.fileType;
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
      if (this.shareOptions.isReadonly == "N") {
        this.isReadonlyStu = false
      }
      else {
        this.isReadonlyStu = true;
      }
    } else if (index == '2' && this.shareOptions.publicShare == '1') {
      share_type = 2;
      this.editPublicShare = true;
      if (this.shareOptions.isReadonly == "N") {
        this.isReadonlyPub = false
      }
      else {
        this.isReadonlyPub = true;
      }
    } else if (index == '3' && this.shareOptions.instituteShare == '1') {
      share_type = 1;
      this.editInstituteShare = true;
      if (this.shareOptions.isReadonly == "N") {
        this.isReadonlyInst = false;
      }
      else {
        this.isReadonlyInst = true;
      }
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
          if (this.categoryId != '62') {
            this.fileSharePublic.standard_id = data.standard_id;
            this.getAllSubjects(data.standard_id);
            this.fileSharePublic.subject_id = data.subject_id;
            this.courseType = data.course_types.split(',');
            // this.courseTypeSelection(this.courseType);
            this.fileSharePublic.course_types = data.course_types;
            if (this.shareOptions.isReadonly == "N") {
              this.isReadonlyPub = false;
            }
            else {
              this.isReadonlyPub = true;
            }
          }

        } else if (share_type == '3') {

          this.getStandardsId = data.standard_id;
          this.getAllSubjects(data.standard_id);
          this.subjectId = data.subject_id;
          this.fetchShareOption.desc = data.desc;
          this.getBatches(1);
          this.fetchCoursesData(this.subjectId, 0, 1);
          if (this.shareOptions.isReadonly == "N") {
            this.isReadonlyStu = false
          }
          else {
            this.isReadonlyStu = true;
          }
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
        this.getStudentsData = [];
        this.getBatchesData = [];
        this.studentsId = false;
        this.batchesId = true;
      },
      (error: any) => {

      }
    )
  }


  getReadonlystu(event) {
    if (event == true) {
      this.fetchShareOption.is_readonly = "Y"
    }
    else {
      this.fetchShareOption.is_readonly = "N"
    }
  }

  getReadonlypublic(event) {
    if (event == true) {
      this.fileSharePublic.is_readonly = "Y"
      this.publicObj.is_readonly = "Y"
    }
    else {
      this.fileSharePublic.is_readonly = "N"
      this.publicObj.is_readonly = "N"
    }
  }

  getReadonlyinst(event) {
    if (event == true) {
      this.instituteObj.is_readonly = "Y"
    }
    else {
      this.instituteObj.is_readonly = "N"
    }
  }

  getAllSubjects(i) {
    this.fileService.getSubjects(i).subscribe(
      (data: any) => {
        this.getSubjects = data;
        this.studentsId = false;
        this.batchesId = true;
      },
      (error: any) => {

      }
    )
  }


  getBatches(update?) {
    this.getBatchesData = [];
    let batchesData =[];
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
        let currentDate = new Date();
        this.dataStatus = false;
       let filterbatches = data;
       filterbatches.forEach(batch => { /// expire batch removes from data
         let batchDate = new Date(batch.file_access_end_time);
           if(batchDate.getTime() >= currentDate.getTime()){
            batchesData.push(batch)
           }
       });

        this.getBatchesData = batchesData;

        this.getBatchesData.map(
          (data: any) => {

            if (data.file_access_start_time == "") {
              data.file_access_start_time = moment().format('YYYY-MM-DD');
            }

            if (data.file_access_end_time == "") {
              data.file_access_end_time = moment().format('YYYY-MM-DD');
            }

            if (update != 1) {
              data.is_file_shared = "N"
              data.isChecked = false
            }
            else {
              data.isUpdated = false;
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
        this.dataStatus = false;
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

  prefillSelected(courseId) {
    for (let i = 0; i < this.courseType.length; i++) {
      if (this.courseType[i] == courseId) {
        return true;
      }
    }
    return false;
  }

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
    this.getStudentsData = [];
    this.dataStatus = true;
    this.isStudentChecked = false;
    (update == true) ? update = 1 : update = 0;
    if (event == 0) {
      let arr = [];
      this.studentsId = false;
      this.batchesId = true;
      this.dataStatus = false;
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
          this.dataStatus = false;
          this.getStudentsData = data;
          this.getStudentsData.map(
            (data: any) => {
              if (data.file_access_end_time == "") {
                data.file_access_end_time = moment().format('YYYY-MM-DD')
              }
              if (data.file_access_start_time == "") {
                data.file_access_start_time = moment().format('YYYY-MM-DD')
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
          this.dataStatus = false;
        }
      )
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
      if(!this.getBatchesData[index].isUpdated){
        this.getBatchesData[index].isUpdated = true;
      }
    }
    else {
      this.getBatchesData[index].is_file_shared = "N"
      this.isChecked = false;
      this.getBatchesData[index].isChecked = false;
      if(!this.getBatchesData[index].isUpdated){
        this.getBatchesData[index].isUpdated = true;
      }
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

  fetchApiStudentsAndBatches() {

    console.log(this.getBatchesData);
    console.log(this.getStudentsData);

    this.getBatchesData.map(ele => {
      if (ele.isChecked == true) {
        let obj = {
          file_access_end_time: ele.file_access_end_time,
          file_access_start_time: ele.file_access_start_time,
          is_file_shared: ele.is_file_shared,
          batch_id: ele.batch_id
        }
        this.temparrBatch.push(obj);
      }
      else {
        let obj = {
          is_file_shared: ele.is_file_shared,
          batch_id: ele.batch_id
        }
        this.temparrBatch.push(obj);
      }
    })

    this.getStudentsData.map(ele => {
      if (ele.isChecked == true) {
        let obj = {
          file_access_end_time: ele.file_access_end_time,
          file_access_start_time: ele.file_access_start_time,
          is_file_shared: ele.is_file_shared,
          student_id: ele.student_id
        }
        this.temparrStudent.push(obj);
      }
      else {
        let obj = {
          is_file_shared: ele.is_file_shared,
          student_id: ele.student_id
        }
        this.temparrStudent.push(obj);
      }
    })

    this.fileService.shareFile(this.fetchShareOption).subscribe(
      (data: any) => {
        let msg = {
          type: "success",
          body: "File Shared Successfully"
        }
        this.appC.popToast(msg);
        this.treeUpdater.emit(true);
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

  validationsOfTime() {
    let isNotCountSelected = 0;
    if (this.batchesId) {
      for (let i = 0; i < this.getBatchesData.length; i++) {
        if (this.getBatchesData[i].isChecked) {
          let a = new Date(this.getBatchesData[i].file_access_start_time.toString());
          let b = new Date(this.getBatchesData[i].file_access_end_time.toString());
          if (a.getTime() > b.getTime()) {
            this.services.showErrorMessage("error", "Incorrect Details", "Access start Date Cannot be more than access end date")
            return false;
          }
        }
        else {
          if(!this.getBatchesData[i].isUpdated){
            isNotCountSelected++;
          }
        }

      }

      if (isNotCountSelected == this.getBatchesData.length) {
        this.services.showErrorMessage("error", "Incorrect Details", "Please select batch for share file")
        return false;
      }
      return true;
    }

    else if (this.studentsId) {
      for (let i = 0; i < this.getStudentsData.length; i++) {
        if (moment(this.getStudentsData[i].file_access_start_time) > moment(this.getStudentsData[i].file_access_end_time)) {
          this.services.showErrorMessage("error", "Incorrect Details", "Access start Date Cannot be more than access end date")
          return false;
        }
      }
      return true;
    }
  }



  shareFile(unshare?) {
    this.fetchShareOption.file_id = this.fileIdGet;
    this.fetchShareOption.share_type = "3";
    this.fetchShareOption.student_batch_share = "1"
    this.fetchShareOption.standard_id = this.getStandardsId;
    this.fetchShareOption.subject_id = this.subjectId;
    this.fetchShareOption.batches = this.temparrBatch;
    this.fetchShareOption.students = this.temparrStudent;

    if (this.tabChoice == "student") {

      if (this.fetchShareOption.standard_id == "" || this.fetchShareOption.subject_id == "") {
        this.services.showErrorMessage("error", "Incorrect Details", "Please select master course and course")
      }

      else if (this.getBatchesData == []) {
        this.services.showErrorMessage("error", "Incorrect Details", "No batches/students found")
      }

      else {
        if (this.validationsOfTime() == true) {
          this.fetchApiStudentsAndBatches();
          return;
        }
      }
    }


    else if (this.tabChoice == "public") {

      if (unshare == '1') {
        let Obj = {
          file_id: this.fileIdGet,
          institute_id: this.fileService.institute_id,
          public_share: '1',
          share_type: 0
        }
        this.fileService.shareFile(Obj).subscribe(
          (data: any) => {
            let msg = {
              type: "success",
              body: "File UnShared Successfully"
            }
            this.appC.popToast(msg);
            this.treeUpdater.emit(true);
            this.closePopup.emit(this.CloseValuePopup);
          },
          (error: any) => {

          }
        )
      }
      else {

        this.fileSharePublic.file_id = this.fileIdGet;
        if (this.categoryId != '62') {

          if (this.fileSharePublic.standard_id == "" || this.fileSharePublic.subject_id == "") {
            let msg = {
              type: "error",
              body: "Please select master course and course"
            }
            this.appC.popToast(msg);
          }

          else if (this.courseType.length == 0) {
            let msg = {
              type: "error",
              body: "Course type is mandatory"
            }
            this.appC.popToast(msg);
          }
          else {
            this.courseValue = this.courseType.join();
            this.fileSharePublic.course_types = this.courseValue;
            this.fileService.shareFile(this.fileSharePublic).subscribe(
              (data: any) => {
                let msg = {
                  type: "success",
                  body: "File Shared Successfully"
                }
                this.appC.popToast(msg);
                this.treeUpdater.emit(true);
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

        else {
          this.publicObj.file_id = this.fileIdGet
          this.fileService.shareFile(this.publicObj).subscribe(
            (data: any) => {
              let msg = {
                type: "success",
                body: "File Shared Successfully"
              }
              this.appC.popToast(msg);
              this.treeUpdater.emit(true);
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
      this.instituteObj.file_id = this.fileIdGet;
      let mess = "Shared";
      if (unshare == '1') {
        this.instituteObj.share_type = 0;
        mess = "Unshared";
      }
      this.fileService.shareFile(this.instituteObj).subscribe(
        (data: any) => {
          let msg = {
            type: "success",
            body: "File " + mess + " Successfully"
          }
          this.appC.popToast(msg);
          this.treeUpdater.emit(true);
          this.closePopup.emit(this.CloseValuePopup);

        },
        (error: any) => {

        }
      )
    }
  }

  courseTypeSelection(event) {
    this.courseType = event;
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
      (<HTMLFormElement>document.getElementById('batch')).checked = true;
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
