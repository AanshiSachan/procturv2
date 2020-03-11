import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { ExamDeskCourseAssignmentService } from '../../../services/examdesk-service/examdeskcourseassignment.service';
import { AuthenticatorService } from '../../../services/authenticator.service';


@Component({
  selector: 'app-examdesk-course-assignment',
  templateUrl: './examdesk-course-assignment.component.html',
  styleUrls: ['./examdesk-course-assignment.component.scss']
})
export class ExamdeskCourseAssignmentComponent implements OnInit {

  coursesList: any = [];
  dummyArr: any[] = [0, 1, 2, 3, 4, 0, 1, 2, 3, 4];
  columnMaps: any[] = [0, 1, 2];
  columnMapsTr: any[] = [0, 1, 2, 3, 4, 5];
  searchValue: string = "";
  coursesListDataSource: any = [];
  standardList: any = [];
  studentDataSourceList: any = [];
  studentList: any = [];
  tableData: any = [];
  masterCourse: any[] = [];
  courses: any[] = [];
  subjectList: any[] = [];
  batchList: any[] = [];
  tempBatchList: any[] = [];
  tempData: any = "";
  radioOption: any = '0';
  filterOption: any = '0';
  standard_id: number = -1;
  dataStatus: number = 1;
  assignPopUp: boolean = false;
  headerChecked: boolean = false;
  isCourse: boolean = false;
  isCourseModule: boolean = false;

  examAssignmentData = {
    "institute_id": 0,
    "master_course_name": "",
    "course_id": -1,
    "subject_id": -1,
    "standard_id": -1,
    "batch_id": -1
  }

  constructor(
    private apiService: ExamDeskCourseAssignmentService,
    private auth:AuthenticatorService,
    private toastCtrl: AppComponent
  ) { }

  ngOnInit() {
    this.fetchCoursesList();
    this.getAllStandardList();
    this.getMasterCourse();
    this.getData('first');
    if (sessionStorage.getItem('course_structure_flag') == '1') {
      this.isCourseModule = true;
    } else {
      this.isCourseModule = false;
    }

  }

  clearData(type) {
    if (type == 1) {
      this.examAssignmentData.subject_id = -1;
      this.batchList = this.tempBatchList;
    }
    else {
      this.examAssignmentData.batch_id = -1
    }
  }

  fetchCoursesList() {
    this.auth.showLoader();
    this.dataStatus = 1;
    this.apiService.getCoursesList().subscribe(
      res => {
        this.auth.hideLoader();
        this.dataStatus = 2;
        this.coursesList = res;
        this.coursesListDataSource = res;
      },
      err => {
        this.dataStatus = 2;
        this.auth.hideLoader();
        this.messageNotifier('error', '', err.error.message);
      }
    )
  }

  getAllStandardList() {
    this.auth.showLoader();
    this.apiService.getStandard().subscribe(
      res => {
        this.auth.hideLoader();
        this.standardList = res;
      },
      err => {
        this.auth.hideLoader();
        this.messageNotifier('error', '', err.error.message);
      }
    )
  }

  searchInList() {
    if (this.searchValue != "" && this.searchValue != null) {
      let searchData = this.coursesListDataSource.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchValue.toLowerCase()))
      );
      this.coursesList = searchData;
    } else {
      this.coursesList = this.coursesListDataSource;
    }
  }

  //Pop up Function
  assignStudent(data) {
    this.tempData = data;
    this.assignPopUp = true;
    this.getAllStudentList();
  }

  getExamAssignmentData() {
    this.auth.showLoader();
    this.apiService.getStudentList2(this.examAssignmentData).subscribe(
      res => {
        this.dataStatus = 2;
        this.auth.hideLoader();
        this.studentDataSourceList = res;
        this.studentList = this.keepCloning(res);
        this.onRadioButtonChange();
      },
      err => {
        this.dataStatus = 2;
        this.auth.hideLoader();
        this.messageNotifier('error', '', err.error.message);
      });
  }

  getAllStudentList() {
    this.studentList = [];
    this.studentDataSourceList = [];
    this.auth.showLoader();
    let obj: any = {
      standard_id: this.standard_id,
      course_type_id: this.tempData.course_type_id
    };
    this.dataStatus = 1;
    this.apiService.getStudentList(obj).subscribe(
      res => {
        this.dataStatus = 2;
        this.auth.hideLoader();
        this.studentDataSourceList = res;
        this.studentList = this.keepCloning(res);
        this.onRadioButtonChange();
      },
      err => {
        this.dataStatus = 2;
        this.auth.hideLoader();
        this.messageNotifier('error', '', err.error.message);
      }
    )
  }

  onfilterOptionChange() {
    this.isCourse = false;
    switch (this.filterOption) {
      case '0': {
        
        this.isCourse = false;
        this.tableData = [];
        this.studentList = [];
        this.examAssignmentData = {
          "institute_id": 0,
          "master_course_name": "",
          "course_id": -1,
          "subject_id": -1,
          "standard_id": this.standard_id,
          "batch_id": -1
        }
        this.getExamAssignmentData();
        break;
      }
      case '1': {
        this.isCourse = true;
        this.tableData = [];
        this.studentList = [];
        this.examAssignmentData = {
          "institute_id": 0,
          "master_course_name": "",
          "course_id": -1,
          "subject_id": -1,
          "standard_id": -1,
          "batch_id": -1
        }
        break;
      }
    }
    this.onRadioButtonChange();
  }

  onRadioButtonChange() {
    if (this.studentList.length > 0) {
      if (this.radioOption == '0') {
        this.tableData = this.studentList;
        this.checkIfHeaderChecked();
      } else if (this.radioOption == "1") {
        this.headerChecked = false;
        this.tableData = this.studentList.filter(
          el => el.assigned == true
        );
        if(this.tableData.length>0){
          this.headerChecked = true;
        }
      } else {
        this.headerChecked = false;
        this.tableData = this.studentList.filter(
          el => el.assigned == false
        );
      }
    } else {
      this.tableData = [];
    }
  }

  onHeaderCheckBox(event) {
    if (event) {
      this.headerChecked = true;
      this.tableData.forEach(element => {
        element.assigned = true;
      });
    } else {
      this.headerChecked = true;
      this.tableData.forEach(element => {
        element.assigned = false;
      });
    }
  }

  checkIfHeaderChecked() {
    for (let i = 0; i < this.tableData.length; i++) {
      if (this.tableData[i].assigned == false) {
        this.headerChecked = false;
        break;
      } else {
        this.headerChecked = true;
      }
    }
  }

  closePopup() {
    this.assignPopUp = false;
    this.isCourse = false;
    this.radioOption = '0';
    this.studentDataSourceList = [];
    this.studentList = [];
    this.standard_id = -1;
    this.filterOption = '0';
    this.examAssignmentData = {
      "institute_id": 0,
      "master_course_name": "",
      "course_id": -1,
      "subject_id": -1,
      "standard_id": -1,
      "batch_id": -1
    }
  }

  addStudentToCourse() {
    let data: any = this.getSelectedStudent();
    if (data.length == 0) {
      this.messageNotifier('error', '', 'Please select student to assign in course');
      return;
    }
    let obj: any = {
      studentArray: data,
    };
    this.auth.showLoader();
    this.apiService.assignStudentToCourse(obj, this.tempData.course_type_id).subscribe(
      res => {
        this.auth.hideLoader();
        this.messageNotifier('success', 'Student assigned successfully', '');
        this.fetchCoursesList();
        this.closePopup();
      },
      err => {
        this.auth.hideLoader();
        this.messageNotifier('error', '', err.error.message);
      }
    )

  }

  getMasterCourse() {
    this.auth.showLoader();
    this.apiService.getAllMasterCourse().subscribe(
      (data: any) => {
        this.examAssignmentData.master_course_name = "";
        this.examAssignmentData.course_id = -1;
        this.masterCourse = data;
        this.auth.hideLoader();
      },
      (error) => {
        this.auth.hideLoader();
        return error;
      }
    )
  }


  getCourses(name) {
    this.auth.showLoader();
    this.apiService.getAllCourse(name).subscribe(
      (data: any) => {
        this.courses = data.coursesList;
        this.auth.hideLoader();

      },
      (error) => {
        this.auth.hideLoader();
        return error;
      }
    )
  }


  getData(name) {
    this.dataStatus = 2;
    this.apiService.batchData(this.examAssignmentData).subscribe(
      res => {
        console.log(res);
        if (name=='first') {
          this.tempBatchList = res.batchLi;
          this.batchList = this.tempBatchList;
          return;
        }
        if (this.examAssignmentData.subject_id == -1 ) {
          this.examAssignmentData.batch_id = -1;
          this.subjectList = res.subjectLi;        
          return;
        }
        if (this.examAssignmentData.batch_id == -1 ) {
          this.batchList = res.batchLi;
          if (this.batchList.length == 0) {
            this.batchList = this.tempBatchList;
          }
        }
    
      },
      err => {
        this.messageNotifier('error', '', err.error.message);
      }
    )
  }

  getSelectedStudent() {
    let temp: any = {};
    for (let i = 0; i < this.studentDataSourceList.length; i++) {
      for (let j = 0; j < this.studentList.length; j++) {
        if (this.studentDataSourceList[i].user_type == 1 && this.studentList[j].user_type == 1) {
          if (this.studentDataSourceList[i].student_id == this.studentList[j].student_id) {
            if (this.studentDataSourceList[i].assigned != this.studentList[j].assigned) {
              temp[this.studentList[i].student_id] = this.studentList[j].assigned;
            }
          }
        }
      }
    }
    return temp;
  }

  // pagination functions 

  // fetchTableDataByPage(index) {
  //   this.PageIndex = index;
  //   let startindex = this.studentdisplaysize * (index - 1);
  //   this.slotTableList = this.getDataFromDataSource(startindex);
  // }

  // fetchNext() {
  //   this.PageIndex++;
  //   this.fetchTableDataByPage(this.PageIndex);
  // }

  // fetchPrevious() {
  //   if (this.PageIndex != 1) {
  //     this.PageIndex--;
  //     this.fetchTableDataByPage(this.PageIndex);
  //   }
  // }

  // getDataFromDataSource(startindex) {
  //   let t = this.slotsDataSource.slice(startindex, startindex + this.studentdisplaysize);
  //   return t;
  // }

  // helper Function

  messageNotifier(type, title, msg) {
    let data = {
      type: type,
      title: title,
      body: msg
    }
    this.toastCtrl.popToast(data);
  }

  keepCloning(objectpassed) {
    if (objectpassed === null || typeof objectpassed !== 'object') {
      return objectpassed;
    }
    let temporaryStorage = objectpassed.constructor();
    for (var key in objectpassed) {
      temporaryStorage[key] = this.keepCloning(objectpassed[key]);
    }
    return temporaryStorage;
  }

}
