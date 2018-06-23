import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { Router } from '@angular/router';
import { EmployeeService } from '../../../services/employee-service/employee.service';
import { MenuItem } from 'primeng/primeng';

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
  dataStatus: number = 1;
  totalRow: number = 0;
  selectedRow: number = null;
  daysList: any = [];
  tempData: any = "";
  workingDayPopUp: boolean = false;
  @ViewChild('tableContent') tableContent: ElementRef;
  @ViewChild('sideNav') sideNav: ElementRef;
  selectedEmpData: any = '';
  bulkActionItems: MenuItem[];

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
    this.giveFullPermisionOfBulfAction();
  }

  giveFullPermisionOfBulfAction() {
    this.bulkActionItems = [
      {
        label: 'Delete', icon: 'fa-trash-o', command: () => {
          this.bulkDeleteEmployee();
        }
      },
      {
        label: 'Send Notification', icon: 'fa-envelope-o', command: () => {
          this.sendBulkSms();
        }
      },
      {
        label: 'Download ID Card', icon: 'fa-buysellads', command: () => {
          this.downloadBulkIdCard();
        }
      }
    ];
  }

  fetchEmployeeList() {
    this.PageIndex = 1;
    this.apiService.getEmployeeList().subscribe(
      (res: any) => {
        this.employeeListDataSource = this.addKey(res);
        this.totalRow = res.length;
        this.dataStatus = 2;
        this.fetchTableDataByPage(this.PageIndex);
      }
    )
  }

  bulkDeleteEmployee(){

  }

  sendBulkSms(){

  }

  downloadBulkIdCard(){
    
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
    return this.employeeListDataSource.slice(startindex, startindex + this.displayBatchSize);
  }

  rowSelectEvent(i) {
    this.selectedRow = i;
    this.tableContent.nativeElement.style.width = "70%";
    this.sideNav.nativeElement.style.width = "29%";
    this.sideNav.nativeElement.classList.remove('hide');
    this.selectedEmpData = this.employeeList[i];
  }

  messageNotifier(type, title, msg) {
    let data = {
      type: type,
      title: title,
      body: msg
    }
    this.appC.popToast(data);
  }

  closeSideNav(event) {
    this.selectedRow = null;
    this.tableContent.nativeElement.style.width = "100%";
    this.sideNav.nativeElement.style.width = "0%";
    this.sideNav.nativeElement.classList.add('hide');
    this.selectedEmpData = '';
  }

  addKey(res) {
    res.map(
      ele => {
        ele['selected'] = false;
      }
    )
    return res;
  }

}
