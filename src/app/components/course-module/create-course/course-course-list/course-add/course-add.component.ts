import { Component, ElementRef, OnInit, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { HttpService } from '../../../../../services/http.service';
import { AppComponent } from '../../../../../app.component';
import { CourseListService } from '../../../../../services/course-services/course-list.service';
import { AuthenticatorService } from './../../../../../services/authenticator.service';

@Component({
  selector: 'app-course-add',
  templateUrl: './course-add.component.html',
  styleUrls: ['./course-add.component.scss']
})
export class CourseAddComponent implements OnInit {

  @ViewChild('standardNameDDn', { static: false }) StandardName: ElementRef;
  @ViewChild('masterCourseInput', { static: false }) MasterCourseDDn: ElementRef;

  newCourseAdd: any = {
    master_course_name: '',
    standard_id: '-1',
  }
  courseDetails: any = {
    course_name: '',
    start_Date: '',
    end_Date: '',
    academic_year_id: '',
    allow_exam_grades: ''
  };

  tableRowData: any = {
    checkBox_value: '',
    selected_teacher: '',
  };

  nestedTableForm: any = {
    course_name: '',
    start_Date: '',
    end_Date: '',
    allow_exam_grades: ''
  };
  academicList: any = [];
  subjectList: any[] = [];
  dummyArrayOfSubjectList: any[] = [];
  mainArrayForTable: any[] = new Array;
  standardNameList: any;
  activeTeachers: any;
  subjectListDataSource: any;
  nestedTableDataSource: any;
  examGradeFeature: any;
  divCreateNewCourse: boolean = false;
  schoolModel: boolean = false;
  defaultAY: string='';
  defaultAYStartDate: string;
  defaultAYEndDate: string;

  constructor(
    private apiService: CourseListService,
    private toastCtrl: AppComponent,
    private auth: AuthenticatorService,
    private route: Router,
    private httpService: HttpService
  ) {
    // changes by Nalini - to handle school model conditions
    this.auth.schoolModel.subscribe(
      res => {
        this.schoolModel = false;
        if (res) {
          this.schoolModel = true;
        }
      }
    )
  }

  ngOnInit() {
    this.examGradeFeature = sessionStorage.getItem('is_exam_grad_feature');
    this.getAllStandardNameList();
    this.toggleCreateNewSlot();
    this.getAcademicYearDetails();
  }

  // changes by Nalini - to check validation for add course/section
  checkAddCourseValidation() {
    let result = this.schoolModel ? (this.newCourseAdd.standard_id != "" && this.newCourseAdd.standard_id != -1) : (this.newCourseAdd.master_course_name != "" && this.newCourseAdd.standard_id != "" && this.newCourseAdd.standard_id != -1);
    return result;
  }

  setStartAdEndDate(row) {
    for (let acad of this.academicList) {
      if (row == null) {
        if (acad.default_academic_year == 1) {
          this.defaultAY=acad.inst_acad_year_id;
          this.defaultAYStartDate=moment(acad.start_date).format('YYYY-MM-DD');
          this.defaultAYEndDate=moment(acad.end_date).format('YYYY-MM-DD');
          this.courseDetails.academic_year_id = acad.inst_acad_year_id;
          this.courseDetails.start_Date = moment(acad.start_date).format('YYYY-MM-DD');
          this.courseDetails.end_Date = moment(acad.end_date).format('YYYY-MM-DD');
          break;
        }
      }
      else if (acad.inst_acad_year_id == row.academic_year_id) {
        row.start_Date = moment(acad.start_date).format('YYYY-MM-DD');
        row.end_Date = moment(acad.end_date).format('YYYY-MM-DD');
        break;
      }
      else if (row.academic_year_id == '-1') {
        row.start_Date = ''
        row.end_Date = ''
        break;
      }
    }
  }

  btnGoClickCreateCourse() {
    if (this.checkAddCourseValidation()) {
      for (let i = 0; i < this.standardNameList.length; i++) {
        if (this.standardNameList[i].standard_id == this.newCourseAdd.standard_id) {
          this.subjectListDataSource = this.standardNameList[i].subject_list;
        }
      }
      // this.apiService.getSubjectListOfStandard(this.newCourseAdd.standard_id).subscribe(
      //   (data: any) => {
      //console.log(data);
      if (this.subjectListDataSource.length == 0) {
        let msg = {
          type: "error",
          title: "",
          body: 'No Subjects configured for selected standard'
        }
        this.toastCtrl.popToast(msg);
      } else {
        this.subjectListDataSource = this.subjectListDataSource;
        let rawData = this.addKeyInData(this.subjectListDataSource);
        if (!this.schoolModel) {
          this.MasterCourseDDn.nativeElement.setAttribute('readonly', true);
        }
        this.StandardName.nativeElement.disabled = true;
        this.subjectList = rawData;
        this.getActiveTeacherList(this.newCourseAdd.standard_id);
      }
      // },
      error => {
        //console.log(error);
        let data = {
          type: "error",
          title: "",
          body: error.error.message
        }
        this.toastCtrl.popToast(data);
      }
      // )
    } else {
      let data = {
        type: "error",
        title: "",
        body: "Please Fill Mandatory Fields"
      }
      this.toastCtrl.popToast(data);
    }
  }

  getAcademicYearDetails() {
    this.academicList = [];
    this.apiService.getAcadYear().subscribe(
      res => {
        this.academicList = res;
        // this.setStartAdEndDate(null);
      },
      err => {
      }
    )
  }

  getAllStandardNameList() {
    this.apiService.getStandardListFromServer().subscribe(
      (data: any) => {
        this.standardNameList = data.result;
      },
      error => {
        //console.log(error);
      }
    )
  }

  getActiveTeacherList(standard_id) {
    this.auth.showLoader();
    this.httpService.getData('/api/v1/teachers/fetch-teacher/' + sessionStorage.getItem('institute_id') + "?standard_id=" + standard_id + "&subject_id=&is_active=Y&is_std_sub_required=true").subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.activeTeachers = res.result;
        for (let i = 0; i < this.subjectList.length; i++) {
          this.subjectList[i].allowedTeacher = [];
          let is_teacher_exit: boolean = true;
          this.activeTeachers.filter(teacher => {
            if (teacher.standard_subject_list && teacher.standard_subject_list.length) {
              is_teacher_exit=false;
              this.subjectList[i].allowedTeacher.push(teacher);
              let is_more_option_exit: boolean = true;
              for (let data of this.subjectList[i].allowedTeacher) {
                if (data.teacher_id == 'more') {
                  is_more_option_exit = false
                  break;
                }
              }
              if (is_more_option_exit) {
                this.subjectList[i].allowedTeacher.push({
                  "is_active": "Y",
                  "standard_subject_list": [],
                  "teacher_email": null,
                  "teacher_id": "more",
                  "teacher_name": "Click Here to view more faculties",
                  "teacher_phone": "7503959545"
                })
              }
            }
          })
          if(is_teacher_exit){
            this.subjectList[i].allowedTeacher.push({
              "is_active": "Y",
              "standard_subject_list": [],
              "teacher_email": null,
              "teacher_id": "more",
              "teacher_name": "Click Here to view more faculties",
              "teacher_phone": "7503959545"
            })
          }
        }
      },
      err => {
        this.auth.hideLoader();
        console.log(err);
      }
    )
  }

  checkMoreOption(obj) {
    obj.selected_teacher == 'more' ? (obj.allowedTeacher = this.activeTeachers) : '';
  }
  addDataToTable() {
    if (this.courseDetails.course_name != "" && this.courseDetails.start_Date != ""
      && this.courseDetails.start_Date != null && this.courseDetails.end_Date != ''
      && this.courseDetails.end_Date != null) {
      if (this.courseDetails.start_Date > this.courseDetails.end_Date) {
        let err = {
          type: "error",
          title: "Date Selection",
          body: "Please enter valid dates."
        }
        this.toastCtrl.popToast(err);
        return
      } else {
        let validateData = this.validateAllFields(this.subjectList);
        if (validateData == false) {
          return;
        }
        if(this.courseDetails.academic_year_id && this.courseDetails.academic_year_id=='' ){
          let err = {
            type: "error",
            title: "",
            body: "Please Select Academic Year!"
          }
          this.toastCtrl.popToast(err);
          return
        }
        let obj: any = {};
        obj.course_name = this.courseDetails.course_name;
        obj.start_Date = moment(this.courseDetails.start_Date).format("YYYY-MM-DD");
        obj.end_Date = moment(this.courseDetails.end_Date).format("YYYY-MM-DD");
        obj.academic_year_id = this.courseDetails.academic_year_id;
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
        title: '',
        body: "You have not selected any subject."
      }
      this.toastCtrl.popToast(err);
      return false;
    }
  }

  clearAllFormsData() {
    this.courseDetails = {
      course_name: '',
      start_Date: this.defaultAYStartDate,
      end_Date: this.defaultAYEndDate,
      academic_year_id: this.defaultAY,
      allow_exam_grades: ''
    };
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

    if (!this.auth.isRippleLoad.getValue()) {
      this.auth.showLoader();
      this.apiService.saveCourseDetails(dataToSend).subscribe(
        res => {
          let msg_text = this.schoolModel ? 'Section created successfully' : 'Course created successfully';
          this.auth.hideLoader();
          let msg = {
            type: "success",
            title: "",
            body: msg_text
          }
          this.toastCtrl.popToast(msg);
          this.route.navigateByUrl('/view/course/create/courselist');
        },
        error => {
          this.auth.hideLoader();
          let warning = {
            type: "error",
            title: '',
            body: error.error.message
          }
          this.toastCtrl.popToast(warning);
        }
      )
    }
  }

  constructJsonToSend() {
    let obj: any = {};
    if (this.schoolModel) {
      for (let i = 0; i < this.standardNameList.length; i++) {
        if (this.standardNameList[i].standard_id == this.newCourseAdd.standard_id) {
          this.newCourseAdd.master_course_name = this.standardNameList[i].standard_name;
          break;
        }
      }
    }
    obj.master_course = this.newCourseAdd.master_course_name;
    obj.standard_id = this.newCourseAdd.standard_id;
    obj.coursesList = [];
    for (let i = 0; i < this.mainArrayForTable.length; i++) {
      let test: any = {};
      test.academic_year_id = this.mainArrayForTable[i].academic_year_id;
      test.course_name = this.mainArrayForTable[i].course_name;

      if (this.mainArrayForTable[i].start_Date != "" && this.mainArrayForTable[i].start_Date != null && this.mainArrayForTable[i].start_Date != "Invalid date") {
        test.start_date = moment(this.mainArrayForTable[i].start_Date).format('YYYY-MM-DD');
      } else {
        this.toastCtrl.popToast({ type: "error", title: "Date Error", body: "Please enter start date" });
        return false;
      }

      if (this.mainArrayForTable[i].end_Date != "" && this.mainArrayForTable[i].end_Date != null && this.mainArrayForTable[i].end_Date != "Invalid date") {
        test.end_date = moment(this.mainArrayForTable[i].end_Date).format('YYYY-MM-DD');
      } else {
        this.toastCtrl.popToast({ type: "error", title: "Date Error", body: "Please enter end date" });
        return false;
      }

      if (this.mainArrayForTable[i].allow_exam_grades == true) {
        test.is_exam_grad_feature = 1;
      } else {
        test.is_exam_grad_feature = 0;
      }
      test.batchesList = [];
      let selectedSubjectRow = this.checkIfAnySubjectSelected(this.mainArrayForTable[i].subjectListArray);
      if (selectedSubjectRow.length == 0) {
        let err = {
          type: "error",
          title: '',
          body: "You have not selected any subject"
        }
        this.toastCtrl.popToast(err);
        return false;
      }
      for (let y = 0; y < selectedSubjectRow.length; y++) {
        let trp: any = {};
        if (this.schoolModel) {
          trp.batch_name = this.newCourseAdd.master_course_name + '-' + this.mainArrayForTable[i].course_name + '-' + selectedSubjectRow[y].subject_name;
        } else {
          trp.batch_name = this.newCourseAdd.master_course_name + '-' + this.mainArrayForTable[i].course_name + '-' + selectedSubjectRow[y].subject_name;
        }
        trp.subject_id = selectedSubjectRow[y].subject_id.toString();
        if (selectedSubjectRow[y].selected_teacher == "" || selectedSubjectRow[y].selected_teacher == null || selectedSubjectRow[y].selected_teacher == "-1") {
          let err = {
            type: "error",
            title: '',
            body: "Please enter teacher for the subject."
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
      // changes by Nalini - to handle school model conditions
      if (!this.schoolModel) {
        document.getElementById('showCloseBtn') ? document.getElementById('showCloseBtn').style.display = '' : '';
        document.getElementById('showAddBtn') ? document.getElementById('showAddBtn').style.display = 'none' : '';
      }
    } else {
      this.divCreateNewCourse = false;
      // changes by Nalini - to handle school model conditions
      if (!this.schoolModel) {
        document.getElementById('showCloseBtn') ? document.getElementById('showCloseBtn').style.display = 'none' : '';
        document.getElementById('showAddBtn') ? document.getElementById('showAddBtn').style.display = '' : '';
      }
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
          body: "Please enter valid dates."
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
      return moment(value).format('DD-MM-YYYY');
    } else {
      return value
    }
  }
}
