import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AppComponent } from '../../../../app.component';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { SubjectApiService } from '../../../../services/course-services/subject.service';
import CommonUtils from '../../../../utils/commonUtils'
declare var $;
@Component({
  selector: 'app-course-subject',
  templateUrl: './course-subject.component.html',
  styleUrls: ['./course-subject.component.scss']
})
export class CourseSubjectComponent implements OnInit {

  createNewSubject: boolean = false;
  no_subject_name: boolean = false;
  subjectListDataSource;
  PageIndex: number = 1;
  displayBatchSize = 25;
  sizeArr: any[] = [25, 50, 100, 150, 200, 500, 1000];
  totalRow: number;
  subjectList: any = [];
  standardList: any = [];
  newSubjectDetails: any = {
    is_active: "Y",
    standard_id: "-1",
    subject_name: '',
    subject_code: '',
    is_optional: false,
    total_marks: '',
    passing_marks: ''
  }
  searchedData: any = [];
  searchDataFlag: boolean = false;
  dataStatus: number = 1;
  dummyArr: any[] = [0, 1, 2, 3, 4, 0, 1, 2, 3, 4];
  columnMaps: any[] = [0, 1, 2, 3, 4, 5];
  selectedRow: number;
  isLangInstitue: boolean = false;
  sortingDir: string = "asc";
  subjectCodeCharLimit: number = 4;
  activeList: boolean = true;
  schoolModel: boolean = false;
  isNewSubjectAdd: boolean = true;
  subject_id: number = -1;
  standard_id_filter : any ='-1';

  constructor(
    private apiService: SubjectApiService,
    private toastCtrl: AppComponent,
    private auth: AuthenticatorService
  ) {
    //Abhishek kumar ​102047 Kohima college
    if (sessionStorage.getItem('institute_id') == 102047 + "")
      this.subjectCodeCharLimit = 8;
  }

  ngOnInit() {
    this.schoolModel = this.auth.schoolModel.value;
    this.checkInstituteType();
    this.getAllSubjectList();
    this.getAllStandardSubjectList();
  }



  getAllSubjectList() {
    this.PageIndex = 1;
    this.auth.showLoader();
    this.searchDataFlag = false;
    this.apiService.getAllSubjectListFromServer(this.standard_id_filter).subscribe(
      (data: any) => {
        console.log("getAllSubjectList", data);

        data.sort(function (a, b) {
          return moment(b.created_date).unix() - moment(a.created_date).unix();
        })
        if (this.activeList == true) {
          this.subjectListDataSource = [];
          for (let i = 0; i < data.length; i++) {
            if (data[i].is_active === "Y") {
              this.subjectListDataSource.push(data[i]);
            }
          }
          // this.subjectListDataSource = data;
          this.totalRow = this.subjectListDataSource.length;
          this.fetchTableDataByPage(this.PageIndex);
          this.auth.hideLoader();
          this.dataStatus = 2;
        }
        else if (this.activeList == false) {
          this.subjectListDataSource = [];
          for (let i = 0; i < data.length; i++) {
            if (data[i].is_active === "N") {
              this.subjectListDataSource.push(data[i]);
            }
          }
          // this.subjectListDataSource = data;
          this.totalRow = this.subjectListDataSource.length;
          this.fetchTableDataByPage(this.PageIndex);
          this.auth.hideLoader();
          this.dataStatus = 2;
        }

      },
      error => {

      }
    )
  }


  editRow(id) {
    document.getElementById(("row" + id).toString()).classList.remove('displayComp');
    document.getElementById(("row" + id).toString()).classList.add('editComp');
  }

  cancelRow(id) {
    document.getElementById(("row" + id).toString()).classList.remove('editComp');
    document.getElementById(("row" + id).toString()).classList.add('displayComp');
    this.getAllSubjectList();
  }
  editSubject(data) {
    console.log(data);
    $('#addUpdateSubjectdialog').modal('show');
    this.isNewSubjectAdd = false;
    this.newSubjectDetails.standard_id = data.standard_id;
    this.newSubjectDetails.subject_name = data.subject_name;
    this.newSubjectDetails.is_active = data.is_active == 'Y' ? true : false;
    if (!this.isLangInstitue) {
      this.newSubjectDetails.subject_code = data.subject_code;
    }
    if (this.schoolModel) {
      this.newSubjectDetails.is_optional = data.is_optional == "Y" ? true : false;
      this.newSubjectDetails.total_marks = data.final_marks;
      this.newSubjectDetails.passing_marks = data.passing_marks;
    }
    this.subject_id = data.subject_id;

  }
  updateRow(row, id) {
    let data: any = {};
    data.is_active = row.is_active;
    data.subject_name = row.subject_name;
    data.institution_id = row.institution_id;
    data.is_optional = row.is_optional;
    if (!this.isLangInstitue) {
      data.subject_code = row.subject_code.toUpperCase();
    }
    if (data.subject_name == "" && data.data.subject_name == null) {
      let msg = {
        type: "error",
        title: "",
        body: "Please enter Subject Name"
      }
      this.toastCtrl.popToast(msg);
      return;
    } else if (!this.isLangInstitue && data.subject_code.trim() == '') {
      let msg = {
        type: "error",
        title: "",
        body: "Please enter Subject Code"
      }
      this.toastCtrl.popToast(msg);
      return;
    }
    this.apiService.updateSubjectRowData(data, row.subject_id).subscribe(
      data => {
        let msg = {
          type: "success",
          title: "",
          body: "Subject Updated Successfully!"
        }
        this.toastCtrl.popToast(msg);

        this.cancelRow(id);
      },
      error => {
        let data = {
          type: "error",
          title: "",
          body: error.error.message
        }
        this.toastCtrl.popToast(data);

      }
    )
  }
  updateSubject() {
    if (this.validateUserInput()) {
      this.auth.showLoader();
      this.apiService.updateSubjectRowData(this.preparedSubjectRequestPayload(), this.subject_id).subscribe(
        data => {
          this.auth.hideLoader();
          let msg = {
            type: "success",
            title: "",
            body: "Subject Updated Successfully!"
          }
          this.toastCtrl.popToast(msg);
          $('#addUpdateSubjectdialog').modal('hide');
          this.getAllSubjectList();
          this.clearData();
        },
        error => {
          this.auth.hideLoader();
          let data = {
            type: "error",
            title: "",
            body: error.error.message
          }
          this.toastCtrl.popToast(data);

        }
      )
    }

  }

  getAllStandardSubjectList() {
    this.apiService.getAllStandardName().subscribe(
      res => {
        console.log("getAllStandardSubjectList", res);
        this.standardList = res;
      },
      error => {

      }
    )
  }

  addNewSubject() {
    if (this.validateUserInput()) {
      this.auth.showLoader();
      this.apiService.createNewSubject(this.preparedSubjectRequestPayload()).subscribe(
        res => {
          this.auth.hideLoader();
          this.successMsg();
        },
        err => {
          this.auth.hideLoader();
          let data = {
            type: "error",
            title: "",
            body: err.error.message
          }
          this.toastCtrl.popToast(data);
        })
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
  successMsg() {
    let msg = "";
    if (this.isLangInstitue) {
      msg = "Course created successfully!";
    } else {
      msg = "Subject created successfully";
    }
    let data = {
      type: "success",
      title: "",
      body: msg
    }
    this.toastCtrl.popToast(data);
    $('#addUpdateSubjectdialog').modal('hide');
    this.getAllSubjectList();
    this.clearData();
  }
  validateUserInput() {
    if (this.newSubjectDetails.standard_id == '-1') {
      let data = {
        type: "error",
        title: "",
        body: "Please select standard!"
      }
      this.toastCtrl.popToast(data);
      return false;
    }
    if (CommonUtils.isEmpty(this.newSubjectDetails.subject_name)) {
      let data = {
        type: "error",
        title: "",
        body: "Please enter subject name!"
      }
      this.toastCtrl.popToast(data);
      return false;
    } else if (!CommonUtils.validateSpecialCharacters(this.newSubjectDetails.subject_name)) {
      let data = {
        type: "error",
        title: "",
        body: "Special characters are not allowed in subject Name"
      }
      this.toastCtrl.popToast(data);
      return false;
    }
    if (!this.isLangInstitue && CommonUtils.isEmpty(this.newSubjectDetails.subject_code)) {
      let data = {
        type: "error",
        title: "",
        body: "Please enter subject code!"
      }
      this.toastCtrl.popToast(data);
      return false;
    }
    return this.validateSchoolModelField();
  }
  validateSchoolModelField() {
    if (this.schoolModel) {
      if (Number(this.newSubjectDetails.total_marks) <= 0) {
        let data = {
          type: "error",
          title: "",
          body: "Please enter total marks!"
        }
        this.toastCtrl.popToast(data);
        return false;
      }
      if (Number(this.newSubjectDetails.passing_marks <= 0)) {
        let data = {
          type: "error",
          title: "",
          body: "Please enter passing marks!"
        }
        this.toastCtrl.popToast(data);
        return false;
      }
      if (Number(this.newSubjectDetails.total_marks) < Number(this.newSubjectDetails.passing_marks)) {
        let data = {
          type: "error",
          title: "",
          body: "Total marks can't be less than passing marks!"
        }
        this.toastCtrl.popToast(data);
        return false;
      }
    }
    return true;
  }

  searchInList(element) {
    if (element.value != "" && element.value != null) {
      let searchData = this.subjectListDataSource.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(element.value.toLowerCase()))
      );
      this.searchedData = searchData;
      this.searchDataFlag = true;
      this.totalRow = searchData.length;
      this.PageIndex = 1;
      this.fetchTableDataByPage(this.PageIndex);
    } else {
      this.searchDataFlag = false;
      this.fetchTableDataByPage(this.PageIndex);
      this.totalRow = this.subjectListDataSource.length;
    }
  }


  /* Function to set the createNewStandard View On/Off */
  toggleCreateNewSubject() {
    if (this.createNewSubject == false) {
      this.createNewSubject = true;
      document.getElementById('showCloseBtnSubject').style.display = '';
      document.getElementById('showAddBtnSubject').style.display = 'none';
    } else {
      this.no_subject_name = false;
      this.createNewSubject = false;
      document.getElementById('showCloseBtnSubject').style.display = 'none';
      document.getElementById('showAddBtnSubject').style.display = '';
      this.newSubjectDetails = {
        is_active: "Y",
        standard_id: "",
        subject_name: '',
        subject_code: '',
        is_optional: false
      }
    }
  }

  deleteRow(row) {
    this.auth.showLoader();
    this.apiService.deleteSubject(row.subject_id).subscribe(
      res => {
        this.auth.hideLoader();
        let data = {
          type: "success",
          title: '',
          body: "Deleted Successfully"
        }
        this.toastCtrl.popToast(data);
        this.getAllSubjectList();
      },
      err => {
        this.auth.hideLoader();
        let data = {
          type: "error",
          title: "",
          body: err.error.message
        }
        this.toastCtrl.popToast(data);
      }
    )
  }



  // pagination functions

  fetchTableDataByPage(index) {
    this.PageIndex = index;
    let startindex = this.displayBatchSize * (index - 1);
    this.subjectList = this.getDataFromDataSource(startindex);
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
    let data = [];
    if (this.searchDataFlag) {
      data = this.searchedData.slice(startindex, startindex + this.displayBatchSize);
    } else {
      data = this.subjectListDataSource.slice(startindex, startindex + this.displayBatchSize);
    }
    return data;
  }
  updateTableBatchSize(event) {
    this.PageIndex = 1;
    this.displayBatchSize = event;
    this.fetchTableDataByPage(this.PageIndex);
  }
  sortTable(str) {
    if (str == "standard_name" || str == "subject_name" || str == "is_active") {
      this.subjectListDataSource.sort(function (a, b) {
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
    else if (str == "subject_id") {
      this.subjectListDataSource.sort(function (a, b) {
        return a[str] - b[str];
      })
    }
    else if (str == "created_date") {
      this.subjectListDataSource.sort(function (a, b) {
        return moment(a[str]).unix() - moment(b[str]).unix();
      })
    }
    if (this.sortingDir == "asc") {
      this.sortingDir = "dec";
    } else {
      this.sortingDir = "asc";
      this.subjectListDataSource = this.subjectListDataSource.reverse();
    }
    this.fetchTableDataByPage(this.PageIndex);
  }

  rowSelectEvent(i) {
    this.selectedRow = i;
  }

  checkInstituteType() {
    this.auth.institute_type.subscribe(
      res => {
        if (res == "LANG") {
          this.isLangInstitue = true;
        } else {
          this.isLangInstitue = false;
        }
      }
    )
  }
  openPopup() {
    $('#addUpdateSubjectdialog').modal('show');
    this.isNewSubjectAdd = true;
    this.clearData();
  }
  clearData() {
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
}
