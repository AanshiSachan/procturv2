import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { ExamDeskCourseAssignmentService } from '../../../services/examdesk-service/examdeskcourseassignment.service';


@Component({
  selector: 'app-examdesk-course-assignment',
  templateUrl: './examdesk-course-assignment.component.html',
  styleUrls: ['./examdesk-course-assignment.component.scss']
})
export class ExamdeskCourseAssignmentComponent implements OnInit {

  dataStatus: number = 1;
  isRippleLoad: boolean = false;
  coursesList: any = [];
  dummyArr: any[] = [0, 1, 2, 3, 4, 0, 1, 2, 3, 4];
  columnMaps: any[] = [0, 1, 2];
  columnMapsTr: any[] = [0, 1, 2, 3, 4];
  searchValue: string = "";
  coursesListDataSource: any = [];
  tempData: any = "";
  standardList: any = [];
  assignPopUp: boolean = false;
  standard_id: number = -1;
  studentDataSourceList: any = [];
  studentList: any = [];
  tableData: any = [];
  radioOption: any = '0';
  headerChecked: boolean = false;

  constructor(
    private apiService: ExamDeskCourseAssignmentService,
    private toastCtrl: AppComponent
  ) { }

  ngOnInit() {
    this.fetchCoursesList();
    this.getAllStandardList();
  }

  fetchCoursesList() {
    this.isRippleLoad = true;
    this.dataStatus = 1;
    this.apiService.getCoursesList().subscribe(
      res => {
        this.isRippleLoad = false;
        this.dataStatus = 2;
        this.coursesList = res;
        this.coursesListDataSource = res;
      },
      err => {
        this.dataStatus = 2;
        this.isRippleLoad = false;
        this.messageNotifier('error', 'Error', err.error.message);
      }
    )
  }

  getAllStandardList() {
    this.isRippleLoad = true;
    this.apiService.getStandard().subscribe(
      res => {
        this.isRippleLoad = false;
        this.standardList = res;
      },
      err => {
        this.isRippleLoad = false;
        this.messageNotifier('error', 'Error', err.error.message);
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

  getAllStudentList() {
    this.studentList = [];
    this.studentDataSourceList = [];
    this.isRippleLoad = true;
    let obj: any = {
      standard_id: this.standard_id,
      course_type_id: this.tempData.course_type_id
    };
    this.dataStatus = 1;
    this.apiService.getStudentList(obj).subscribe(
      res => {
        this.dataStatus = 2;
        this.isRippleLoad = false;
        this.studentDataSourceList = res;
        this.studentList = this.keepCloning(res);
        this.onRadioButtonChange();
        this.checkIfHeaderChecked();
      },
      err => {
        this.dataStatus = 2;
        this.isRippleLoad = false;
        this.messageNotifier('error', 'Error', err.error.message);
      }
    )
  }

  onRadioButtonChange() {
    if (this.studentList.length > 0) {
      if (this.radioOption == '0') {
        this.tableData = this.studentList;
        this.checkIfHeaderChecked();
      } else if (this.radioOption == "1") {
        this.headerChecked = true;
        this.tableData = this.studentList.filter(
          el => el.assigned == true
        );
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
    this.radioOption = '0';
    this.studentDataSourceList = [];
    this.studentList = [];
    this.standard_id = -1;
  }

  addStudentToCourse() {
    let data: any = this.getSelectedStudent();
    if (data.length == 0) {
      this.messageNotifier('error', 'Error', 'Please select student to assign in course');
      return;
    }
    let obj: any = {
      studentArray: data,
    };
    this.isRippleLoad = true;
    this.apiService.assignStudentToCourse(obj, this.tempData.course_type_id).subscribe(
      res => {
        this.isRippleLoad = false;
        this.messageNotifier('success', 'Student Assigned Successfully', '');
        this.fetchCoursesList();
        this.closePopup();
      },
      err => {
        this.isRippleLoad = false;
        this.messageNotifier('error', 'Error', err.error.message);
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
