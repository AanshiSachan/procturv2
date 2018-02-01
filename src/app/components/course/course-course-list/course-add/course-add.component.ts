import { Component, OnInit } from '@angular/core';
import { CourseListService } from '../../../../services/course-services/course-list.service';
import { AppComponent } from '../../../../app.component';
import { document } from '../../../../../assets/imported_modules/ngx-bootstrap/utils/facade/browser';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course-add',
  templateUrl: './course-add.component.html',
  styleUrls: ['./course-add.component.scss']
})
export class CourseAddComponent implements OnInit {

  newCourseAdd: any = {
    master_course_name: '',
    standard_id: '',
  }
  courseDetails: any = {
    course_name: '',
    start_Date: '',
    end_Date: '',
    allow_exam_grades: ''
  };
  subjectListDataSource: any;
  tableRowData: any = {
    checkBox_value: '',
    selected_teacher: '',
  };
  subjectList: any[] = [];
  standardNameList;
  activeTeachers: any;
  dummyArrayOfSubjectList: any[] = [];
  showTable: boolean = false;
  mainArrayForTable: any[] = new Array;
  divCreateNewCourse: boolean = false;

  nestedTableForm: any = {
    course_name: '',
    start_Date: '',
    end_Date: '',
    allow_exam_grades: ''
  };

  nestedTableDataSource: any;


  constructor(
    private apiService: CourseListService,
    private toastCtrl: AppComponent,
    private route: Router
  ) { }

  ngOnInit() {
    this.getAllStandardNameList();
  }

  btnGoClickCreateCourse() {
    if (this.newCourseAdd.master_course_name != "" && this.newCourseAdd.standard_id != "" && this.newCourseAdd.standard_id != -1) {
      this.apiService.getSubjectListOfStandard(this.newCourseAdd.standard_id).subscribe(
        (data: any) => {
          console.log(data);
          if (data.length == 0) {
            let msg = {
              type: "error",
              title: "",
              body: 'No Subjects configured for selected standard'
            }
            this.toastCtrl.popToast(msg);
          } else {
            this.subjectListDataSource = data;
            let rawData = this.addKeyInData(data);
            console.log('Data', rawData);
            document.getElementById("idMasterCourse").setAttribute("readonly", true);
            document.getElementById("idStanadardName").disabled = true;
            this.subjectList = rawData;
            this.getActiveTeacherList();
          }
        },
        error => {
          console.log(error);
          let data = {
            type: "error",
            title: "",
            body: error.error.message
          }
          this.toastCtrl.popToast(data);
        }
      )
    } else {
      let data = {
        type: "error",
        title: "",
        body: "Please Fill Mandatory Fields"
      }
      this.toastCtrl.popToast(data);
    }
  }

  getAllStandardNameList() {
    this.apiService.getStandardListFromServer().subscribe(
      (data: any) => {
        console.log(data);
        this.standardNameList = data;
      },
      error => {
        console.log(error);
      }
    )
  }

  getActiveTeacherList() {
    this.apiService.getTeacherListFromServer().subscribe(
      data => {
        console.log(data);
        this.activeTeachers = data;
      },
      error => {
        console.log(error);
        let data = {
          type: "error",
          title: "",
          body: "Please refresh the page."
        }
        this.toastCtrl.popToast(data);
      }
    )
  }


  onTeacherSelection(event, rowData) {
    if (rowData.selected_teacher != "" && rowData.selected_teacher != undefined && rowData.selected_teacher != null && rowData.selected_teacher != -1) {
      if (rowData.uiSelected == true) {
        this.updateTableDataSourceData(rowData);
      }
      else {
        let warning = {
          type: "warning",
          title: "",
          body: "You haven't selected checkbox."
        }
        this.toastCtrl.popToast(warning);
      }
    }
  }

  updateTableDataSourceData(rowData) {
    let check = false;
    if (this.dummyArrayOfSubjectList.length > 0) {
      for (let i = 0; i < this.dummyArrayOfSubjectList.length; i++) {
        if (this.dummyArrayOfSubjectList[i].subject_id == rowData.subject_id) {
          this.dummyArrayOfSubjectList[i] = rowData;
          check = false;
        } else {
          check = true;
        }
      }
    } else {
      this.dummyArrayOfSubjectList.push(rowData);
    }
    if (check) {
      this.dummyArrayOfSubjectList.push(rowData);
    }
  }

  tableCheckBox(rowDetails, index) {
    if (rowDetails.uiSelected == true) {
      if (rowDetails.selected_teacher != -1 && rowDetails.selected_teacher != '') {
        this.updateTableDataSourceData(rowDetails);
      }
    } else {
      this.dummyArrayOfSubjectList.splice(index, 1);
      console.log('Splice at work', this.dummyArrayOfSubjectList)
    }
  }

  addDataToTable() {
    let seletedRows: any = this.checkIfAnySubjectSelected(this.subjectList);
    if (this.courseDetails.course_name != "" && this.courseDetails.start_Date != "" && this.courseDetails.end_Date != '') {
      if (this.courseDetails.start_Date > this.courseDetails.end_Date) {
        let err = {
          type: "error",
          title: "Date Selection",
          body: "Please provide valid dates."
        }
        this.toastCtrl.popToast(err);
        return
      } else if (seletedRows.length == 0 || this.dummyArrayOfSubjectList.length == 0) {
        let err = {
          type: "error",
          title: "Allocation Error",
          body: "Please specify atleast one subject for the course."
        }
        this.toastCtrl.popToast(err);
        return
      } else {
        this.showTable = true;
        let obj: any = {};
        obj.course_name = this.courseDetails.course_name;
        obj.start_Date = moment(this.courseDetails.start_Date).format("YYYY-MM-DD");
        obj.end_Date = moment(this.courseDetails.end_Date).format("YYYY-MM-DD");
        obj.allow_exam_grades = this.courseDetails.allow_exam_grades;
        obj.subjectListArray = this.keepCloning(this.subjectList);
        this.mainArrayForTable.push(obj);
        this.dummyArrayOfSubjectList = [];
        console.log(this.mainArrayForTable);
        this.clearAllFormsData();
      }
    } else {
      let warning = {
        type: "error",
        title: "Mandatory Fields",
        body: "You haven't filled mandatory details."
      }
      this.toastCtrl.popToast(warning);
    }
  }

  clearAllFormsData() {
    this.courseDetails.course_name = '';
    this.courseDetails.start_Date = '';
    this.courseDetails.end_Date = '';
    this.courseDetails.allow_exam_grades = '';
    let bindData = this.addKeyInData(this.subjectListDataSource);
    this.subjectList = bindData;
  }

  addKeyInData(data) {
    data.forEach(element => {
      element.uiSelected = '';
      element.selected_teacher = '';
    });
    return data;
  }


  submitCourseDetails() {
    let dataToSend = this.constructJsonToSend();
    console.log(dataToSend);
    this.apiService.saveCourseDetails(dataToSend).subscribe(
      res => {
        console.log(res);
        let msg = {
          type: "success",
          title: "Course Creation",
          body: "Couse Creation Successfull."
        }
        this.toastCtrl.popToast(msg);
        this.route.navigateByUrl('/course/courselist');
      },
      error => {
        console.log(error);
        let warning = {
          type: "error",
          title: "Error",
          body: error.error.message
        }
        this.toastCtrl.popToast(warning);
      }
    )
  }

  constructJsonToSend() {
    let obj: any = {};
    obj.master_course = this.newCourseAdd.master_course_name;
    obj.standard_id = this.newCourseAdd.standard_id;
    obj.coursesList = [];
    for (let i = 0; i < this.mainArrayForTable.length; i++) {
      let test: any = {};
      test.course_name = this.mainArrayForTable[i].course_name;
      test.end_date = this.mainArrayForTable[i].end_Date;
      test.start_date = this.mainArrayForTable[i].start_Date;
      if (this.mainArrayForTable[i].allow_exam_grades == true) {
        test.is_exam_grad_feature = 1;
      } else {
        test.is_exam_grad_feature = 0;
      }
      test.batchesList = [];
      let selectedSubjectRow = this.checkIfAnySubjectSelected(this.mainArrayForTable[i].subjectListArray);
      for (let y = 0; y < selectedSubjectRow.length; y++) {
        let trp: any = {};
        trp.batch_name = this.newCourseAdd.master_course_name + '-' + this.mainArrayForTable[i].course_name + '-' + selectedSubjectRow[y].subject_name;
        trp.subject_id = selectedSubjectRow[y].subject_id.toString();
        trp.teacher_id = selectedSubjectRow[y].selected_teacher.toString();
        test.batchesList.push(trp);
      }
      obj.coursesList.push(test);
    }
    console.log(obj);
    return obj;
  }


  clearAddEnquiryDate(str) {
    if (str == "startDatePicker") {
      this.courseDetails.start_Date = "";
    } else {
      this.courseDetails.end_Date = "";
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

  toggleCreateNewSlot() {
    if (this.divCreateNewCourse == false) {
      this.divCreateNewCourse = true;
      document.getElementById('showCloseBtn').style.display = '';
      document.getElementById('showAddBtn').style.display = 'none';
    } else {
      this.divCreateNewCourse = false;
      document.getElementById('showCloseBtn').style.display = 'none';
      document.getElementById('showAddBtn').style.display = '';
    }
  }

  removeRowFromTable(row, i) {
    this.mainArrayForTable.splice(i, 1);
  }
  
  editRowFromTable(row, index) {
    document.getElementById(("show" + index).toString()).classList.add('nestedTableShow');
    document.getElementById(("show" + index).toString()).classList.remove('nestedTableHide');
    this.fillNestedTableData(index);
  }

  fillNestedTableData(index) {
    this.nestedTableForm = {
      course_name: this.mainArrayForTable[index].course_name,
      start_Date: this.mainArrayForTable[index].start_Date,
      end_Date: this.mainArrayForTable[index].end_Date,
      allow_exam_grades: this.mainArrayForTable[index].allow_exam_grades,
    };
    this.nestedTableDataSource = this.mainArrayForTable[index].subjectListArray;
  }

  updateDataOfNestedTable(row, index) {
    let seletedRows: any = this.checkIfAnySubjectSelected(this.nestedTableDataSource);
    if (this.nestedTableForm.course_name != "" && this.nestedTableForm.start_Date != "" && this.nestedTableForm.end_Date != '') {
      if (this.nestedTableForm.start_Date > this.nestedTableForm.end_Date) {
        let err = {
          type: "error",
          title: "Date Selection",
          body: "Please provide valid dates."
        }
        this.toastCtrl.popToast(err);
        return
      } else if (seletedRows.length == 0) {
        let err = {
          type: "error",
          title: "Allocation Error",
          body: "Please specify atleast one subject for the course."
        }
        this.toastCtrl.popToast(err);
        return
      } else {
        let obj: any = {};
        obj.course_name = this.nestedTableForm.course_name;
        obj.start_Date = moment(this.nestedTableForm.start_Date).format("YYYY-MM-DD");
        obj.end_Date = moment(this.nestedTableForm.end_Date).format("YYYY-MM-DD");
        obj.allow_exam_grades = this.nestedTableForm.allow_exam_grades;
        obj.subjectListArray = this.nestedTableDataSource;
        this.mainArrayForTable[index] = obj;
        document.getElementById("show" + index).style.display = 'none';
        console.log('updateArrayMainArrayTable', this.mainArrayForTable)
      }
    } else {
      let warning = {
        type: "error",
        title: "Mandatory Fields",
        body: "You haven't filled mandatory details."
      }
      this.toastCtrl.popToast(warning);
    }

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

}
