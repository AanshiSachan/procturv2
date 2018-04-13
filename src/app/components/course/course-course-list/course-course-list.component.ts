import { Component, OnInit } from '@angular/core';
import { CourseListService } from '../../../services/course-services/course-list.service';
import { AppComponent } from '../../../app.component';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-course-course-list',
  templateUrl: './course-course-list.component.html',
  styleUrls: ['./course-course-list.component.scss']
})
export class CourseCourseListComponent implements OnInit {

  courseList: any = [];
  courseListDataSource: any = [];
  isRippleLoad: boolean = false;
  PageIndex: number = 1;
  displayBatchSize: number = 10;
  totalRow: number;
  dataStatus: number = 1;
  dummyArr: any[] = [0, 1, 2, 3, 4, 0, 1, 2, 3, 4];
  columnMaps: any[] = [0, 1, 2, 3, 4];
  selectedRow: number;
  addStudentPopUp: boolean = false;
  courseDetails: any;
  studentListDataSource: any = [];
  studentList: any = [];
  allChecked: boolean = false;
  academicList: any = [];
  standardList: any = [];
  searchFilter = {
    unassignFlag: true,
    standard_id: -1,
  }
  showTable: boolean = false;
  feeTemplateDataSource: any = [];
  deafultTemplate: any;

  constructor(
    private apiService: CourseListService,
    private toastCtrl: AppComponent,
  ) { }

  ngOnInit() {
    this.getCourseListForTable();
    this.getStandardList();
  }

  getCourseListForTable() {
    this.isRippleLoad = true;
    this.apiService.getCourseListFromServer().subscribe(
      (data: any) => {
        this.courseListDataSource = data;
        this.totalRow = data.length;
        this.fetchTableDataByPage(this.PageIndex);
        this.isRippleLoad = false;
        setTimeout(
          () => {
            this.toggleTbodyClass(0);
          }, 300
        );
      },
      error => {
        this.isRippleLoad = false;
      }
    )
  }

  getStandardList() {
    this.apiService.getStandardListFromServer().subscribe(
      res => {
        this.standardList = res;
      },
      err => {
      }
    )
  }

  // pagination functions 

  fetchTableDataByPage(index) {
    this.PageIndex = index;
    let startindex = this.displayBatchSize * (index - 1);
    this.courseList = this.getDataFromDataSource(startindex);
  }

  fetchNext() {
    this.PageIndex++;
    this.fetchTableDataByPage(this.PageIndex);
  }

  fetchPrevious() {
    if (this.PageIndex != 1) {
      this.PageIndex--;
      this.fetchTableDataByPage(this.PageIndex);
    }
  }

  getDataFromDataSource(startindex) {
    let t = this.courseListDataSource.slice(startindex, startindex + this.displayBatchSize);
    return t;
  }

  sortTable(str) {
    if (str == "master_course" || str == "standard_name" || str == "coursee_names") {
      this.courseList.sort(function (a, b) {
        var nameA = a[str].toUpperCase(); // ignore upper and lowercase
        var nameB = b[str].toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        // names must be equal
        return 0;

      })
    }
  }

  rowSelectEvent(i) {
    this.selectedRow = i;
  }

  addStudentToBatch(rowDetails) {
    this.addStudentPopUp = true;
    this.courseDetails = rowDetails;
    // this.getAllStudentList();
    this.getAcademicYearDetails();
    this.getAllFeeTemplate();
  }

  getAcademicYearDetails() {
    this.academicList = [];
    this.apiService.getAcadYear().subscribe(
      res => {
        this.academicList = res;
      },
      err => {
      }
    )
  }

  getAllStudentList() {
    let unassign: any = "";
    if (this.searchFilter.unassignFlag == true) {
      unassign = "Y";
    } else {
      unassign = "N";
    }
    let data = {
      course_id: this.courseDetails.course_id,
      standard_id: Number(this.searchFilter.standard_id),
      isUnassignedStudent: unassign
    }
    this.isRippleLoad = true;
    this.showTable = true;
    this.apiService.getStudentList(data).subscribe(
      (res: any) => {
        res.forEach(element => {
          if (element.assigned_fee_template_id == -1) {
            if (this.deafultTemplate != null && this.deafultTemplate != "" && this.deafultTemplate.length > 0) {
              element.assigned_fee_template_id = this.deafultTemplate.template_id;
            }
          }
        });
        this.studentListDataSource = this.keepCloning(res);
        this.studentList = res;
        this.getHeaderCheckBoxValue();
        this.isRippleLoad = false;
      },
      error => {
        this.isRippleLoad = false;
      }
    )
  }

  defaultTemplateDet(data) {
    data.forEach(element => {
      if (element.is_default == 1) {
        this.deafultTemplate = element;
      }
    });
  }

  getAllFeeTemplate() {
    this.apiService.getFeeTemplate(this.courseDetails.course_id).subscribe(
      res => {
        this.feeTemplateDataSource = res;
        this.defaultTemplateDet(res);
      },
      err => {
        console.log(err);
      }
    )
  }

  saveChanges() {
    if (this.searchFilter.unassignFlag == false) {
      if (confirm('If you unassign the student from course then corresponding fee instalments will be deleted.')) {
        this.apiToAllocateAndDeallocate();
      }
    } else {
      this.apiToAllocateAndDeallocate();
    }
  }

  apiToAllocateAndDeallocate() {
    this.isRippleLoad = true;
    let data = this.getCheckedRows();
    let dataToSend = {
      studentAssignedUnassigned_and_AcademicYearMapping: data,
    };
    this.apiService.saveUpdatedList(dataToSend, this.courseDetails.course_id).subscribe(
      res => {
        this.messageToast('success', 'Saved', 'Changes saved successfully.');
        this.studentList = [];
        this.addStudentPopUp = false;
        this.isRippleLoad = false;
        this.showTable = false;
      },
      err => {
        this.isRippleLoad = false;
        this.messageToast('error', 'Error', err.error.message);
      }
    )
  }

  getCheckedRows() {
    let test = {};
    for (let i = 0; i < this.studentListDataSource.length; i++) {
      for (let t = 0; t < this.studentList.length; t++) {
        if (this.studentList[t].student_id == this.studentListDataSource[i].student_id) {
          if (this.studentList[t].assigned != this.studentListDataSource[i].assigned) {
            test[this.studentList[t].student_id] = [this.studentList[t].assigned.toString(), this.studentList[t].academic_year.toString(), this.studentList[i].assigned_fee_template_id.toString()];
          }
        }
      }
    }
    return test;
  }


  searchStudent(element) {
    if (element.value != '' && element.value != null) {
      let searchData = this.studentListDataSource.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(element.value.toLowerCase()))
      );
      this.studentList = searchData;
    } else {
      this.studentList = this.studentListDataSource;
    }
  }

  closeStudentPopup() {
    this.addStudentPopUp = false;
    this.searchFilter = {
      unassignFlag: true,
      standard_id: -1,
    };
    this.studentList = [];
    this.showTable = false;
  }

  selectAllCheckBox(element) {
    let val = element.checked;
    for (let i = 0; i < this.studentList.length; i++) {
      this.studentList[i].assigned = val;
    }
  }

  getHeaderCheckBoxValue() {
    for (let i = 0; i < this.studentList.length; i++) {
      if (this.studentList[i].assigned == false) {
        this.allChecked = false;
        break
      }
      else {
        this.allChecked = true;
      }
    }
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

  toggleTbodyClass(i) {
    document.getElementById('tbodyItem' + i).classList.toggle("active");
    document.getElementById('tbodyView' + i).classList.toggle("hide");
  }

  messageToast(Errortype, Errortitle, message) {
    let msg = {
      type: Errortype,
      title: Errortitle,
      body: message
    }
    this.toastCtrl.popToast(msg);
  }

}
