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
    unassignFlag: '0',
    standard_id: -1,
  }
  showTable: boolean = false;
  feeTemplateDataSource: any = [];
  deafultTemplate: any;
  searchData: any = "";

  constructor(
    private apiService: CourseListService,
    private toastCtrl: AppComponent,
  ) { }

  ngOnInit() {
    this.checkTabSelection();
    this.getCourseListForTable();
    this.getStandardList();
  }

  getCourseListForTable() {
    this.isRippleLoad = true;
    this.apiService.getCourseListFromServer().subscribe(
      (data: any) => {
        this.dataStatus = 2;
        this.courseListDataSource = data;
        this.totalRow = data.length;
        this.fetchTableDataByPage(this.PageIndex);
        this.isRippleLoad = false;
        if (data.length > 0) {
          setTimeout(
            () => {
              this.toggleTbodyClass(0);
            }, 300
          );
        }
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
    this.searchData = "";
    let unassign: any = "";
    if (this.searchFilter.unassignFlag == '2') {
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
        let data = this.makeTableJson(res);
        this.studentListDataSource = this.keepCloning(data);
        this.studentList = data;
        this.getHeaderCheckBoxValue();
        this.isRippleLoad = false;
      },
      error => {
        this.isRippleLoad = false;
      }
    )
  }

  makeTableJson(res) {
    if (this.searchFilter.unassignFlag == '0') {
      res.forEach(element => {
        if (element.assigned_fee_template_id == -1) {
          if (this.deafultTemplate != null && this.deafultTemplate != "") {
            element.assigned_fee_template_id = this.deafultTemplate.template_id;
          }
        }
      });
      return res;
    } else if (this.searchFilter.unassignFlag == '1') {
      let data = [];
      res.forEach(element => {
        if (element.assigned) {
          if (element.assigned_fee_template_id == -1) {
            if (this.deafultTemplate != null && this.deafultTemplate != "") {
              element.assigned_fee_template_id = this.deafultTemplate.template_id;
              data.push(element);
            } else {
              // tHIS CASE IF FEE TEMPLATE IS NOT MADE FOR COURSE
              data.push(element);
            }
          } else {
            data.push(element);
          }
        }
      });
      return data;
    } else {
      res.forEach(element => {
        if (element.assigned_fee_template_id == -1) {
          if (this.deafultTemplate != null && this.deafultTemplate != "") {
            element.assigned_fee_template_id = this.deafultTemplate.template_id;
          }
        }
      });
      return res;
    }
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
        //console.log(err);
      }
    )
  }

  saveChanges() {
    if (this.searchFilter.unassignFlag == '0') {
      if (confirm('If you unassign the student from course then corresponding fee instalments will be deleted.')) {
        this.apiToAllocateAndDeallocate();
      }
    }
    else if (this.searchFilter.unassignFlag == '1') {
      let selectedRows = this.getUISelectedRows(this.studentList);
      if (selectedRows.length == this.studentListDataSource.length) {
        this.messageToast('error', 'Error', "You haven't unassigned any student");
        return false;
      } else {
        if (confirm('If you unassign the student from course then corresponding fee instalments will be deleted.')) {
          this.apiToAllocateAndDeallocate();
        }
      }
    }
    else {
      this.apiToAllocateAndDeallocate();
    }
  }

  getUISelectedRows(data) {
    let tempdata: any = [];
    data.forEach(element => {
      if (element.assigned) {
        tempdata.push(element);
      }
    });
    return tempdata;
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
            this.studentList.splice(t, 1);
            break;
          }
        }
      }
    }
    return test;
  }

  onRadioButtonChange() {
    this.searchData = "";
    this.studentList = [];
    this.studentListDataSource = [];
    this.getAllStudentList();
  }

  searchStudent(element) {
    if (element.value != '' && element.value != null) {
      let searchData = this.studentListDataSource.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(element.value.toLowerCase()))
      );
      this.studentList = searchData;
      this.PageIndex = 1;
    } else {
      this.studentList = this.studentListDataSource;
    }
  }

  closeStudentPopup() {
    this.addStudentPopUp = false;
    this.searchFilter = {
      unassignFlag: '0',
      standard_id: -1,
    };
    this.studentList = [];
    this.showTable = false;
    this.searchData = "";
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

  checkTabSelection() {
    setTimeout(() => {
      this.hideAllTabs();
      document.getElementById('liManageBatch').classList.add('active');
    }, 200)
  }

  hideAllTabs() {
    document.getElementById('liStandard').classList.remove('active');
    document.getElementById('liSubject').classList.remove('active');
    document.getElementById('liManageBatch').classList.remove('active');
    // document.getElementById('liExam').classList.add('hide');
    document.getElementById('liClass').classList.remove('active');
  }

}
