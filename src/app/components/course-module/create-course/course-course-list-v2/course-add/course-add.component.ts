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
  masterCourseData: any = [];
  schoolModel: boolean = false;
  isLangInstitue: boolean = false;
  selectedCourseID: any = '';
  subjectCodeCharLimit: number = 4;
  examGradeFeature: any;
  courseDetails: any = {
    course_name: '',
    start_Date: '',
    end_Date: '',
    academic_year_id: -1,
    master_course_id: '',
    standard_id: '',
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

  createMasterCourseModel: any = {
    "master_course_name": "",
    "institute_id": sessionStorage.getItem('institute_id'),
    "is_active": "Y",
    "standard_id": '-1',
    "standard_name": ''
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
    this.examGradeFeature = sessionStorage.getItem('is_exam_grad_feature');
    this._auth.institute_type.subscribe(
      res => {
        if (res == "LANG") {
          this.isLangInstitue = true;
        } else {
          this.isLangInstitue = false;
        }
      }
    )
    this.getActiveTeacherList(this.courseDetails.standard_id);
    !this.schoolModel ? this.getMasterCourseData() : '';
    this.getAllStandardSubjectList();
    this.getAcademicYearDetails();
    if (this.selectedCourseID) {
      this.getSelectedCourse(this.selectedCourseID);
    } else {
      this.courseDetails.academic_year_id = '-1';
      this.courseDetails.master_course = this.courseDetails.master_course_name;
    }
    if (sessionStorage.getItem('institute_id') == 102047 + "")
      this.subjectCodeCharLimit = 8;
  }

  getMasterCourseData() {
    this._auth.showLoader();
    this._httpService.getData('/api/v1/master-course/fetch-master-course/' + sessionStorage.getItem('institute_id') + '?is_active=Y').subscribe(
      (res: any) => {
        this._auth.hideLoader();
        this.masterCourseData = res.result;
      },
      (err: any) => {
        this._auth.hideLoader();
        console.log(err);
      }
    )
  }

  getSubjects() {
    if (!this.schoolModel) {
      let stdObj = this.masterCourseData.filter(mc => (mc.master_course_id == this.courseDetails.master_course_id));
      let masterCourseObj = stdObj[0];
      this.courseDetails.master_course_name = masterCourseObj.master_course_name;
      let sub_list = this.standardList.filter(sub => (sub.standard_id == masterCourseObj.standard_id));
      if(sub_list && sub_list.length) {
        this.subjectList = sub_list[0].subject_list;
      }
      this.newSubjectDetails.standard_id = masterCourseObj.standard_id;
      this.getActiveTeacherList(this.courseDetails.standard_id);
    } else {
      let sub_list = this.standardList.filter(sub => (sub.standard_id == this.courseDetails.standard_id));
      this.courseDetails.standard_name = sub_list[0].standard_name;
      this.subjectList = sub_list[0].subject_list;
      this.newSubjectDetails.standard_id = this.courseDetails.standard_id;
      this.getActiveTeacherList(this.courseDetails.standard_id);
    }
    this.manipulateNestedTableDataSource(this.courseDetails.subject_list);
  } 

  getSelectedCourse(id) {
    let url = `/api/v1/courseMaster/fetch-course/${sessionStorage.getItem('institute_id')}/${id}`
    this._httpService.getData(url).subscribe(
      (res: any) => {
        this.courseDetails = res.result;
        this.courseDetails.start_Date = moment(this.courseDetails.start_date).format('YYYY-MM-DD');
        this.courseDetails.end_Date = moment(this.courseDetails.end_date).format('YYYY-MM-DD');
        this.courseDetails.allow_exam_grades = (this.courseDetails.is_exam_grad_feature == '1') ? true : false;
        // this.subjectList = res.result.subject_list;
        // this.getMetaDataForTable(this.courseDetails);
        // this.dummyArray.push("Selected Course");
        if (this.selectedCourseID) {
          setTimeout(() => {
            this.getSubjects();
          }, 2000);
        }
        // this.manipulateNestedTableDataSource(this.courseDetails.subject_list);
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
          nestedTableDataSource[y].selected_teacher = String(test[i].teacher_id);
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
          if (!this.selectedCourseID) {
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
          } else {
            this.subjectList[i].allowedTeacher = this.activeTeachers;
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
    console.log(obj);
    obj.selected_teacher == 'more' ? (obj.allowedTeacher = this.activeTeachers) : '';
  }

  validateAllFields(data) {
    console.log(data);
    let selected: number = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i].uiSelected == true) {
        selected = +1;
        if (data[i].selected_teacher == "" || data[i].selected_teacher == '-1' || data[i].selected_teacher == 'more') {
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
    this.mainArrayForTable = [];
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
        if (this.courseDetails.academic_year_id == '-1') {
          this._msgService.showErrorMessage('error', '', 'Please Select Academic Year!');
          return
        }
        if(!CommonUtils.validateSpecialCharacters(this.courseDetails.course_name)) {
          let msg = this.schoolModel ? 'Special characters are not allowed in section Name' : 'Special characters are not allowed in course Name';
          this._msgService.showErrorMessage('error', '', msg);
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
    if (this.schoolModel) {
      obj.standard_id = this.courseDetails.standard_id;
    } else {
      obj.master_course_id = this.courseDetails.master_course_id;
    }
    obj.inst_id = sessionStorage.getItem('institute_id');
    // obj.coursesList = [];
    for (let i = 0; i < this.mainArrayForTable.length; i++) {
      console.log(this.mainArrayForTable);
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

      if (this.mainArrayForTable[i].allow_exam_grades == true) {
        obj.is_exam_grad_feature = 1;
      } else {
        obj.is_exam_grad_feature = 0;
      }
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
          trp.batch_name = this.courseDetails.standard_name + '-' + this.mainArrayForTable[i].course_name + '-' + selectedSubjectRow[y].subject_name;
        } else {
          trp.batch_name = this.courseDetails.master_course_name + '-' + this.mainArrayForTable[i].course_name + '-' + selectedSubjectRow[y].subject_name;
        }
        if(this.selectedCourseID) {
          if (selectedSubjectRow[y].hasOwnProperty('otherDetails')) {
            trp.batch_id = selectedSubjectRow[y].otherDetails.batch_id.toString();
          } else {
            trp.batch_id = '0';
          }
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
    this._auth.showLoader();
    let url = `/api/v1/courseMaster/update-course/${this.selectedCourseID}`
    this._httpService.putData(url, dataToSend).subscribe(
      res => {
        this._auth.hideLoader();
        this.router.navigateByUrl('/view/course/create/courselist');
        let msg = this.schoolModel ? 'Section' : 'Course';
        this._msgService.showErrorMessage('success', '', msg + ' updated successfully.');

      },
      err => {
        this._auth.hideLoader();
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
    } else if (!CommonUtils.validateSpecialCharacters(this.newSubjectDetails.subject_name)) {
      this._msgService.showErrorMessage('error', '', 'Special characters are not allowed in subject Name');
      return
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
          this.standardList = [];
          this.getAllStandardSubjectList();
          if(this.selectedCourseID) {
            this.getSelectedCourse(this.selectedCourseID);
          }
        },
        err => {
          this._msgService.showErrorMessage('error', '', err.error.message);
        })
    }
  }

  getAllStandardSubjectList() {
    if (!this.standardList.length) {
      let url = "/api/v1/standards/standard-subject-list/" + sessionStorage.getItem('institute_id') + '?is_active=Y&is_subject_required=true';
      this._httpService.getData(url).subscribe(
        (res: any) => {
          this.standardList = res.result;
          if (this.courseDetails.standard_id != '') {
            let sub_list = this.standardList.filter(sub => (sub.standard_id == this.courseDetails.standard_id));
            this.subjectList = sub_list[0].subject_list;
            this.newSubjectDetails.standard_id = this.courseDetails.standard_id;
            this.manipulateNestedTableDataSource(this.courseDetails.subject_list);
            this.getActiveTeacherList(this.courseDetails.standard_id);
          }
        },
        (error: any) => {
          this._msgService.showErrorMessage('error', '', error.error.message)
        }
      )
    }
  }



  saveMasterC() {
    // this.editMasterC ? this.updateMasterCourse() : this.createMasterCourse();
    this.createMasterCourse();
  }

  checkMasterCourseVal() {
    if (CommonUtils.isEmpty(this.createMasterCourseModel.master_course_name) || this.createMasterCourseModel.standard_id == '-1') {
      this._msgService.showErrorMessage('error', '', 'Please fill all mandatory fields');
      return false;
    }
    return true;
  }

  createMasterCourse() {
    if (this.checkMasterCourseVal()) {
      this._auth.showLoader();
      this._httpService.postData('/api/v1/master-course/create', this.createMasterCourseModel).subscribe(
        (res: any) => {
          this._auth.hideLoader();
          this._msgService.showErrorMessage('success', '', 'Master course added successfully');
          this.getMasterCourseData();
          this.clearMasterCourse();
          $('#courseModal').modal('hide');
        },
        (err: any) => {
          this._auth.hideLoader();
          this._msgService.showErrorMessage('error', '', err.error.message);
        }
      )
    }
  }

  clearMasterCourse() {
    // this.editMasterC = false;
    this.createMasterCourseModel = {
      "master_course_name": "",
      "institute_id": sessionStorage.getItem('institute_id'),
      "is_active": "Y",
      "standard_id": '-1',
      "standard_name": ''
    }
  }

  deleteSubjectRow(row, mainTableIndex) {
    let count = this.subjectList.filter(course => course.uiSelected)
    let msg = "Are you sure you want to delete?";
    if (count.length == 1) {
      msg = "Are you sure you want to delete? Course will be deleted as you are deleting last subject under this course";
    }
    if (confirm(msg)) {
      if (row.hasOwnProperty('otherDetails')) {
        this._auth.showLoader();
        this._httpService.putData("/api/v1/courseMaster/deleteSubject/" + row.otherDetails.batch_id , '').subscribe(
          data => {
            row.isAssigned = 'Y';
            this._auth.hideLoader();
            this.subjectList[mainTableIndex].uiSelected = false;
            delete this.subjectList[mainTableIndex].otherDetails;
            this.subjectList[mainTableIndex].selected_teacher = '-1';
            this.checkIfAnySelectedRowExist(this.subjectList, mainTableIndex);
            this._msgService.showErrorMessage('success', '', 'Subject removed from course');
          },
          error => {
            this._auth.hideLoader();
            this._msgService.showErrorMessage('error', '', error.error.message);
          }
        )
      }
    }
  }

  checkIfAnySelectedRowExist(data, mainTableIndex) {
    let uiSelctedData = false;
    for (let i = 0; i < data.length; i++) {
      if (data[i].uiSelected) {
        uiSelctedData = true;
        break;
      }
    }
    if (uiSelctedData == false) {
      this.subjectList.splice(mainTableIndex, 1);
    }
  }

}
