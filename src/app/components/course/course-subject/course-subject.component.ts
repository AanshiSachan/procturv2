import { Component, OnInit } from '@angular/core';
import { SubjectApiService } from '../../../services/course-services/subject.service';
import { AppComponent } from '../../../app.component';
import { error } from 'util';
import * as moment from 'moment';

@Component({
  selector: 'app-course-subject',
  templateUrl: './course-subject.component.html',
  styleUrls: ['./course-subject.component.scss']
})
export class CourseSubjectComponent implements OnInit {

  isRippleLoad: boolean = false;
  createNewSubject: boolean = false;
  no_subject_name: boolean = false;
  subjectListDataSource;
  PageIndex: number = 1;
  displayBatchSize = 10;
  totalRow: number;
  subjectList: any = [];
  standardList: any = [];
  newSubjectDetails: any = {
    is_active: "Y",
    standard_id: "-1",
    subject_name: ''
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
    private toastCtrl: AppComponent
  ) { }

  ngOnInit() {
    this.checkInstituteType();
    this.getAllSubjectList();
    this.getAllStandardSubjectList();
  }

  getAllSubjectList() {
    this.isRippleLoad = true;
    this.apiService.getAllSubjectListFromServer().subscribe(
      (data: any) => {

        this.totalRow = data.length;
        data.sort(function (a, b) {
          return moment(b.created_date).unix() - moment(a.created_date).unix();
        })
        this.subjectListDataSource = data;
        this.fetchTableDataByPage(this.PageIndex);
        this.isRippleLoad = false;
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
    if (data.subject_name == "" && data.data.subject_name == null) {
      let msg = {
        type: "error",
        title: "",
        body: "Please provide Subject Name"
      }
      this.toastCtrl.popToast(msg);
      return;
    }
    this.apiService.updateSubjectRowData(data, row.subject_id).subscribe(
      data => {
        let msg = {
          type: "success",
          title: "Standard Updated",
          body: "Standard Updated Successfully!"
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
    if (this.newSubjectDetails.standard_id == "" || this.newSubjectDetails.subject_name == "" || this.newSubjectDetails.standard_id == '-1') {
      let data = {
        type: "error",
        title: "",
        body: "Please provide value of mandatory fields."
      }
      this.toastCtrl.popToast(data);
      return false;
    } else {
      if (this.newSubjectDetails.is_active == true || this.newSubjectDetails.is_active == "Y") {
        this.newSubjectDetails.is_active = "Y";
      } else {
        this.newSubjectDetails.is_active = "N";
      }
      this.apiService.createNewSubject(this.newSubjectDetails).subscribe(
        res => {
          let msg = "";
          if (this.isLangInstitue) {
            msg = "Course added Successfull!!";
          } else {
            msg = "New Subject added Successfull!";
          }
          let data = {
            type: "success",
            title: "Subject Added",
            body: msg
          }
          this.toastCtrl.popToast(data);
          this.getAllSubjectList();
          this.newSubjectDetails = {
            is_active: "Y",
            standard_id: "",
            subject_name: ''
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
        subject_name: ''
      }
    }
  }

  deleteRow(row) {
    this.isRippleLoad = true;
    this.apiService.deleteSubject(row.subject_id).subscribe(
      res => {
        this.isRippleLoad = false;
        let data = {
          type: "success",
          title: "Success",
          body: "Deleted Successfully"
        }
        this.toastCtrl.popToast(data);
        this.getAllSubjectList();
      },
      err => {
        this.isRippleLoad = false;
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
    let type: any = sessionStorage.getItem('institute_type');
    if (type == "LANG") {
      this.isLangInstitue = true;
    } else {
      this.isLangInstitue = false;
    }
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
