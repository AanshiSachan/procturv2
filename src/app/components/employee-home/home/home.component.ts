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
  dataStatus: number = 3;
  totalRow: number = 0;
  selectedRow: number = null;
  @ViewChild('tableContent') tableContent: ElementRef;
  @ViewChild('sideNav') sideNav: ElementRef;
  selectedEmpData: any = '';
  bulkActionItems: MenuItem[];
  searchTextEntered: any = "";
  isRippleLoad: boolean = false;
  selectedEmployeeID: any = [];
  sendNotificationPopUp: boolean = false;
  messageList: any = [];
  addNewMessageText: string = "";
  messageCount: number = 0;
  addNewMessageSection: boolean = false;
  isAdminRole: boolean = false;
  showOpenMessage: boolean = false;
  approvedMessageList: any = [];
  messageApproval = sessionStorage.getItem('allow_sms_approve_feature');
  dummyArr: any[] = [0, 1, 2, 3, 4, 0, 1, 2, 3, 4];
  columnMaps: any[] = [0, 1, 2, 3, 4, 5];

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
    this.giveFullPermisionOfBulfAction();
    this.checkRoleBased();
  }

  checkRoleBased() {
    let userType: any = Number(sessionStorage.getItem('userType'));
    if (userType != 3) {
      let permissionArray = sessionStorage.getItem('permissions');
      if (permissionArray == "" || permissionArray == null) {
        this.isAdminRole = true;
      } else {
        this.isAdminRole = false;;
      }
    } else {
      this.isAdminRole = false;
    }
  }

  onViewBtnClick() {
    let data = this.checkUserProvidedFields();
    this.PageIndex = 1;
    this.isRippleLoad = true;
    this.dataStatus = 1;
    this.apiService.searchEmployee(data.name, data.number).subscribe(
      res => {
        this.dataStatus = 2;
        this.isRippleLoad = false;
        this.employeeListDataSource = this.addKey(res);
        this.totalRow = res.length;
        this.fetchTableDataByPage(this.PageIndex);
      },
      err => {
        this.dataStatus = 2;
        this.isRippleLoad = false;
        this.messageNotifier('error', 'Error', err.error.message);
      }
    )

  }

  checkUserProvidedFields() {
    let obj: any = {};
    if (isNaN(this.searchTextEntered)) {
      obj.name = this.searchTextEntered;
      obj.number = "";
    } else {
      obj.number = this.searchTextEntered;
      obj.name = "";
    }
    return obj;
  }

  onCheckoxSelction(event) {
    this.selectedEmployeeID = [];
    if (event.target.checked) {
      this.employeeListDataSource.map(
        ele => {
          ele.selected = true;
          this.selectedEmployeeID.push(ele.emp_id);
        }
      )
    } else {
      this.employeeListDataSource.map(
        ele => {
          ele.selected = false;
        }
      )
    }
  }

  onRowCheckBoxSelect(row) {
    if (row.selected) {
      if (this.selectedEmployeeID.indexOf(row.emp_id) == -1) {
        this.selectedEmployeeID.push(row.emp_id);
      }
    } else {
      if (this.selectedEmployeeID.indexOf(row.emp_id) != -1) {
        this.selectedEmployeeID.splice(this.selectedEmployeeID.index(row.emp_id), 1);
      }
    }
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

  bulkDeleteEmployee() {

  }

  sendBulkSms() {
    this.sendNotificationPopUp = true;
    this.fetchAllMessage();
    this.addNewMessageText = "";
    this.addNewMessageSection = false;
  }

  fetchAllMessage() {
    this.messageList = [];
    this.approvedMessageList = [];
    this.isRippleLoad = true;
    this.apiService.getMessageList().subscribe(
      res => {
        this.isRippleLoad = false;
        this.messageList = res;
        res.map(
          ele => {
            if (ele.statusValue == "Approved") {
              ele['selected'] = false;
              this.approvedMessageList.push(ele);
            }
          }
        )
      },
      err => {
        this.isRippleLoad = false;
        this.messageNotifier('error', 'Error', err.error.message);
      }
    )
  }

  toggleCreateNewMessage() {
    if (this.addNewMessageSection == false) {
      this.addNewMessageSection = true;
      document.getElementById('showCloseBtn').style.display = '';
      document.getElementById('showAddBtn').style.display = 'none';
    } else {
      this.addNewMessageSection = false;
      document.getElementById('showCloseBtn').style.display = 'none';
      document.getElementById('showAddBtn').style.display = '';
    }
  }

  countNumberOfMessage(){
    if(this.addNewMessageText.length == 0){
      this.messageCount = 0;
    }
    else{
      let count = Math.floor(this.addNewMessageText.length / 160);
      console.log(count);

    }
  }

  saveNewMessage() {
    if (this.addNewMessageText.trim() == "") {
      this.messageNotifier('error', 'Error', "Please provide text");
      return;
    } else {
      if (this.addNewMessageText.length > 500) {
        this.messageNotifier('error', 'Error', "Message can't exceed 500 character length");
        return;
      } else {
        let obj = {
          message: this.addNewMessageText.trim(),
          status: 0
        }
        this.isRippleLoad = true;
        this.apiService.addNewMessage(obj).subscribe(
          res => {
            this.isRippleLoad = false;
            this.messageNotifier('success', 'Added Successfully', 'Message Added Successfully');
            this.toggleCreateNewMessage();
            this.addNewMessageText = "";
            this.fetchAllMessage();
          },
          err => {
            this.isRippleLoad = false;
            this.messageList('error', 'Error', err.error.message);
          }
        )
      }
    }

  }

  onTabChange(tabname) {
    this.showOpenMessage = false;
    document.getElementById('approvedSMSTab').classList.remove('active');
    document.getElementById('openSMSTab').classList.remove('active');
    if (tabname == 'approved') {
      document.getElementById('approvedSMSTab').classList.add('active');
    } else {
      this.showOpenMessage = true;
      document.getElementById('openSMSTab').classList.add('active');
    }
  }

  approveRejectSms(data) {
    if (confirm('Are you sure, you want to approve this message?')) {
      this.isRippleLoad = true;
      this.apiService.approveMessageStatus({ status: 1 }, data.message_id).subscribe(
        res => {
          this.isRippleLoad = false;
          this.messageNotifier('success', 'Approved', 'Message approved successfully');
          this.fetchAllMessage();
        },
        err => {
          this.isRippleLoad = false;
          this.messageNotifier('error', 'Error', err.error.message);
        }
      )
    }
  }

  deleteSms(data) {
    if (confirm('Are you sure, you want to delete this message?')) {
      this.isRippleLoad = true;
      this.apiService.deleteMessage(data.message_id).subscribe(
        res => {
          this.isRippleLoad = false;
          this.messageNotifier('success', 'Deletes', 'Message deleted successfully');
          this.fetchAllMessage();
        },
        err => {
          this.isRippleLoad = false;
          this.messageNotifier('error', 'Error', err.error.message);
        }
      )
    }
  }


  editMessage(index) {
    document.getElementById("row" + index).classList.remove('displayComp');
    document.getElementById("row" + index).classList.add('editComp');
  }

  cancelRow(id) {
    document.getElementById(("row" + id).toString()).classList.remove('editComp');
    document.getElementById(("row" + id).toString()).classList.add('displayComp');
    this.fetchAllMessage();
  }

  updateMessageDetails(data) {
    if (data.message.trim() != "" || data.message.trim() != null) {
      let obj = {
        message: data.message,
        status: 0
      }
      this.isRippleLoad = true;
      this.apiService.editMessage(obj, data.message_id).subscribe(
        res => {
          this.isRippleLoad = false;
          this.messageNotifier('success', 'Saved Successfully', 'Message saved');
          this.fetchAllMessage();
        },
        err => {
          this.isRippleLoad = false;
          this.messageNotifier('error', 'Error', err.error.message);
        }
      )
    }
  }


  onMessageCheckBox(data) {
    this.approvedMessageList.map(
      ele => {
        if (ele.message_id == data.message_id) {
          ele.selected = true;
        } else {
          ele.selected = false;
        }
      }
    )
  }

  sendSMSToEmployees() {
    let selectedMsg: any = this.getContent(this.approvedMessageList, 'selected', true);
    if (selectedMsg.length == 0) {
      this.messageNotifier('error', 'Error', 'Please select a message');
      return;
    } else {
      if (this.selectedEmployeeID.length > 0) {
        let obj: any = {
          delivery_mode: 0,
          message_id: selectedMsg.message_id,
          notifn_message: selectedMsg.message,
          configuredMessage: true,
          emp_ids: this.selectedEmployeeID.join(',')
        }
        this.apiService.sendNotificationToUser(obj).subscribe(
          res => {
            this.messageNotifier('success', 'SMS Send Successfully', '');
            this.closePopup();
          }
        )
      } else {
        this.messageNotifier('error', 'Error', 'Please select a user');
        return;
      }
    }
  }

  closePopup() {
    this.sendNotificationPopUp = false;
    this.messageList = [];
    this.approvedMessageList = [];
  }

  downloadBulkIdCard() {

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

  getContent(data, key, value) {
    let arr = [];
    data.map(
      ele => {
        if (ele[key] == value) {
          arr.push(ele);
        }
      }
    )
    return arr;
  }

}
