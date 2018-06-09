import { Component, OnInit } from '@angular/core';
import { CourseListService } from '../../../../services/course-services/course-list.service';
import { AppComponent } from '../../../../app.component';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-course-edit',
  templateUrl: './course-edit.component.html',
  styleUrls: ['./course-edit.component.scss']
})
export class CourseEditComponent implements OnInit {

  courseName: any;
  activeTeachers: any;
  selectedCourseDetails: any = [];
  standardNameList: any;
  mainTableDataSource: any = [];
  nestedTableDataSource: any;
  subjectList: any;
  dummyArray: any = [];
  examGradeFeature: any;

  constructor(
    private apiService: CourseListService,
    private toastCtrl: AppComponent,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.params.subscribe(
      params => {
        if (params.course_name != undefined && params.course_name != "" && params.course_name != null) {
          this.courseName = params.course_name;
        } else {
          this.router.navigateByUrl('course/courselist');
        }
      }
    )
  }

  ngOnInit() {
    this.examGradeFeature = sessionStorage.getItem('is_exam_grad_feature');
    this.getSelectedCourse(this.courseName);
    this.getAllStandardNameList();
    this.getActiveTeacherList();
  }

  openSubjectTable(i) {
    let t = document.getElementById('spani' + i).innerHTML;
    if (t == '+') {
      document.getElementById('spani' + i).innerHTML = '-';
      document.getElementById('spani' + i).classList.add('close-accor');
      document.getElementById('sub' + i).classList.toggle('hide');
    }
    else {
      document.getElementById('spani' + i).innerHTML = '+';
      document.getElementById('spani' + i).classList.remove('close-accor');
      document.getElementById('sub' + i).classList.toggle('hide');
    }
  }

  getSelectedCourse(data) {
    this.apiService.getSeletedMasterCourseEdit(data).subscribe(
      (res: any) => {
        this.selectedCourseDetails = res;
        this.getSubjectList(res.standard_id);
        this.getMetaDataForTable(this.selectedCourseDetails);
        this.dummyArray.push("Selected Course");
        this.makeMainTableDataSource();
      },
      error => {
        //console.log(error);
        this.messageToast('error', 'Error', error.error.message);
      }
    )
  }

  getAllStandardNameList() {
    this.apiService.getStandardListFromServer().subscribe(
      (data: any) => {
        this.standardNameList = data;
      },
      error => {
        //console.log(error);
        this.messageToast('error', 'Error', 'Please refresh the page.');
      }
    )
  }

  getActiveTeacherList() {
    this.apiService.getTeacherListFromServer().subscribe(
      data => {
        this.activeTeachers = data;
      },
      error => {
        //console.log(error);
        this.messageToast('error', 'Error', 'Please refresh the page.');
      }
    )
  }

  getSubjectList(standardID) {
    this.apiService.getSubjectListOfStandard(standardID).subscribe(
      res => {
        this.dummyArray.push("Subject List");
        this.subjectList = this.addKeyInData(res);
        this.nestedTableDataSource = this.addKeyInData(res);
        this.makeMainTableDataSource();
      },
      err => {
        //console.log(err);
        this.messageToast('error', 'Error', 'Please refresh the page.');
      }
    )
  }

  updateEditedDetails() {
    let dataToSend: any = this.constructJsonToSend();
    if (dataToSend == false) {
      return
    }
    this.apiService.updateDetailsInEdit(dataToSend).subscribe(
      res => {
        this.router.navigateByUrl('course/courselist');
        this.messageToast('success', 'Course Updated', 'Course updated sucessfully.')
      },
      err => {
        //console.log(err);
        this.messageToast('error', 'Error', err.error.message);
      }
    )
  }

  removeRowFromTable(row, i) {
    this.mainTableDataSource.splice(i, 1);
  }

  deleteSubjectRow(row, mainTableIndex, nestedTableIndex) {
    if (confirm("Are you sure you want to delete?")) {
      if (row.hasOwnProperty('otherDetails')) {
        this.apiService.deleteSubjectFromServer(row.otherDetails.batch_id).subscribe(
          data => {
            this.mainTableDataSource[mainTableIndex].batchesList.splice(nestedTableIndex, 1);
            this.checkIfAnySelectedRowExist(this.mainTableDataSource[mainTableIndex], mainTableIndex);
            this.messageToast('success', 'Deleted', 'Sucessfully deleted from the list.');
          },
          error => {
            this.messageToast('error', 'Error', error.error.message);
          }
        )
      }
    }
  }

  addEnableDisableClass(data) {
    let test = this.checkIfAnySubjectSelected(data.batchesList);
    if (test.length > 0) {
      if (data.batch_id != '0') {
        return true;
      } else {
        return false;
      }
    } else {
      return false
    }
  }

  checkIfAnySelectedRowExist(data, mainTableIndex) {
    let uiSelctedData = false;
    for (let i = 0; i < data.batchesList.length; i++) {
      if (data.batchesList[i].uiSelected == "Y" || data.batchesList[i].uiSelected == true) {
        uiSelctedData = true;
      }
    }
    if (uiSelctedData == false) {
      this.mainTableDataSource.splice(mainTableIndex, 1);
    }
  }

  addRowToMainTable() {
    let obj: any = {};
    obj.start_date = '';
    obj.end_date = '';
    obj.course_name = '';
    obj.is_exam_grad_feature = 0;
    obj.course_id = "0";
    obj.batchesList = this.keepCloning(this.subjectList);
    this.mainTableDataSource.push(obj);
  }

  constructJsonToSend() {
    let obj: any = {};
    obj.master_course = this.selectedCourseDetails.master_course;
    obj.standard_id = this.selectedCourseDetails.standard_id;
    obj.coursesList = [];
    for (let i = 0; i < this.mainTableDataSource.length; i++) {
      let test: any = {};
      if (this.mainTableDataSource[i].course_name == "" || this.mainTableDataSource[i].course_name == null) {
        this.messageToast('error', 'Error', "Please Fill Mandatory Details");
        return false;
      }
      test.course_name = this.mainTableDataSource[i].course_name;
      test.end_date = moment(this.mainTableDataSource[i].end_date).format("YYYY-MM-DD");
      test.start_date = moment(this.mainTableDataSource[i].start_date).format("YYYY-MM-DD");
      test.course_id = this.mainTableDataSource[i].course_id.toString();
      if (this.mainTableDataSource[i].is_exam_grad_feature == true) {
        test.is_exam_grad_feature = 1;
      } else {
        test.is_exam_grad_feature = 0;
      }
      test.batchesList = [];
      let selectedSubjectRow = this.checkIfAnySubjectSelected(this.mainTableDataSource[i].batchesList);
      if (selectedSubjectRow.length == 0) {
        this.messageToast('error', 'Error', "You haven't selected any Subject");
        return false;
      }
      for (let y = 0; y < selectedSubjectRow.length; y++) {
        let trp: any = {};
        if (selectedSubjectRow[y].hasOwnProperty('otherDetails')) {
          trp.batch_id = selectedSubjectRow[y].otherDetails.batch_id.toString();
        } else {
          trp.batch_id = '0';
        }
        trp.batch_name = this.selectedCourseDetails.master_course + '-' + this.mainTableDataSource[i].course_name + '-' + selectedSubjectRow[y].subject_name;
        trp.subject_id = selectedSubjectRow[y].subject_id.toString();
        if (selectedSubjectRow[y].selected_teacher == "" || selectedSubjectRow[y].selected_teacher == '-1') {
          this.messageToast('error', 'Error', 'Please provide teacher');
          return false;
        }
        trp.teacher_id = selectedSubjectRow[y].selected_teacher.toString();
        test.batchesList.push(trp);
      }
      obj.coursesList.push(test);
    }
    return obj;
  }

  checkIfAnySubjectSelected(data) {
    let arr: any = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].uiSelected == true) {
        arr.push(data[i])
      }
    }
    return arr;
  }


  addKeyInData(data) {
    data.forEach(element => {
      element.uiSelected = '';
      element.selected_teacher = '';
      element.isAssigned = 'Y';
    });
    return data;
  }

  getMetaDataForTable(data) {
    for (let i = 0; i < data.coursesList.length; i++) {
      this.mainTableDataSource.push(data.coursesList[i]);
    }
  }

  makeMainTableDataSource() {
    if (this.dummyArray.length == 2) {
      for (let t = 0; t < this.mainTableDataSource.length; t++) {
        this.manipulateNestedTableDataSource(t);
      }
    } else {
      return
    }
  }

  manipulateNestedTableDataSource(index) {
    let test: any = this.mainTableDataSource[index].batchesList;
    this.nestedTableDataSource = this.keepCloning(this.subjectList);
    for (let i = 0; i < test.length; i++) {
      for (let y = 0; y < this.nestedTableDataSource.length; y++) {
        if (test[i].subject_id == this.nestedTableDataSource[y].subject_id) {
          this.nestedTableDataSource[y].uiSelected = true;
          this.nestedTableDataSource[y].selected_teacher = test[i].teacher_id;
          this.nestedTableDataSource[y].isAssigned = test[i].isAssigned;
          this.nestedTableDataSource[y].otherDetails = test[i];
        }
      }
    }
    this.mainTableDataSource[index].batchesList = this.nestedTableDataSource;
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

  messageToast(errorType, errorTitle, errorMeassage) {
    let data = {
      type: errorType,
      title: errorTitle,
      body: errorMeassage
    }
    this.toastCtrl.popToast(data);
  }

  /* Customiized click detection strategy */
  inputClickedCheck(ev) {
    if (ev.target.classList.contains('form-ctrl')) {
      if (ev.target.classList.contains('bsDatepicker')) {
        var nodelist = document.querySelectorAll('.bsDatepicker');
        [].forEach.call(nodelist, (elm) => {
          elm.addEventListener('focusout', function (event) {
            event.target.parentNode.classList.add('has-value');
          });
        });
      }
      else if ((ev.target.classList.contains('form-ctrl')) && !(ev.target.classList.contains('bsDatepicker'))) {
        //document.getElementById(ev.target.id).click();
        ev.target.addEventListener('blur', function (event) {
          if (event.target.value != '') {
            event.target.parentNode.classList.add('has-value');
          } else {
            event.target.parentNode.classList.remove('has-value');
          }
        });
      }
    }
  }

  parseDateFormat(date) {
    return moment(date).format("YYYY-MM-DD")
  }


}
