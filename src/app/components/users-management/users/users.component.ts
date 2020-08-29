import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user-management/user.service';
import { HttpService } from '../../../services/http.service';
import * as moment from 'moment';
import { ExcelService } from '../../../services/excel.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  usersList: any = [];
  userListDataSource: any = [];
  isLangInstitute: boolean = false;
  dataFilter: any = {
    role: '1',
    is_active: true,
    is_show_credentials: false,
    master_course: '',
    course_id: 0,
    searchCriteria: '',
    app_downloaded: '-1'
  };
  allocateItemPopUp: boolean = false;
  tempdata: any = "";
  totalElementsInTableOne: any;
  inventoryList: any = [];
  inventoryAllocated: any = [];
  allocateInventory: any = {
    item_id: -1,
    alloted_units: 1
  };
  showUnit: boolean = false;
  availableunit: number = 0;
  showUserTable: boolean = false;
  PageIndex: number = 1;
  displayBatchSize: number = 10;
  searchDataFlag: boolean = false;
  searchedData: any = [];
  totalRow: number = 0;
  userSelected: any = [];
  searchText: any = "";
  toottip: string = "We can customize our users via providing or assigning different roles according to their activities.User can login with their credentials and can operate only their defined roles."
  isActiveUsers: boolean = true;
  selectAll: any = false;
  selectedRowCount: any = 0;
  masterCourseData: any[] = [];
  CourseData: any[] = [];
  isProfessional: any = false;
  notificationPopup: any = false;
  addSMS: any = false;
  editObj: any;
  editMsg: any = false;
  selectedMsg: any = '';
  smsNotification: any = true;
  pushNotification: any = true;
  messageCount: any = 0;
  message: any = '';
  messageList: any = [];
  loginHistoryPopup: any = false;
  loginHistory: any[] = [];
  historyPageIndex = 1;
  historyBatchSize = 10;
  historyTotalRow: any = 0;
  historyUserId: any = 0;
  sso_check: boolean = false;
  tableSetting: any = {
    keys: [
      { primaryKey: 'name', header: 'Name' },
      { primaryKey: 'username', header: 'Contact No' },
      { primaryKey: 'alternate_email_id', header: 'Email ID' },
      { primaryKey: 'username', header: 'Username' },
      { primaryKey: 'password', header: 'Password' },
      { primaryKey: 'last_login_date_time', header: 'Last Login' },
    ]
  };
  sizeArr: any[] = [25, 50, 100, 150, 200, 500, 1000];
  user_role: any = '';

  constructor(
    private apiService: UserService,
    private toastCtrl: AppComponent,
    private auth: AuthenticatorService,
    private router: Router,
    private httpService: HttpService,
    private excelService: ExcelService
  ) { }

  ngOnInit() {
    this.checkWhichTabIsOpen();
    this.checkInstituteType();
    this.getAllUserList(this.PageIndex);
    if (sessionStorage.getItem('permitted_roles')) {
      let permissions = Object.keys(JSON.parse(sessionStorage.getItem('permitted_roles')));
      if (permissions.includes('720')) {
        this.dataFilter.is_show_credentials = true;
      }
    }
    this.auth.institute_type.subscribe(
      res => {
        if (res == "LANG") {
          this.isProfessional = true;
        } else {
          this.isProfessional = false;
        }
      }
    )
    if (this.dataFilter.role == '1') {
      this.getMasterCourseData();
    }
    if (sessionStorage.getItem('single_device') == 'true' && sessionStorage.getItem('distinct_device_login') == 'true') {
      this.sso_check = true;
    }
  }

  checkWhichTabIsOpen() {
    let url = this.router.url;
    if (url.includes('user')) {
      this.switchActiveView('liUser');
    } else {
      this.switchActiveView('liRole');
    }
  }

  switchActiveView(id) {
    document.getElementById('liUser').classList.remove('active');
    document.getElementById('liRole').classList.remove('active');
    document.getElementById(id).classList.add('active');
  }

  getAllUserList(PageIndex) {
    if (this.dataFilter.role == "-1") {
      this.messageNotifier('error', '', 'Please Select User Type');
      return;
    }
    let Active: any = "";
    if (this.dataFilter.is_active) {
      Active = "Y";
      this.isActiveUsers = true;
    } else {
      Active = "N";
      this.isActiveUsers = false;
    }
    let startindex = this.displayBatchSize * (PageIndex - 1);
    let obj: any = {
      page_no: startindex,
      user_Type: this.dataFilter.role,
      page_offset: this.displayBatchSize
    }
    if (!this.isProfessional && this.dataFilter.role == '1') {
      obj.master_course_name = this.dataFilter.master_course,
        obj.course_id = this.dataFilter.course_id;
    }
    if (this.isProfessional && this.dataFilter.role == '1') {
      obj.standard_id = this.dataFilter.master_course,
        obj.subject_id = this.dataFilter.course_id;
    }
    if (this.dataFilter.searchCriteria != '') {
      obj.searchCriteria = this.dataFilter.searchCriteria;
    }
    if (this.dataFilter.app_downloaded != '-1') {
      if (this.dataFilter.app_downloaded == '3') {
        obj.is_logged_multiple_devices = 1;
      } else {
        obj.app_downloaded = this.dataFilter.app_downloaded;
      }
    }
    this.searchText = "";
    this.searchDataFlag = false;
    this.auth.showLoader();
    this.apiService.getUserList(obj, Active).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.totalRow = res.length;
        this.showUserTable = true;
        this.selectedRowCount = 0;
        this.usersList = this.addKeys(res, false);
        if (this.usersList && this.usersList.length) {
          this.totalRow = this.usersList[0].total_element_count;
          this.usersList.forEach(element => {
            element.isEncript = true;
            if (element.access_allow == '1') {
              element.access_allow_title = 'Block Access';
            } else if (element.access_allow == '2') {
              element.access_allow_title = 'Allow Access';
            } else {
              element.access_allow_title = '';
            }
          });
        }
        // this.fetchTableDataByPage(this.PageIndex, 'user');
      },
      err => {
        this.auth.hideLoader();
        this.showUserTable = false;
        console.log(err);
        this.messageNotifier('error', '', err.error.message);
      }
    )
  }

  clearData() {
    this.usersList = [];
    this.totalRow = 0;
    this.PageIndex = 1;
    this.displayBatchSize = 10;
    this.selectedRowCount = 0;
    this.userListDataSource = [];
    this.dataFilter.is_active = true;
    this.dataFilter.master_course = '';
    this.dataFilter.course_id = 0;
    this.dataFilter.searchCriteria = '';
    this.dataFilter.app_downloaded = '-1';
    if (this.dataFilter.role == '1') {
      this.getMasterCourseData();
    }
  }

  getMasterCourseData() {
    if (!this.isProfessional) {
      this.auth.showLoader();
      this.httpService.getData('/api/v1/courseMaster/fetch/' + sessionStorage.getItem('institute_id') + '/all').subscribe(
        (res: any) => {
          this.auth.hideLoader();
          this.masterCourseData = res;
        },
        err => {
          this.auth.hideLoader();
          this.messageNotifier('error', '', err.error.message);
        }
      )
    } else {
      this.auth.showLoader();
      this.httpService.getData('/api/v1/standards/all/' + sessionStorage.getItem('institute_id')).subscribe(
        (res: any) => {
          this.auth.hideLoader();
          this.masterCourseData = res;
        },
        err => {
          this.auth.hideLoader();
          this.messageNotifier('error', '', err.error.message);
        }
      )
    }
  }

  getCourseData(obj) {
    if (!this.isProfessional) {
      this.auth.showLoader();
      const url = '/api/v1/courseMaster/fetch/' + sessionStorage.getItem('institute_id') + '/' + this.dataFilter.master_course;
      this.httpService.getData(url).subscribe(
        (data: any) => {
          this.auth.hideLoader();
          this.CourseData = data.coursesList;
        },
        (error: any) => {
          this.auth.hideLoader();
        }
      )
    } else {
      this.auth.showLoader();
      const url = '/api/v1/subjects/standards/' + this.dataFilter.master_course;
      this.httpService.getData(url).subscribe(
        (data: any) => {
          this.auth.hideLoader();
          this.CourseData = data;
        },
        (error: any) => {
          this.auth.hideLoader();
        }
      )
    }
  }

  sendSmsForApp(type) {
    if (confirm('Are you sure you want to send SMS to selected users?')) {
      let data = {
        app_sms_type: type,
        userArray: this.getSelectedUser()
      };
      if (data.userArray.length == 0) {
        this.messageNotifier('error', '', 'Please select user');
        return;
      }
      this.apiService.sendSmS(data).subscribe(
        res => {
          this.messageNotifier('success', 'Sent successfully', 'SMS Sent Successfully');
        },
        err => {
          console.log(err);
          this.messageNotifier('error', '', err.error.message);
        }
      )
    }
  }

  allocateItemToUser(data) {
    this.tempdata = data;
    this.getInventoryItemList(data);
    this.getAllocatedItemHistrory(data);
    this.allocateItemPopUp = true;
  }

  closePopUp() {
    this.tempdata = "";
    this.allocateItemPopUp = false;
    this.showUnit = false;
    this.allocateInventory = {
      item_id: -1,
      alloted_units: 1
    };
    this.notificationPopup = false;
    this.loginHistoryPopup = false;
    this.historyPageIndex = 1;
  }

  getInventoryItemList(data) {
    this.auth.showLoader();
    this.apiService.getItemList(data.user_id).subscribe(
      res => {
        this.auth.hideLoader();
        this.inventoryList = res;
      },
      err => {
        this.auth.hideLoader();
        console.log(err);
      }
    )
  }

  getAllocatedItemHistrory(data) {
    this.auth.showLoader();
    this.apiService.getAllotedHistroy(data.user_id).subscribe(
      res => {
        this.auth.hideLoader();
        this.inventoryAllocated = res;
      },
      err => {
        this.auth.hideLoader();
        console.log(err);
      }
    )
  }

  allocateItem() {
    if (this.allocateInventory.item_id == -1) {
      this.messageNotifier('error', '', 'Please provide item details');
      return;
    }
    let unit: number = Number(this.allocateInventory.alloted_units);
    if (unit < 0) {
      this.messageNotifier('error', '', 'Please give valid unit');
      return;
    }
    if (this.availableunit < unit) {
      this.messageNotifier('error', '', 'Allocatd unit can not be greater than available unit');
      return;
    }
    let obj: any = {
      alloted_units: this.allocateInventory.alloted_units,
      item_id: this.allocateInventory.item_id,
      user_id: this.tempdata.user_id
    }
    this.auth.showLoader();
    this.apiService.allocateItem(obj).subscribe(
      res => {
        this.auth.hideLoader();
        this.messageNotifier('success', '', 'Inventory Allocate Successfully');
        this.getAllocatedItemHistrory(this.tempdata);
        this.allocateInventory = {
          item_id: -1,
          alloted_units: 1
        };
        this.showUnit = false;
      },
      err => {
        this.auth.hideLoader();
        console.log(err);
      }
    )
  }

  onitemSelction() {
    if (this.allocateInventory.item_id != '-1') {
      this.showUnit = true;
      for (let i = 0; i < this.inventoryList.length; i++) {
        if (this.inventoryList[i].item_id == this.allocateInventory.item_id) {
          this.availableunit = Number(this.inventoryList[i].available_units);
        }
      }
    } else {
      this.showUnit = false;
      this.availableunit = 0;
    }
  }

  deleteInventoryItem(data) {
    if (confirm('Are you sure you want to delete?')) {
      this.auth.showLoader();
      this.apiService.deleteInventory(data.allocation_id).subscribe(
        res => {
          this.auth.hideLoader();
          this.messageNotifier('success', 'Deleted', 'Item Deleted Successfully');
          this.getAllocatedItemHistrory(this.tempdata);
        },
        err => {
          this.auth.hideLoader();
          console.log(err);
          this.messageNotifier('error', '', err.error.message);
        }
      )
    }
  }

  descriptPassword(object) {
    object.isEncript = (!object.isEncript);
  }

  // pagination functions 
  fetchTableDataByPage(index, obj) {
    if (obj == 'user') {
      this.PageIndex = index;
      this.getAllUserList(this.PageIndex);
    } else {
      this.historyPageIndex = index;
      this.getLastLoginDetails(this.historyUserId, this.historyPageIndex);
    }
  }

  fetchNext(obj) {
    if (obj == 'user') {
      this.PageIndex++;
      this.fetchTableDataByPage(this.PageIndex, obj);
    } else {
      this.historyPageIndex++;
      this.fetchTableDataByPage(this.historyPageIndex, obj)
    }
  }

  fetchPrevious(obj) {
    if (obj == 'user') {
      if (this.PageIndex != 1) {
        this.PageIndex--;
        this.fetchTableDataByPage(this.PageIndex, obj);
      }
    } else {
      if (this.historyPageIndex != 1) {
        this.historyPageIndex--;
        this.fetchTableDataByPage(this.historyPageIndex, obj);
      }
    }
  }

  getDataFromDataSource(startindex, obj) {
    let data = [];
    if (this.searchDataFlag == true) {
      data = this.searchedData.slice(startindex, startindex + this.displayBatchSize);
    } else {
      data = this.userListDataSource.slice(startindex, startindex + this.displayBatchSize);
    }
    return data;
  }


  searchInList() {
    if (this.searchText != "" && this.searchText != null) {
      let searchData = this.userListDataSource.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchText.toLowerCase()))
      );
      this.searchedData = searchData;
      this.totalRow = searchData.length;
      this.searchDataFlag = true;
      this.PageIndex = 1;
      this.fetchTableDataByPage(this.PageIndex, 'user');
    } else {
      this.searchDataFlag = false;
      this.fetchTableDataByPage(this.PageIndex, 'user');
      this.totalRow = this.userListDataSource.length;
    }
  }

  getSelectedUser() {
    let arr: any = [];
    for (let i = 0; i < this.usersList.length; i++) {
      if (this.usersList[i].assigned == true) {
        arr.push(this.usersList[i].user_id);
      }
    }
    return arr;
  }

  userSelectedEvent(event, data) {
    if (event.target.checked) {
      this.userSelected.push(data);
    } else {
      for (let i = 0; i < this.userSelected.length; i++) {
        if (this.userSelected[i].user_id == data.user_id) {
          this.userSelected.splice(i, 1);
        }
      }
    }
  }


  addKeys(data, val) {
    data.forEach(
      element => {
        element.assigned = val;
      }
    )
    return data;
  }

  checkInstituteType() {
    this.auth.institute_type.subscribe(
      res => {
        if (res == "LANG") {
          this.isLangInstitute = true;
        } else {
          this.isLangInstitute = false;
        }
      }
    )
  }

  messageNotifier(type, title, msg) {
    let data = {
      type: type,
      title: title,
      body: msg
    }
    this.toastCtrl.popToast(data);
  }

  toggleAllCheckBox($event) {
    console.log('toggleAllCheckBox');
    this.usersList.forEach(element => {
      element.assigned = this.selectAll;
    });
    this.selectAll ? (this.selectedRowCount = this.usersList.length) : (this.selectedRowCount = 0);
  }

  isAllChecked(): boolean {
    return this.usersList.every(_ => _.assigned);
  }

  rowCheckboxChange(record) {
    (record.assigned) ? (this.selectedRowCount++) : (this.selectedRowCount--);
  }

  getAllMessageFromServer() {
    this.notificationPopup = true;
    this.checkRole();
    this.messageList = [];
    this.auth.showLoader();
    let obj = {
      from_date: '',
      to_date: moment().format("YYYY-MM-DD")
    }
    this.httpService.postData('/api/v1/notification/message/' + sessionStorage.getItem('institute_id') + '/all', obj).subscribe(
      res => {
        this.auth.hideLoader();
        this.messageList = res;
        if (this.messageList && this.messageList.length > 0) {
          this.messageList.forEach(msg => {
            msg.selected = false;
          });
        }
      },
      err => {
        this.auth.hideLoader();
      }
    )
  }

  editSMS(obj) {
    this.editMsg = true;
    this.addSMS = true;
    this.editObj = obj;
    this.message = obj.message;
  }

  saveMSG() {
    (this.editMsg) ? this.updateSMS() : this.saveSMS();
  }

  saveSMS() {
    let obj = { message: this.message };
    if (this.message != '' && this.message.trim() != '') {
      this.auth.showLoader();
      this.httpService.postData('/api/v1/notification/message/' + sessionStorage.getItem('institute_id'), obj).subscribe(
        (res: any) => {
          this.messageNotifier('success', '', 'Message created Successfully');
          this.auth.hideLoader();
          this.getAllMessageFromServer();
        },
        err => {
          this.auth.hideLoader();
        }
      )
      this.addSMS = false;
    } else {
      this.messageNotifier('error', '', 'Please enter message');
    }
  }

  updateSMS() {
    let obj = { message: this.message };
    if (this.message != '' && this.message.trim() != '') {
      this.auth.showLoader();
      this.httpService.putData('/api/v1/notification/message/' + sessionStorage.getItem('institute_id') + '/' + this.editObj.message_id, obj).subscribe(
        (res: any) => {
          this.auth.hideLoader();
          this.messageNotifier('success', '', 'Message updated Successfully');
          this.getAllMessageFromServer();
        },
        err => {
          this.auth.hideLoader();
        }
      )
      this.addSMS = false;
    } else {
      this.messageNotifier('error', '', 'Please enter message');
    }
  }

  ApproveMsg(message_id) {
    if (confirm('Are you sure, You want to approve the message?')) {
      const obj = {
        status: 1
      };
      this.auth.showLoader();
      this.httpService.putData('/api/v1/notification/message/' + sessionStorage.getItem('institute_id') + '/' + message_id, obj).subscribe(
        (res: any) => {
          this.auth.hideLoader();
          this.messageNotifier('success', '', 'Message approved successfully');
          this.getAllMessageFromServer();
        },
        err => {
          this.auth.hideLoader();
          this.messageNotifier('error', '', err.error.message);
        }
      );
    }
  }

  DeleteMsg(message_id) {
    if (confirm('Are you sure, You want to delete the message?')) {
      const obj = {
        status: 400
      };
      this.auth.showLoader();
      this.httpService.putData('/api/v1/notification/message/' + sessionStorage.getItem('institute_id') + '/' + message_id, obj).subscribe(
        (res: any) => {
          this.auth.hideLoader();
          this.messageNotifier('success', '', 'Message deleted successfully');
          this.messageList = this.messageList.filter(msg => msg.message_id != message_id);
        },
        err => {
          this.auth.hideLoader();
          this.messageNotifier('error', '', err.error.message);
        }
      );
    }
  }

  changeSelectedMsg(obj) {
    this.selectedMsg = obj;
  }

  sendNotification() {
    console.log(this.smsNotification, this.pushNotification);
    this.smsNotification ? this.sendSMSNotification() : '';
    this.pushNotification ? this.sendPushNotification() : '';
    if (!this.smsNotification && !this.pushNotification) {
      this.messageNotifier('info', 'Please select Notification type', '');
    }
  }


  // Developed by Nalini
  // Send role to notification api to identify which user type is selected
  checkRole() {
    switch(this.dataFilter.role) {
      case '0' : {
         this.user_role = 'Custom';
          break;
      }
      case '1' : {
         this.user_role = 'Student';
         break;
      }
      case '3' : { this.user_role = 'Teacher';
                break;
    }
      case '5' : { this.user_role = 'Parent';
                break;
    }
      case '99' : { this.user_role = 'Open User';
                break;
    }
    }
  }

  sendSMSNotification() {
    if (!this.getNotificationMessage()) {
      return;
    }
    let studentID = this.getListOfIds('user_id');
    let obj = {
      delivery_mode: 0,
      notifn_message: this.selectedMsg.message,
      notifn_subject: "",
      destination: null,
      user_ids: studentID,
      cancel_date: '',
      isEnquiry_notifn: 0,
      isAlumniSMS: 0,
      isTeacherSMS: 0,
      configuredMessage: true,
      message_id: this.selectedMsg.message_id,
      is_user_notify: 1,
      institution_id: sessionStorage.getItem('institute_id'),
      role: this.user_role
    };
    // if (this.transational_type ==2) {
    //   obj.configuredMessage = false;
    // }
    this.auth.showLoader();
    this.httpService.postData('/api/v1/alerts/config', obj).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.messageNotifier('success', '', 'Message sent successfully');
      },
      err => {
        this.auth.hideLoader();
      }
    )
    this.closeNotificationPopup();
  }

  closeNotificationPopup() {
    this.notificationPopup = false;
    this.smsNotification = true;
    this.pushNotification = true;
    this.addSMS = false;
  }

  sendPushNotification() {
    let student_id = this.getListOfIds('user_id');
    student_id = student_id.join(',');
    if (!this.getNotificationMessage()) {
      return;
    }
    let obj = {
      notifn_message: this.selectedMsg.message,
      message_id: this.selectedMsg.messageId,
      student_ids: student_id,
      institution_id: sessionStorage.getItem('institute_id')
    }
    this.auth.showLoader();
    this.httpService.postData('/api/v1/pushNotification/send', obj).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.messageNotifier('success', '', 'Message sent successfully');
      },
      err => {
        this.auth.hideLoader();
      }
    )
    this.closeNotificationPopup();
  }

  getNotificationMessage() {
    if (this.selectedMsg == '') {
      this.messageNotifier('error', '', 'Please select message');
      return false;
    } else {
      return true;
    }
  }

  getListOfIds(key) {
    let id: any = [];
    for (let t = 0; t < this.usersList.length; t++) {
      if (this.usersList[t].assigned == true) {
        id.push(this.usersList[t][key]);
      }
    }
    return id;
  }
  //Changing the url it the pageOffset in not equal to 1. If not equal to 1 then add query param totalElementsInTableOne and assign value which get from previous response in total_element_table_one;
  //Added by Ashwini Kumar Gupta 
  getLastLoginDetails(id, index) {
    this.historyUserId = id;
    let url: any;
    if (index == 1) {
      url = '/api/v1/login/history/' + id + '?pageOffset=' + index;
    }
    else {
      url = '/api/v1/login/history/' + id + '?pageOffset=' + index + '&totalElementsInTableOne=' + this.totalElementsInTableOne;
    }
    this.auth.showLoader();
    this.httpService.getData(url).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.loginHistory = res.result.response;
        if (index == 1) {
          this.historyTotalRow = res.result.totalElements;
        }
        this.loginHistoryPopup = true;
        this.totalElementsInTableOne = res.result.total_element_table_one;
      },
      err => {
        this.auth.hideLoader();
      }
    );
  }

  changeUserAccess(obj) {
    let allow_access = false;
    allow_access = (obj.access_allow == 1) ? false : true;
    let msgType = '';
    msgType = (obj.access_allow == 1) ? 'Block access' : 'Allow Access';
    if (confirm('Are you sure you want to ' + msgType + ' ?')) {
      this.auth.showLoader();
      this.httpService.getData('/api/v1/authenticate/blockUserAccess/' + obj.user_id + '?access=' + allow_access).subscribe(
        (res: any) => {
          msgType = (obj.access_allow == 1) ? 'blocked' : 'allowed';
          this.messageNotifier('success', '', 'Access has been ' + msgType + ' for the user.');
          this.auth.hideLoader();
          this.getAllUserList(this.PageIndex);
        },
        err => {
          this.auth.hideLoader();
        }
      );
    }
  }

  clearRegisteredDevices(id) {
    this.auth.showLoader();
    this.httpService.getData('/api/v1/authenticate/clearRegisteredDevices/' + id).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.messageNotifier('success', '', 'Registered device has been cleared!');
        this.getAllUserList(this.PageIndex);
      },
      err => {
        this.auth.hideLoader();
      }
    );
  }

  sendLoginCredentials(type) {
    let studentID = this.getListOfIds('user_id');
    let obj = {
      delivery_mode: 0,
      user_ids: studentID,
      configuredMessage: false,
      message_id: this.selectedMsg.message_id,
      is_user_notify: 1,
      institution_id: sessionStorage.getItem('institute_id'),
      app_sms_type: type,
      user_role: 0
    };
    let msgType = '';
    msgType = (type == '4') ? 'Send Login Credentials' : 'Send App Link';
    if (confirm('Are you sure you want to ' + msgType + ' to selected users?')) {
      this.auth.showLoader();
      this.httpService.postData('/api/v1/alerts/config', obj).subscribe(
        (res: any) => {
          this.auth.hideLoader();
          this.messageNotifier('success', '', 'Message sent successfully');
        },
        err => {
          this.auth.hideLoader();
        }
      )
      this.closeNotificationPopup();
    }
  }

  exportToExcel() {
    let arr = this.usersList;
    let Excelarr = [];
    arr.map(
      (ele: any) => {
        let json = {}
        this.tableSetting.keys.map((keys) => {
          json[keys.header] = ele[keys.primaryKey]
        })
        Excelarr.push(json);
      }
    )
    this.excelService.exportAsExcelFile(
      Excelarr,
      'User'
    );
  }

  updateTableBatchSize(event) {
    this.displayBatchSize = event;
    this.fetchTableDataByPage(this.PageIndex, 'user');
  }



}
