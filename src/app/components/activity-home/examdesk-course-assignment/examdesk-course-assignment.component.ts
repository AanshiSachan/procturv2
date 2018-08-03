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
  searchValue: string = "";
  coursesListDataSource: any = [];
  tempData: any = "";
  standardList: any = [];
  assignPopUp: boolean = false;
  standard_id: number = -1;

  constructor(
    private apiService: ExamDeskCourseAssignmentService,
    private toastCtrl: AppComponent
  ) { }

  ngOnInit() {
    this.fetchCoursesList();
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
    this.getAllStandardList();
    this.getAllStudentList();
  }

  getAllStudentList() {

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

  onGoBtnClick() {

  }

  closePopup() {
    this.assignPopUp = false;
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

}
