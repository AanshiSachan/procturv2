import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../../../services/http.service';
import * as moment from 'moment';
import { AuthenticatorService } from '../../../../../services/authenticator.service';
import { MessageShowService } from '../../../../../services/message-show.service';
import { ActivatedRoute, Router } from '@angular/router';
import CommonUtils from '../../../../../utils/commonUtils';
declare var $;

@Component({
  selector: 'app-course-add',
  templateUrl: './course-add.component.html',
  styleUrls: ['./course-add.component.scss']
})
export class CourseAddComponent implements OnInit {
  academicList: any = [];
  subjectList: any = [];
  activeTeachers: any = [];
  mainArrayForTable: any = [];
  standardList: any = [];
  schoolModel: boolean = false;
  isLangInstitue: boolean = false;
  selectedCourseID: any = '';
  courseDetails: any = {
    course_name: '',
    start_Date: '',
    end_Date: '',
    academic_year_id: '',
    master_course_id: '',
    inst_id: sessionStorage.getItem('institute_id')
  };
  newSubjectDetails: any = {
    is_active: "Y",
    standard_id: "-1",
    subject_name: '',
    subject_code: '',
    is_optional: false,
    total_marks: '',
    passing_marks: ''
  }

  constructor(
    private _httpService: HttpService,
    private _auth: AuthenticatorService,
    private _msgService: MessageShowService,
    private routeParam: ActivatedRoute,
    private router: Router
  ) {
    this.routeParam.params.subscribe(params => {
      this.selectedCourseID = params['id'];
    });
  }

  ngOnInit(): void {
    this.schoolModel = this._auth.schoolModel.getValue();
    this._auth.institute_type.subscribe(
      res => {
        if (res == "LANG") {
          this.isLangInstitue = true;
        } else {
          this.isLangInstitue = false;
        }
      }
    )
    this.courseDetails = JSON.parse(sessionStorage.getItem('cretaCourse'));
    let sub_list = JSON.parse(sessionStorage.getItem('subjectList'));
    this.subjectList = sub_list.subject_list;
    this.getActiveTeacherList(this.courseDetails.standard_id);
    console.log(this.subjectList);
    // sessionStorage.removeItem('cretaCourse');
    this.getAcademicYearDetails();
    if (this.selectedCourseID) {
      this.getSelectedCourse(this.selectedCourseID);
    }
  }

  getSelectedCourse(id) {
    let url = `/api/v1/courseMaster/fetch-course/${sessionStorage.getItem('institute_id')}/${id}`
    this._httpService.getData(url).subscribe(
      (res: any) => {
        this.courseDetails = res.result;
        this.courseDetails.start_Date = moment(this.courseDetails.start_date).format('YYYY-MM-DD');
        this.courseDetails.end_Date = moment(this.courseDetails.end_date).format('YYYY-MM-DD');
        // this.subjectList = res.result.subject_list;
        // this.getMetaDataForTable(this.courseDetails);
        // this.dummyArray.push("Selected Course");
        this.manipulateNestedTableDataSource(this.courseDetails.subject_list);
      },
      error => {
        //console.log(error);
        this._msgService.showErrorMessage('error', '', error.error.message);
      }
    )
  }

  manipulateNestedTableDataSource(data) {
    let test: any = data;
    let nestedTableDataSource = this.keepCloning(this.subjectList);
    for (let i = 0; i < test.length; i++) {
      for (let y = 0; y < nestedTableDataSource.length; y++) {
        if (test[i].subject_id == nestedTableDataSource[y].subject_id) {
          nestedTableDataSource[y].uiSelected = true;
          nestedTableDataSource[y].selected_teacher = test[i].teacher_id;
          nestedTableDataSource[y].isAssigned = test[i].isAssigned;
          nestedTableDataSource[y].otherDetails = test[i];
        }
      }
    }
    this.subjectList = nestedTableDataSource;
  }


  getAcademicYearDetails() {
    this.academicList = [];
    this._httpService.getData('/api/v1/academicYear/all/' + sessionStorage.getItem('institute_id')).subscribe(
      res => {
        this.academicList = res;
      },
      err => {
      }
    )
  }

  getActiveTeacherList(standard_id) {
    this._auth.showLoader();
    this._httpService.getData('/api/v1/teachers/fetch-teacher/' + sessionStorage.getItem('institute_id') + "?standard_id=" + standard_id + "&subject_id=&is_active=Y&is_std_sub_required=true").subscribe(
      (res: any) => {
        this._auth.hideLoader();
        this.activeTeachers = res.result;
        for (let i = 0; i < this.subjectList.length; i++) {
          this.subjectList[i].allowedTeacher = [];
          let is_teacher_exit: boolean = true;
          this.activeTeachers.filter(teacher => {
            if (teacher.standard_subject_list && teacher.standard_subject_list.length) {
              is_teacher_exit = false;
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
          if (is_teacher_exit) {
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
        this._auth.hideLoader();
        console.log(err);
      }
    )
  }

  setStartAdEndDate(row) {
    for (let acad of this.academicList) {
      if (row == null) {
        if (acad.default_academic_year == 1) {
          // this.defaultAY=acad.inst_acad_year_id;
          // this.defaultAYStartDate=moment(acad.start_date).format('YYYY-MM-DD');
          // this.defaultAYEndDate=moment(acad.end_date).format('YYYY-MM-DD');
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

  checkMoreOption(obj) {
    obj.selected_teacher == 'more' ? (obj.allowedTeacher = this.activeTeachers) : '';
  }

  validateAllFields(data) {
    console.log(data);
    let selected: number = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i].uiSelected == true) {
        selected = +1;
        if (data[i].selected_teacher == "" || data[i].selected_teacher == '-1') {
          this._msgService.showErrorMessage('error', '', 'Please specify teacher of subject.');
          return false;
        }
      }
    }
    if (selected == 0) {
      this._msgService.showErrorMessage('error', '', 'You have not selected any subject.');
      return false;
    }
  }

  addDataToTable() {
    if (this.courseDetails.course_name != "" && this.courseDetails.start_Date != ""
      && this.courseDetails.start_Date != null && this.courseDetails.end_Date != ''
      && this.courseDetails.end_Date != null) {
      if (this.courseDetails.start_Date > this.courseDetails.end_Date) {
        this._msgService.showErrorMessage('error', '', 'Please enter valid dates');
        return
      } else {
        let validateData = this.validateAllFields(this.subjectList);
        if (validateData == false) {
          return;
        }
        if (this.courseDetails.academic_year_id && this.courseDetails.academic_year_id == '') {
          this._msgService.showErrorMessage('error', '', 'Please Select Academic Year!');
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
        (!this.selectedCourseID) ? this.submitCourseDetails() : this.updateEditedDetails();
      }
    } else {
      this._msgService.showErrorMessage('error', '', "You haven't filled mandatory details.");
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

  submitCourseDetails() {
    let dataToSend = this.constructJsonToSend();
    if (dataToSend == false) {
      return;
    };

    if (!this._auth.isRippleLoad.getValue()) {
      this._auth.showLoader();
      this._httpService.postData('/api/v1/courseMaster/create-course', dataToSend).subscribe(
        res => {
          let msg_text = this.schoolModel ? 'Section created successfully' : 'Course created successfully';
          this._auth.hideLoader();
          this._msgService.showErrorMessage('success', '', msg_text);
          this.router.navigateByUrl('/view/course/create/courselist');
        },
        error => {
          this._auth.hideLoader();
          this._msgService.showErrorMessage('error', '', error.error.message);
        }
      )
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

  constructJsonToSend() {
    let obj: any = {};
    // if (this.schoolModel) {
    //   for (let i = 0; i < this.standardNameList.length; i++) {
    //     if (this.standardNameList[i].standard_id == this.newCourseAdd.standard_id) {
    //       this.newCourseAdd.master_course_name = this.standardNameList[i].standard_name;
    //       break;
    //     }
    //   }
    // }
    obj.master_course_id = this.courseDetails.master_course_id;
    obj.inst_id = sessionStorage.getItem('institute_id');
    // obj.standard_id = this.courseDetails.standard_id;
    // obj.coursesList = [];
    for (let i = 0; i < this.mainArrayForTable.length; i++) {
      let test: any = {};
      obj.academic_year_id = this.mainArrayForTable[i].academic_year_id;
      obj.course_name = this.mainArrayForTable[i].course_name;

      if (this.mainArrayForTable[i].start_Date != "" && this.mainArrayForTable[i].start_Date != null && this.mainArrayForTable[i].start_Date != "Invalid date") {
        obj.start_date = moment(this.mainArrayForTable[i].start_Date).format('YYYY-MM-DD');
      } else {
        this._msgService.showErrorMessage('error', '', 'Please enter start date');
        return false;
      }

      if (this.mainArrayForTable[i].end_Date != "" && this.mainArrayForTable[i].end_Date != null && this.mainArrayForTable[i].end_Date != "Invalid date") {
        obj.end_date = moment(this.mainArrayForTable[i].end_Date).format('YYYY-MM-DD');
      } else {
        this._msgService.showErrorMessage('error', '', 'Please enter end date');
        return false;
      }

      // if (this.mainArrayForTable[i].allow_exam_grades == true) {
      //   obj.is_exam_grad_feature = 1;
      // } else {
      //   obj.is_exam_grad_feature = 0;
      // }
      obj.subject_list = [];
      let selectedSubjectRow = this.checkIfAnySubjectSelected(this.mainArrayForTable[i].subjectListArray);
      console.log(selectedSubjectRow);
      if (selectedSubjectRow.length == 0) {
        this._msgService.showErrorMessage('error', '', 'You have not selected any subject');
        return false;
      }
      for (let y = 0; y < selectedSubjectRow.length; y++) {
        let trp: any = {};
        if (this.schoolModel) {
          trp.batch_name = this.courseDetails.master_course_name + '-' + this.mainArrayForTable[i].course_name + '-' + selectedSubjectRow[y].subject_name;
        } else {
          trp.batch_name = this.courseDetails.master_course_name + '-' + this.mainArrayForTable[i].course_name + '-' + selectedSubjectRow[y].subject_name;
        }
        trp.subject_id = selectedSubjectRow[y].subject_id.toString();
        if (selectedSubjectRow[y].selected_teacher == "" || selectedSubjectRow[y].selected_teacher == null || selectedSubjectRow[y].selected_teacher == "-1") {
          this._msgService.showErrorMessage('error', '', 'Please enter teacher for the subject.');
          return false;
        } else {
          trp.teacher_id = selectedSubjectRow[y].selected_teacher.toString();
        }
        obj.subject_list.push(trp);
      }
    }
    return obj;
  }

  updateEditedDetails() {
    let dataToSend: any = this.constructJsonToSend();
    if (dataToSend == false) {
      return
    }

    // if (this.jsonVar.callApi) {
    // this.jsonVar.callApi = false;
    let url = `/api/v1/courseMaster/update-course/${this.selectedCourseID}`
    this._httpService.putData(url, dataToSend).subscribe(
      res => {
        this.router.navigateByUrl('/view/course/create/courselist');
        let msg = this.schoolModel ? 'Section' : 'Course';
        this._msgService.showErrorMessage('success', '', msg + ' updated successfully.');

      },
      err => {
        //console.log(err);
        this._msgService.showErrorMessage('error', '', err.error.message);
      }
    )
    // }
  }

  validateUserInput() {
    if (this.newSubjectDetails.standard_id == '-1') {
      this._msgService.showErrorMessage('error', '', "Please select standard!");
      return false;
    }
    if (CommonUtils.isEmpty(this.newSubjectDetails.subject_name)) {
      this._msgService.showErrorMessage('error', '', "Please enter subject name!");
      return false;
    }
    if (!this.isLangInstitue && CommonUtils.isEmpty(this.newSubjectDetails.subject_code)) {
      this._msgService.showErrorMessage('error', '', "Please enter subject code!");
      return false;
    }
    return this.validateSchoolModelField();
  }
  validateSchoolModelField() {
    if (this.schoolModel) {
      if (Number(this.newSubjectDetails.total_marks) <= 0) {
        this._msgService.showErrorMessage('error', '', 'Please enter total marks!');
        return false;
      }
      if (Number(this.newSubjectDetails.passing_marks <= 0)) {
        let data = {
          type: "error",
          title: "",
          body: ""
        }
        this._msgService.showErrorMessage('error', '', "Total marks can't be less than passing marks!");
        return false;
      }
      if (Number(this.newSubjectDetails.total_marks) < Number(this.newSubjectDetails.passing_marks)) {
        this._msgService.showErrorMessage('error', '', "Total marks can't be less than passing marks!");
        return false;
      }
    }
    return true;
  }

  successMsg() {
    let msg = "";
    if (this.isLangInstitue) {
      msg = "Course created successfully!";
    } else {
      msg = "Subject created successfully";
    }
    this._msgService.showErrorMessage('success', '', msg);
    $('#addUpdateSubjectdialog').modal('hide');
    // this.getAllSubjectList();
    this.clearSubData();
  }

  clearSubData() {
    this.newSubjectDetails = {
      is_active: "Y",
      standard_id: "-1",
      subject_name: '',
      subject_code: '',
      is_optional: false,
      total_marks: '',
      passing_marks: ''
    }
  }

  preparedSubjectRequestPayload(): object {
    let obj: any = {
      is_active: (this.newSubjectDetails.is_active == true || this.newSubjectDetails.is_active == "Y") ? "Y" : "N",
      standard_id: this.newSubjectDetails.standard_id,
      subject_name: this.newSubjectDetails.subject_name,
    }
    if (!this.isLangInstitue) {
      obj.subject_code = this.newSubjectDetails.subject_code.toUpperCase();
    }
    if (this.schoolModel) {
      obj.is_optional = (this.newSubjectDetails.is_optional) ? 'Y' : 'N';
      obj.final_marks = this.newSubjectDetails.total_marks;
      obj.passing_marks = this.newSubjectDetails.passing_marks;
    }
    return obj;
  }

  addNewSubject() {
    if (this.validateUserInput()) {
      this._httpService.postData('/api/v1/subjects', this.preparedSubjectRequestPayload()).subscribe(
        res => {
          this.successMsg();
        },
        err => {
          this._msgService.showErrorMessage('error', '', err.error.message);
        })
    }
  }

  getAllStandardSubjectList() {
    if (!this.standardList.length) {
      let url = `/api/v1/standards/all/ ${sessionStorage.getItem('institute_id')}?active=Y`;
      this._httpService.getData(url).subscribe(
        res => {
          console.log("getAllStandardSubjectList", res);
          this.standardList = res;
        },
        (error: any) => {
          this._msgService.showErrorMessage('error', '', error.error.message)
        }
      )
    }
  }
}
