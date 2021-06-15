import { Component, OnInit } from '@angular/core';
import { MessageShowService } from '../../../../services/message-show.service';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { HttpService } from '../../../../services/http.service';
import CommonUtils from '../../../../utils/commonUtils';
import { CourseListService } from '../../../../services/course-services/course-list.service';
declare var $;

@Component({
  selector: 'app-course-course-list-v2',
  templateUrl: './course-course-list-v2.component.html',
  styleUrls: ['./course-course-list-v2.component.scss']
})
export class CourseCourseListV2Component implements OnInit {
  institute_id: any = sessionStorage.getItem('institute_id');
  master_course_id: any = '-1';
  masterCourseData: any = [];
  courseData: any = [];
  standardList: any = [];
  editMasterC: boolean = false;
  schoolModel: boolean = false;
  courseDetails: any;
  addStudentPopUp: boolean = false;
  showTable: boolean = false;
  searchData: any = "";
  studentListDataSource: any = [];
  feeTemplateDataSource: any = [];
  studentList: any = [];
  allChecked: boolean = false;
  alertBox: boolean = true;
  delete_unpaid_fee: boolean = false;
  createMasterCourseModel: any = {
    "master_course_name": "",
    "institute_id": this.institute_id,
    "is_active": "Y",
    "standard_id": '-1',
    "standard_name": ''
  }
  masterCourseObj: any = {
    "master_course_name": "",
    "institute_id": this.institute_id,
    "is_active": "Y",
    "standard_id": '-1',
    "standard_name": ''
  }
  searchFilter = {
    unassignFlag: '0',
    standard_id: -1,
  }


  constructor(
    private _httpService: HttpService,
    private _auth: AuthenticatorService,
    private _msgService: MessageShowService,
    private apiService: CourseListService
  ) { }

  ngOnInit(): void {
    this.schoolModel = this._auth.schoolModel.getValue();
    this.getMasterCourseData();
    this.fetchStandard();
  }

  getMasterCourseData() {
    this._auth.showLoader();
    this._httpService.getData('/api/v1/master-course/fetch-master-course/' + this.institute_id + '?is_active=Y').subscribe(
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

  fetchCourseDetails(obj) {
    if (this.master_course_id != '-1') {
      this._auth.showLoader();
      let url = `/api/v1/courseMaster/fetch-all-course/${this.institute_id}/${this.master_course_id}`;
      this._httpService.getData(url).subscribe(
        (res: any) => {
          this._auth.hideLoader();
          this.courseData = res.result;
        },
        (err: any) => {
          this.courseData = [];
          this._auth.hideLoader();
          this._msgService.showErrorMessage('error', '', err.error.message);
        }
      )
      if (!this.schoolModel) {
        let stdObj = this.masterCourseData.filter(mc => (mc.master_course_id == this.master_course_id));
        this.masterCourseObj = stdObj[0];
      } else {
        let stdObj = this.standardList.filter(mc => (mc.standard_id == this.master_course_id));
        this.masterCourseObj = stdObj[0];
      }
    }
  }

  fetchStandard() {
    let url = "/api/v1/standards/standard-subject-list/" + this.institute_id + '?is_active=Y&is_subject_required=true';
    this._auth.showLoader();
    this._httpService.getData(url).subscribe(
      (data: any) => {
        this._auth.hideLoader();
        this.standardList = data.result;
      },
      (error: any) => {
        this._auth.hideLoader();
        console.log(error);
      }
    )
  }

  saveMasterC() {
    this.editMasterC ? this.updateMasterCourse() : this.createMasterCourse();
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
          $('#courseModal').modal('hide');
        },
        (err: any) => {
          this._auth.hideLoader();
          this._msgService.showErrorMessage('error', '', err.error.message);
        }
      )
    }
  }

  updateMasterCourse() {
    if (this.checkMasterCourseVal()) {
      let obj = {
        "master_course_name": this.createMasterCourseModel.master_course_name,
        "institute_id": this.createMasterCourseModel.institute_id,
        "is_active": "Y",
        "standard_id": this.createMasterCourseModel.standard_id,
        "master_course_id": this.createMasterCourseModel.master_course_id
      }
      this._auth.showLoader();
      this._httpService.putData('/api/v1/master-course/update', obj).subscribe(
        (res: any) => {
          this._auth.hideLoader();
          this._msgService.showErrorMessage('success', '', 'Master course updated successfully');
          this.getMasterCourseData();
          $('#courseModal').modal('hide');
        },
        (err: any) => {
          this._auth.hideLoader();
          this._msgService.showErrorMessage('error', '', err.error.message);
        }
      )
    }
  }

  setAddCourseSession() {
    console.log(this.masterCourseObj);
    sessionStorage.setItem('cretaCourse', JSON.stringify(this.masterCourseObj));
    let sub_list = this.standardList.filter(sub => (sub.standard_id == this.masterCourseObj.standard_id));
    sessionStorage.setItem('subjectList', JSON.stringify(sub_list[0]));
  }

  clearMasterCourse() {
    this.editMasterC = false;
    this.createMasterCourseModel = {
      "master_course_name": "",
      "institute_id": this.institute_id,
      "is_active": "Y",
      "standard_id": '-1',
      "standard_name": ''
    }
  }

  addStudentToBatch(rowDetails) {
    this.addStudentPopUp = true;
    this.courseDetails = rowDetails;
    if (this.schoolModel) {
      this.searchFilter.standard_id = this.masterCourseObj.standard_id;
      this.getAllStudentList();
    }
    this.getAllFeeTemplate();
    // this.onRadioButtonChange();
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
    this._auth.showLoader();
    this.showTable = true;
    this.apiService.getStudentList(data).subscribe(
      (res: any) => {
        let clone: any = [];
        for (let i = 0; i < res.length; i++) {
          res[i]['immutableKey'] = res[i].assigned;
          clone.push(res[i]);
        }
        let data = this.makeTableJson(clone);
        this.studentListDataSource = this.keepCloning(data);
        this.studentList = data;
        this.getHeaderCheckBoxValue();
        this._auth.hideLoader();
      },
      error => {
        this._auth.hideLoader();
      }
    )
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

  makeTableJson(res) {
    if (this.searchFilter.unassignFlag == '0') {
      return res;
    } else if (this.searchFilter.unassignFlag == '1') {
      let data = [];
      res.forEach(element => {
        if (element.assigned) {
          data.push(element);
        }
      });
      return data;
    } else {
      return res;
    }
  }

  getAllFeeTemplate() {
    this.apiService.getFeeTemplate(this.courseDetails.course_id).subscribe(
      res => {
        this.feeTemplateDataSource = res;
      },
      err => {
        //console.log(err);
      }
    )
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
    } else {
      this.studentList = this.studentListDataSource;
    }
  }

  closeStudentPopup() {
    this.addStudentPopUp = false;
    this.alertBox = true;
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

  checkAssignedCourse() {
    let test = [];
    for (let i = 0; i < this.studentListDataSource.length; i++) {
      for (let t = 0; t < this.studentList.length; t++) {
        if (this.studentList[t].student_id == this.studentListDataSource[i].student_id) {
          if (this.studentList[t].assigned != this.studentListDataSource[i].assigned) {
            test = [this.studentList[t].assigned.toString()];
            break;
          }
        }
      }
    }
    return test;
  }


  saveChanges() {
    let checkAssignedCourseList = this.checkAssignedCourse();

    if (checkAssignedCourseList.length > 0) {
      let checkFlag = true;

      for (let i = 0; i < checkAssignedCourseList.length; i++) {
        if (checkAssignedCourseList[i] == 'false') {
          checkFlag = false;
          break;
        }
      }
      if (!checkFlag) {
        this.unassign_course();
      }
      else {
        this.addStudentPopUp = false;
        this.apiToAllocateAndDeallocate();
      }

    }
    else {
      this.addStudentPopUp = false;
      this.showTable = false;
    }

  }

  getCheckedRows() {
    let test = {};
    for (let i = 0; i < this.studentListDataSource.length; i++) {
      for (let t = 0; t < this.studentList.length; t++) {
        if (this.studentList[t].student_id == this.studentListDataSource[i].student_id) {
          if (this.studentList[t].assigned != this.studentListDataSource[i].assigned) {
            test[this.studentList[t].student_id] = [this.studentList[t].assigned.toString(), this.studentList[t].academic_year.toString(), this.studentList[i].assigned_fee_template_id.toString()];
            break;
          }
        }
      }
    }
    return test;
  }

  apiToAllocateAndDeallocate() {
    this._auth.showLoader();
    let data = this.getCheckedRows();
    let dataToSend = {
      studentAssignedUnassigned_and_AcademicYearMapping: data,
      deleteCourse_SubjectUnPaidFeeSchedules: this.delete_unpaid_fee
    };
    this.apiService.saveUpdatedList(dataToSend, this.courseDetails.course_id).subscribe(
      res => {
        this._msgService.showErrorMessage('success', '', 'Student\'(s) updated successfully');
        this.studentList = [];
        this.addStudentPopUp = false;
        this._auth.hideLoader();
        this.fetchCourseDetails(this.masterCourseObj);
        this.showTable = false;
      },
      err => {
        this._auth.hideLoader();
        this._msgService.showErrorMessage('error', '', err.error.message);
      }
    )
  }


  unassign_course() {
    this.alertBox = true;
    this.apiToAllocateAndDeallocate();
  }

  closeAlert() {
    this.alertBox = true;
    this.delete_unpaid_fee = false;
    let data = this.getCheckedRows();
    for (let i = 0; i < Object.keys(data).length; i++) {
      (document.getElementById("studentcheck" + Object.keys(data)[i]) as HTMLInputElement).checked = true;
    }
  }

}
