import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../../app.component';
import * as moment from 'moment';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { Router } from '@angular/router';
import { EmployeeService } from '../../../services/employee-service/employee.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  employeeListDataSource: any = [];
  employeeList: any = [];
  PageIndex: number = 1;
  displayBatchSize: number = 10;
  searchDataFlag: boolean = false;
  searchedData: any = [];
  dataStatus: number = 1;
  totalRow: number = 0;
  searchValue: string = '';
  selectedRow: number = null;
  daysList: any = [];
  tempData: any = "";
  workingDayPopUp: boolean = false;

  constructor(
    private router: Router,
    private appC: AppComponent,
    private apiService: EmployeeService
  ) {
    if (sessionStorage.getItem('userid') == null) {
      this.router.navigate(['/authPage']);
    }
  }

  ngOnInit() {
    this.fetchEmployeeList();
  }

  fetchEmployeeList() {
    this.PageIndex = 1;
    this.searchValue = '';
    this.apiService.getEmployeeList().subscribe(
      (res: any) => {
        this.employeeListDataSource = res;
        this.totalRow = res.length;
        this.dataStatus = 2;
        this.fetchTableDataByPage(this.PageIndex);
      }
    )
  }

  //Working Days PopUp 

  manageWorkingDays(data) {
    this.workingDayPopUp = true;
    this.tempData = data;
    if (this.daysList.length == 0) {
      this.fetchWorkingDays(data)
    } else {
      setTimeout(() => {
        this.makeTableJson(this.daysList, data);
      }, 500)
    }
  }

  fetchWorkingDays(data) {
    this.apiService.getDaysList().subscribe(
      res => {
        this.daysList = res;
        this.makeTableJson(res, data);
      },
      err => {
        console.log(err);
      }
    )
  }

  makeTableJson(weekDays, data) {
    let arr: any = [];
    weekDays.map(
      ele => {
        if (data.workingDays.includes(ele.data_key)) {
          if ((document.getElementById('idDay-' + ele.data_key).classList).contains('l-text')) {
            document.getElementById('idDay-' + ele.data_key).classList.remove('l-text');
            document.getElementById('idDay-' + ele.data_key).classList.add('p-text');
          }
        }
      }
    )
  }

  closePopup() {
    this.workingDayPopUp = false;
    this.tempData = "";
  }

  onWeekDaysSelection(event) {
    if ((document.getElementById(event.target.id).classList).contains('l-text')) {
      document.getElementById(event.target.id).classList.remove('l-text');
      document.getElementById(event.target.id).classList.add('p-text');
    } else {
      document.getElementById(event.target.id).classList.add('l-text');
      document.getElementById(event.target.id).classList.remove('p-text');
    }
  }

  getSelectedDaysOfWeek() {
    let arr = [];
    let elementArray = document.getElementsByClassName('p-text');
    for (let t = 0; t < elementArray.length; t++) {
      arr.push(elementArray[t].id.split('-')[1].trim());
    }
    return arr;
  }

  updateEmployeeWorkingDays() {
    let data: any = this.getSelectedDaysOfWeek();
    if (data.length == 0) {
      this.messageNotifier('warning', 'Warning', "You haven't selected any day");
      data = "";
    } else {
      data = data.join(',');
    }
    let obj: any = {
      emp_id: this.tempData.emp_id,
      workingDays: data
    };
    this.apiService.updateWorkingDays(obj).subscribe(
      res => {
        this.messageNotifier('success', 'Updated Successfully', 'Working days updated successfully');
        this.fetchEmployeeList();
        this.closePopup();
      },
      err => {
        console.log(err);
        this.messageNotifier('error', 'Error', err.error.message);
      }
    )
  }

  // pagination functions 

  fetchTableDataByPage(index) {
    this.PageIndex = index;
    let startindex = this.displayBatchSize * (index - 1);
    this.employeeList = this.getDataFromDataSource(startindex);
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
      data = this.employeeListDataSource.slice(startindex, startindex + this.displayBatchSize);
    }
    return data;
  }

  searchTeacher() {
    if (this.searchValue != "" && this.searchValue != null) {
      let searchData = this.employeeListDataSource.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchValue.toLowerCase()))
      );
      this.searchedData = searchData;
      this.totalRow = searchData.length;
      this.searchDataFlag = true;
      this.fetchTableDataByPage(this.PageIndex);
    } else {
      this.searchDataFlag = false;
      this.fetchTableDataByPage(this.PageIndex);
      this.totalRow = this.employeeListDataSource.length;
    }
  }

  rowSelectEvent(i) {
    this.selectedRow = i;
  }

  messageNotifier(type, title, msg) {
    let data = {
      type: type,
      title: title,
      body: msg
    }
    this.appC.popToast(data);
  }

}
