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

  isProfessional: boolean = false;
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

  constructor(
    private router: Router,
    private appC: AppComponent,
    private auth: AuthenticatorService,
    private apiService: EmployeeService
  ) {
    if (sessionStorage.getItem('userid') == null) {
      this.router.navigate(['/authPage']);
    }
  }

  ngOnInit() {
    this.auth.institute_type.subscribe(
      res => {
        if (res == 'LANG') {
          this.isProfessional = true;
        } else {
          this.isProfessional = false;
        }
      }
    )
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

}
