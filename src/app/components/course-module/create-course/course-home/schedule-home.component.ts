import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import 'rxjs/Rx';
import { AppComponent } from '../../../../app.component';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { StandardServices } from '../../../../services/course-services/standard.service';


@Component({
  selector: 'app-schedule-home',
  templateUrl: './schedule-home.component.html',
  styleUrls: ['./schedule-home.component.scss']
})
export class ScheduleHomeComponent implements OnInit {

  no_standard_name: boolean = false;
  standardListDataSource: any = [];
  sizeArr: any[] = [25, 50, 100, 150, 200, 500, 1000];
  displayBatchSize = 25;
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
  activeList: boolean = false;
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
    this.auth.showLoader();
    this.apiService.getAllStandardListFromServer().subscribe(
      (data: any) => {

        data.sort(function (a, b) {
          return moment(a.created_date).unix() - moment(b.created_date).unix();
        })
        if (this.activeList == false) {
          this.standardListDataSource = [];
          for (let i = 0; i < data.length; i++) {
            if (data[i].is_active === "Y") {
              this.standardListDataSource.push(data[i]);
            }
          }
          console.log("active", this.standardListDataSource);
          this.totalRow = this.standardListDataSource.length;
          this.standardListDataSource.reverse();
          this.fetchTableDataByPage(this.PageIndex);
          this.auth.hideLoader();
          this.dataStatus = 2;
        }
        else if (this.activeList == true) {
          this.standardListDataSource = [];
          for (let i = 0; i < data.length; i++) {
            if (data[i].is_active === "N") {
              this.standardListDataSource.push(data[i]);
            }
          }
          console.log("Not active", this.standardListDataSource);
          this.totalRow = this.standardListDataSource.length;
          this.standardListDataSource.reverse();
          this.fetchTableDataByPage(this.PageIndex);
          this.auth.hideLoader();
          this.dataStatus = 2;
        }
        // this.standardListDataSource = data;
        // this.standardListDataSource.reverse();
        // this.fetchTableDataByPage(this.PageIndex);
        // this.auth.hideLoader();
        // this.dataStatus = 2;
      },
      error => {
        this.auth.hideLoader();
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
      this.auth.showLoader();
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
            titleMsg = "";
            msg = "Master Course added successfully";
          } else {
            titleMsg = "";
            msg = "Standard created successfully";
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
          this.auth.hideLoader();
          this.no_standard_name = false;
          this.toggleCreateNewStandard();
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
    this.auth.showLoader();
    this.apiService.updateStanadardRowData(data, row.standard_id).subscribe(
      data => {
        let msg = {
          type: "success",
          title: "Standard Updated",
          body: "Standard Updated Successfully!"
        }
        this.toastCtrl.popToast(msg);
        this.cancelRow(id);
        this.auth.hideLoader();
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

  clickSN() {
    document.getElementById('StdName').focus();
  }

  deleteRow(data) {
    if (confirm('Are you sure you want to delete?')) {
      this.auth.showLoader();
      this.apiService.deleteStandard(data.standard_id).subscribe(
        res => {
          this.auth.hideLoader();
          let data = {
            type: "success",
            title: '',
            body: "Deleted Successfully"
          }
          this.toastCtrl.popToast(data);
          this.getAllStandardList();
        },
        err => {
          this.auth.hideLoader();
          let data = {
            type: "error",
            title: '',
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
  updateTableBatchSize(event) {
    this.displayBatchSize = event;
    this.fetchTableDataByPage(this.PageIndex);
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
      this.route.navigateByUrl('/view/course/create/standardlist');
    } else if (data.indexOf('502') != -1) {
      this.route.navigateByUrl('/view/course/create/subject');
    } else if (data.indexOf('401') != -1) {
      this.route.navigateByUrl('/view/course/create/managebatch');
    } else if (data.indexOf('402') >= 0 || data.indexOf('704') >= 0) {
      this.route.navigateByUrl('/view/course/create/class');
    }
  }

  routeToSubTabsForNotLang(data) {
    if (data.indexOf('501') != -1) {
      this.route.navigateByUrl('/view/course/create/standardlist');
    } else if (data.indexOf('502') != -1) {
      this.route.navigateByUrl('/view/course/create/subject');
    } else if (data.indexOf('505') != -1) {
      this.route.navigateByUrl('/view/course/create/courselist');
    } else if (data.indexOf('701') >= 0 || data.indexOf('704') >= 0) {
      this.route.navigateByUrl('/view/course/create/class');
    }
  }

  teacherLoginFound() {
    if (this.isLangInstitue) {
      this.route.navigateByUrl('/view/course/create/managebatch');
    } else {
      this.route.navigateByUrl('/view/course/create/courselist');
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
    let array = ['liStandard', 'liSubject', 'liManageBatch', 'liExam', 'liClass'];
    array.forEach((flag) => {
      if (document.getElementById(flag)) {
        document.getElementById(flag).classList.remove('active');
      }
    });
  }

}
