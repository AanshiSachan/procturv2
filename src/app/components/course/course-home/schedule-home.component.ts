import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import 'rxjs/Rx';
import { AppComponent } from '../../../app.component';
import { StandardServices } from '../../../services/course-services/standard.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { AuthenticatorService } from '../../../services/authenticator.service';


@Component({
  selector: 'app-schedule-home',
  templateUrl: './schedule-home.component.html',
  styleUrls: ['./schedule-home.component.scss']
})
export class ScheduleHomeComponent implements OnInit {

  isRippleLoad: boolean = false;
  no_standard_name: boolean = false;
  standardListDataSource: any = [];
  displayBatchSize = 15;
  standardList: any = [];
  PageIndex: number = 1;
  createNewStandard: boolean = false;
  newStandardDetails: any = {
    is_active: "Y",
    standard_name: ""
  }
  totalRow: number;
  searchedData: any = [];
  searchDataFlag: boolean = false;
  dummyArr: any[] = [0, 1, 2, 3, 4, 0, 1, 2, 3, 4];
  columnMaps: any[] = [0, 1, 2, 3, 4];
  dataStatus: number = 1;
  selectedRow: number;
  isLangInstitue: boolean = false;
  sortingDir: string = "asc";

  @ViewChild('#StdName') standard_name_label: ElementRef

  constructor(
    private apiService: StandardServices,
    private toastCtrl: AppComponent,
    private route: Router,
    private auth: AuthenticatorService
  ) {

  }

  ngOnInit() {
    this.checkWhichTabIsOpen();
    this.checkInstituteType();
    this.getAllStandardList();
  }


  getAllStandardList() {
    this.isRippleLoad = true;
    this.apiService.getAllStandardListFromServer().subscribe(
      (data: any) => {
        this.totalRow = data.length;
        data.sort(function (a, b) {
          return moment(a.created_date).unix() - moment(b.created_date).unix();
        })
        this.standardListDataSource = data;
        this.standardListDataSource.reverse();
        this.fetchTableDataByPage(this.PageIndex);
        this.isRippleLoad = false;
        this.dataStatus = 2;
      },
      error => {
        this.isRippleLoad = false;
        let data = {
          type: "error",
          title: "",
          body: "Please refresh the page."
        }
        this.toastCtrl.popToast(data);
      }
    )
  }

  /* Function to set the createNewStandard View On/Off */
  toggleCreateNewStandard() {
    if (this.createNewStandard == false) {
      this.createNewStandard = true;
      document.getElementById('showCloseBtn').style.display = '';
      document.getElementById('showAddBtn').style.display = 'none';
    } else {
      this.newStandardDetails = {
        is_active: "Y",
        standard_name: ""
      }
      this.no_standard_name = false;
      this.createNewStandard = false;
      document.getElementById('showCloseBtn').style.display = 'none';
      document.getElementById('showAddBtn').style.display = '';
    }
  }


  /* Function to create a New Standard */
  addNewStandard() {
    if (this.newStandardDetails.standard_name == "") {
      this.no_standard_name = true;
    } else {
      this.isRippleLoad = true;
      if (this.newStandardDetails.is_active == true || this.newStandardDetails.is_active == "Y") {
        this.newStandardDetails.is_active = "Y";
      }
      else {
        this.newStandardDetails.is_active = "N";
      }
      this.apiService.createNewStandard(this.newStandardDetails).subscribe(
        res => {
          let msg = "";
          let titleMsg = "";
          if (this.isLangInstitue) {
            titleMsg = "Master Course Added";
            msg = "Master Course added Successfull!!";
          } else {
            titleMsg = "Standard Added";
            msg = "New Standard added Successfull!";
          }
          let data = {
            type: "success",
            title: titleMsg,
            body: msg
          }
          this.toastCtrl.popToast(data);
          this.newStandardDetails = {
            is_active: "Y",
            standard_name: ""
          }
          this.getAllStandardList();
          this.isRippleLoad = false;
          this.no_standard_name = false;
          this.toggleCreateNewStandard();
        },
        err => {
          this.isRippleLoad = false;
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
      let searchData = this.standardListDataSource.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(element.value.toLowerCase()))
      );
      this.searchedData = searchData;
      this.totalRow = searchData.length;
      this.searchDataFlag = true;
      this.PageIndex = 1;
      this.fetchTableDataByPage(this.PageIndex);
    } else {
      this.searchDataFlag = false;
      this.fetchTableDataByPage(this.PageIndex);
      this.totalRow = this.standardListDataSource.length;
    }
  }

  editRow(id) {
    document.getElementById(("row" + id).toString()).classList.remove('displayComp');
    document.getElementById(("row" + id).toString()).classList.add('editComp');
  }

  cancelRow(id) {
    document.getElementById(("row" + id).toString()).classList.remove('editComp');
    document.getElementById(("row" + id).toString()).classList.add('displayComp');
    this.getAllStandardList();
  }

  updateRow(row, id) {
    let data: any = {};
    data.is_active = row.is_active;
    data.standard_name = row.standard_name;
    data.institution_id = row.institution_id;
    this.isRippleLoad = true;
    this.apiService.updateStanadardRowData(data, row.standard_id).subscribe(
      data => {
        let msg = {
          type: "success",
          title: "Standard Updated",
          body: "Standard Updated Successfully!"
        }
        this.toastCtrl.popToast(msg);
        this.cancelRow(id);
        this.isRippleLoad = false;
      },
      error => {
        this.isRippleLoad = false;
        let data = {
          type: "error",
          title: "",
          body: error.error.message
        }
        this.toastCtrl.popToast(data);

      }
    )
  }

  clickSN() {
    document.getElementById('StdName').focus();
  }

  deleteRow(data) {
    if (confirm('Are you sure you want to delete?')) {
      this.isRippleLoad = true;
      this.apiService.deleteStandard(data.standard_id).subscribe(
        res => {
          this.isRippleLoad = false;
          let data = {
            type: "success",
            title: "Success",
            body: "Deleted Successfully"
          }
          this.toastCtrl.popToast(data);
          this.getAllStandardList();
        },
        err => {
          this.isRippleLoad = false;
          let data = {
            type: "error",
            title: "Error",
            body: err.error.message
          }
          this.toastCtrl.popToast(data);

        }
      )
    }
  }

  // pagination functions

  fetchTableDataByPage(index) {
    this.PageIndex = index;
    let startindex = this.displayBatchSize * (index - 1);
    this.standardList = this.getDataFromDataSource(startindex);
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
    if (this.searchDataFlag == true) {
      data = this.searchedData.slice(startindex, startindex + this.displayBatchSize);
    } else {
      data = this.standardListDataSource.slice(startindex, startindex + this.displayBatchSize);
    }
    return data;
  }

  rowClickEvent(row) {
    this.selectedRow = row;
  }

  sortTable(str) {
    if (str == "standard_name" || str == "is_active") {
      this.standardListDataSource.sort(function (a, b) {
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
    else if (str == "standard_id") {
      this.standardListDataSource.sort(function (a, b) {
        return a[str] - b[str];
      })
    }
    else if (str == "created_date") {
      this.standardListDataSource.sort(function (a, b) {
        return moment(a[str]).unix() - moment(b[str]).unix();
      })
    }
    if (this.sortingDir == "asc") {
      this.sortingDir = "dec";
    } else {
      this.sortingDir = "asc";
      this.standardListDataSource = this.standardListDataSource.reverse();
    }
    this.fetchTableDataByPage(this.PageIndex);
  }

  checkInstituteType() {
    let userType: any = Number(sessionStorage.getItem('userType'));
    const permissionArray = sessionStorage.getItem('permissions');
    this.auth.institute_type.subscribe(
      res => {
        if (res == "LANG") {
          this.isLangInstitue = true;
          if (userType != 3) {
            this.routeToSubTabsForLang(permissionArray);
          } else {
            this.teacherLoginFound();
          }
        } else {
          this.isLangInstitue = false;
          if (userType != 3) {
            this.routeToSubTabsForNotLang(permissionArray);
          } else {
            this.teacherLoginFound();
          }
        }
      }
    )
  }

  routeToSubTabsForLang(data) {
    if (data.indexOf('501') != -1) {
      this.route.navigateByUrl('/view/course/standardlist');
    } else if (data.indexOf('502') != -1) {
      this.route.navigateByUrl('/view/course/subject');
    } else if (data.indexOf('401') != -1) {
      this.route.navigateByUrl('/view/course/managebatch');
    } else if (data.indexOf('402') >= 0 || data.indexOf('704') >= 0) {
      this.route.navigateByUrl('/view/course/class');
    }
  }

  routeToSubTabsForNotLang(data) {
    if (data.indexOf('501') != -1) {
      this.route.navigateByUrl('/view/course/standardlist');
    } else if (data.indexOf('502') != -1) {
      this.route.navigateByUrl('/view/course/subject');
    } else if (data.indexOf('505') != -1) {
      this.route.navigateByUrl('/view/course/courselist');
    } else if (data.indexOf('701') >= 0 || data.indexOf('704') >= 0) {
      this.route.navigateByUrl('/view/course/class');
    }
  }

  teacherLoginFound() {
    if (this.isLangInstitue) {
      this.route.navigateByUrl('/view/course/managebatch');
    } else {
      this.route.navigateByUrl('/view/course/courselist');
    }
  }

  /* function to set-unset isActive status for add standard */
  toggleStandardActive(event) {
    if (event) {
      this.newStandardDetails.is_active = "Y";
    }
    else {
      this.newStandardDetails.is_active = "N";
    }
  }

  checkWhichTabIsOpen() {
    setTimeout(() => {
      this.hideAllTabs();
      document.getElementById('liStandard').classList.add('active');
    }, 200)
  }

  hideAllTabs() {
    document.getElementById('liStandard').classList.remove('active');
    document.getElementById('liSubject').classList.remove('active');
    document.getElementById('liManageBatch').classList.remove('active');
    document.getElementById('liExam').classList.remove('active');
    document.getElementById('liClass').classList.remove('active');
  }

}
