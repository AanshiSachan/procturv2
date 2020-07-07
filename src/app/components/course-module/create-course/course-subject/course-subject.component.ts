import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AppComponent } from '../../../../app.component';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { SubjectApiService } from '../../../../services/course-services/subject.service';

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
  displayBatchSize = 15;
  totalRow: number;
  subjectList: any = [];
  standardList: any = [];
  newSubjectDetails: any = {
    is_active: "Y",
    standard_id: "-1",
    subject_name: '',
    subject_code: ''
  }
  searchedData: any = [];
  searchDataFlag: boolean = false;
  dataStatus: number = 1;
  dummyArr: any[] = [0, 1, 2, 3, 4, 0, 1, 2, 3, 4];
  columnMaps: any[] = [0, 1, 2, 3, 4, 5];
  selectedRow: number;
  isLangInstitue: boolean = false;
  sortingDir: string = "asc";

  constructor(
    private apiService: SubjectApiService,
    private toastCtrl: AppComponent,
    private auth: AuthenticatorService
  ) { }

  ngOnInit() {
    this.checkInstituteType();
    this.getAllSubjectList();
    this.getAllStandardSubjectList();
  }

  getAllSubjectList() {
    this.auth.showLoader();
    this.apiService.getAllSubjectListFromServer().subscribe(
      (data: any) => {

        this.totalRow = data.length;
        data.sort(function (a, b) {
          return moment(b.created_date).unix() - moment(a.created_date).unix();
        })
        this.subjectListDataSource = data;
        this.fetchTableDataByPage(this.PageIndex);
        this.auth.hideLoader();
        this.dataStatus = 2;
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

  updateRow(row, id) {
    let data: any = {};
    data.is_active = row.is_active;
    data.subject_name = row.subject_name;
    data.institution_id = row.institution_id;
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
    } else if (!this.isLangInstitue && data.subject_code.trim() == ''){
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


  getAllStandardSubjectList() {
    this.apiService.getAllStandardName().subscribe(
      res => {

        this.standardList = res;
      },
      error => {

      }
    )
  }

  addNewSubject() {
    if (this.newSubjectDetails.standard_id == "" || this.newSubjectDetails.subject_name == "" || this.newSubjectDetails.standard_id == '-1' || (!this.isLangInstitue && this.newSubjectDetails.subject_code.trim() == '')) {
      let data = {
        type: "error",
        title: "",
        body: "Please enter value of mandatory fields."
      }
      this.toastCtrl.popToast(data);
      return false;
    } else {
      if (this.newSubjectDetails.is_active == true || this.newSubjectDetails.is_active == "Y") {
        this.newSubjectDetails.is_active = "Y";
      } else {
        this.newSubjectDetails.is_active = "N";
      }
      if (!this.isLangInstitue) {
      this.newSubjectDetails.subject_code = this.newSubjectDetails.subject_code.toUpperCase();
      }
      this.apiService.createNewSubject(this.newSubjectDetails).subscribe(
        res => {
          let msg = "";
          if (this.isLangInstitue) {
            msg = "Course added Successfully!";
          } else {
            msg = "Subject created successfully";
          }
          let data = {
            type: "success",
            title: "",
            body: msg
          }
          this.toastCtrl.popToast(data);
          this.getAllSubjectList();
          this.newSubjectDetails = {
            is_active: "Y",
            standard_id: "",
            subject_name: '',
            subject_code: ''
          }
        },
        err => {
          let data = {
            type: "error",
            title: "",
            body: err.error.message
          }
          this.toastCtrl.popToast(data);
        })
    }
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
        subject_code: ''
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

}
