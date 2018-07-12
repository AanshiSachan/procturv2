import { Component, OnInit, ElementRef, ViewChild, Pipe, PipeTransform } from '@angular/core';
import { CourseListService } from '../../../../services/course-services/course-list.service';
import { AppComponent } from '../../../../app.component';
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
    standard_id: '-1',
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
  mainArrayForTable: any[] = new Array;
  divCreateNewCourse: boolean = false;

  nestedTableForm: any = {
    course_name: '',
    start_Date: '',
    end_Date: '',
    allow_exam_grades: ''
  };

  nestedTableDataSource: any;
  examGradeFeature: any;
  @ViewChild('standardNameDDn') StandardName: ElementRef;
  @ViewChild('masterCourseInput') MasterCourseDDn: ElementRef;

  constructor(
    private apiService: CourseListService,
    private toastCtrl: AppComponent,
    private route: Router
  ) { }

  ngOnInit() {
    this.examGradeFeature = sessionStorage.getItem('is_exam_grad_feature');
    this.getAllStandardNameList();
    this.toggleCreateNewSlot();
  }

  btnGoClickCreateCourse() {
    if (this.newCourseAdd.master_course_name != "" && this.newCourseAdd.standard_id != "" && this.newCourseAdd.standard_id != -1) {
      this.apiService.getSubjectListOfStandard(this.newCourseAdd.standard_id).subscribe(
        (data: any) => {
          //console.log(data);
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
            this.MasterCourseDDn.nativeElement.setAttribute('readonly', true);
            this.StandardName.nativeElement.disabled = true;
            this.subjectList = rawData;
            this.getActiveTeacherList();
          }
        },
        error => {
          //console.log(error);
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
        this.standardNameList = data;
      },
      error => {
        //console.log(error);
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
        let data = {
          type: "error",
          title: "",
          body: "Please refresh the page."
        }
        this.toastCtrl.popToast(data);
      }
    )
  }

  addDataToTable() {
    debugger
    if (this.courseDetails.course_name != "" && this.courseDetails.start_Date != "" && this.courseDetails.start_Date != null && this.courseDetails.end_Date != '' && this.courseDetails.end_Date != null) {
      if (this.courseDetails.start_Date > this.courseDetails.end_Date) {
        let err = {
          type: "error",
          title: "Date Selection",
          body: "Please provide valid dates."
        }
        this.toastCtrl.popToast(err);
        return
      } else {
        let validateData = this.validateAllFields(this.subjectList);
        if (validateData == false) {
          return;
        }
        let obj: any = {};
        obj.course_name = this.courseDetails.course_name;
        obj.start_Date = moment(this.courseDetails.start_Date).format("YYYY-MM-DD");
        obj.end_Date = moment(this.courseDetails.end_Date).format("YYYY-MM-DD");
        obj.allow_exam_grades = this.courseDetails.allow_exam_grades;
        obj.subjectListArray = this.keepCloning(this.subjectList);
        this.mainArrayForTable.push(obj);
        this.clearAllFormsData();
        this.toggleCreateNewSlot();
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

  validateAllFields(data) {
    let selected: number = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i].uiSelected == true) {
        selected = +1;
        if (data[i].selected_teacher == "" || data[i].selected_teacher == '-1') {
          let err = {
            type: "error",
            title: "Teacher not selected",
            body: "Please specify teacher of subject."
          }
          this.toastCtrl.popToast(err);
          return false;
        }
      }
    }
    if (selected == 0) {
      let err = {
        type: "error",
        title: "Error",
        body: "You have not selected any subject."
      }
      this.toastCtrl.popToast(err);
      return false;
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
    if (dataToSend == false) {
      return;
    };
    this.apiService.saveCourseDetails(dataToSend).subscribe(
      res => {
        let msg = {
          type: "success",
          title: "Course Creation",
          body: "Course Creation Successfull."
        }
        this.toastCtrl.popToast(msg);
        this.route.navigateByUrl('/view/course/courselist');
      },
      error => {
        //console.log(error);
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
        if (selectedSubjectRow[y].selected_teacher == "" || selectedSubjectRow[y].selected_teacher == null || selectedSubjectRow[y].selected_teacher == "-1") {
          let err = {
            type: "error",
            title: "Error",
            body: "Please provide teacher for the subject."
          }
          this.toastCtrl.popToast(err);
          return false;
        } else {
          trp.teacher_id = selectedSubjectRow[y].selected_teacher.toString();
        }
        test.batchesList.push(trp);
      }
      obj.coursesList.push(test);
    }
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
    document.getElementById(("viewComp" + index).toString()).style.display = 'none';
    document.getElementById(("editComp" + index).toString()).style.display = '';
  }

  updateDataOfNestedTable(row, index) {
    if (row.course_name != "" && row.start_Date != "" && row.end_Date != '') {
      if (row.start_Date > row.end_Date) {
        let err = {
          type: "error",
          title: "Date Selection",
          body: "Please provide valid dates."
        }
        this.toastCtrl.popToast(err);
        return
      } else {
        let validateData = this.validateAllFields(row.subjectListArray);
        if (validateData == false) {
          let err = {
            type: "error",
            title: "Allocation Error",
            body: "Please specify atleast one subject for the course."
          }
          this.toastCtrl.popToast(err);
          return;
        }
        let obj: any = {};
        obj.course_name = row.course_name;
        obj.start_Date = moment(row.start_Date).format("YYYY-MM-DD");
        obj.end_Date = moment(row.end_Date).format("YYYY-MM-DD");
        obj.allow_exam_grades = row.allow_exam_grades;
        obj.subjectListArray = row.subjectListArray;
        this.mainArrayForTable[index] = obj;
        document.getElementById("show" + index).style.display = 'none';
        document.getElementById(("viewComp" + index).toString()).style.display = '';
        document.getElementById(("editComp" + index).toString()).style.display = 'none';
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

}

@Pipe({
  name: 'datePipe'
})
export class DateMonthFormatter implements PipeTransform {
  public transform(value) {
    if (value != "" && value != null && value != undefined) {
      return moment(value).format('DD-MMM-YYYY');
    } else {
      return value
    }
  }
}