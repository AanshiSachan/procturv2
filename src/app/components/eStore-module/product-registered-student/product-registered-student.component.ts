import { Component, OnInit } from '@angular/core';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { MessageShowService } from '../../../services/message-show.service';
import { ProductService } from '../../../services/products.service';
import { TablePreferencesService } from '../../../services/table-preference/table-preferences.service';
import { DropData } from '../../shared/ng-robAdvanceTable/dropmenu/dropmenu.model';
import { Router } from '@angular/router';
import { HttpService } from '../../../services/http.service';
import * as moment from 'moment';
import { ExcelService } from '../../../services/excel.service';

@Component({
  selector: 'app-registered-student',
  templateUrl: './product-registered-student.component.html',
  styleUrls: ['./product-registered-student.component.scss']
})
export class RegisteredStudentComponent implements OnInit {

  usersList: any = [];
  searchedData: any = [];
  productList: any = [];
  EcourseData: any = [];
  displayKeys: any = [];
  searchText: any = '';
  filter: any = {
    product_id: '',
    course_type_id: '0'
  };
  searchDataFlag = false;
  AdvanceFilter: boolean = false;
  selectedRecord: any = {
    name: '',
    phone: '',
    email: '',
    gender: '',
    dob: '',
    parent_email: '',
    school_name: '',
    standard_id: '',
    parent_name: '',
    parent_phone: '',
    school_id: '',
    curr_address: '',
    country_id: '',
    user_id: ''
  };
  selectAll: any = false;
  showDropMenu: any = false;
  selectedRowCount: any = 0;
  isOptions: any = false;
  notificationPopup: any = false;
  messageList: any = [];
  message: any = '';
  addSMS: any = false;
  editObj: any;
  editMsg: any = false;
  selectedMsg: any = '';
  smsNotification: any = true;
  pushNotification: any = true;
  messageCount: any = 0;

  menuOptions: DropData[] = [
    {
      key: 'student',
      header: 'Convert to Admission',
    },
    {
      key: 'enquiry',
      header: 'Convert to Enquiry',
    }
  ];

  tableSetting: any = {
    keys: [
      { primaryKey: 'name', header: 'Name' },
      { primaryKey: 'phone', header: 'Phone' },
      { primaryKey: 'email_id', header: 'Email ID' },
      { primaryKey: 'registered_date', header: 'Registered Date' },
      { primaryKey: 'open_user_status', header: 'Status' },
    ]
  };


  varJson: any = {
    PageIndex: 1,
    sizeArr: [5, 25, 50, 100, 150, 200, 500],
    displayBatchSize: 25,
    total_items: 0
  };

  constructor(
    private _msgService: MessageShowService,
    private auth: AuthenticatorService,
    private _tablePreferencesService: TablePreferencesService,
    private http: ProductService,
    private router: Router,
    private httpService: HttpService,
    private excelService: ExcelService
  ) {
  }

  ngOnInit() {
    this.getProductList();
    this.getEcourseList();
  }

  getProductList() {
    this.auth.showLoader();
    this.http.getMethod('product/get-product-list', null).subscribe(
      (data: any) => {
        this.productList = data.result;
        this.auth.hideLoader();
      },
      err => {
        this.auth.hideLoader();
        this._msgService.showErrorMessage('error', '', err.error.message);
      }
    )
  }

  getEcourseList() {
    this.auth.showLoader();
    this.httpService.getData('/api/v1/institute/courseMapping/' + sessionStorage.getItem('institute_id') + '?isOnline=all').subscribe(
      (data: any) => {
        this.auth.hideLoader();
        this.EcourseData = data;
      },
      err => {
        this.auth.hideLoader();
        this._msgService.showErrorMessage('error', '', err.error.message);
      }
    );
  }

  filterData(PageIndex) {
    this.varJson.PageIndex = PageIndex;
    let start_index = this.varJson.displayBatchSize * (PageIndex - 1);
    let data: any;
    data = {
      'by': [
        {
          'column': 'productId',
          'value': this.filter.product_id
        },
        {
          'column': 'eCourseId',
          'value': Number(this.filter.course_type_id)
        }
      ],
      'start_index': start_index,
      'no_of_records': this.varJson.displayBatchSize,
    };
    this.auth.showLoader();
    this.http.postMethod('user-product/get-user-details', data).then(
      (data: any) => {
        this.auth.hideLoader();
        this.selectedRowCount = 0;
        if (data.body.result != null) {
          this.usersList = data.body.result;
          if (this.usersList && this.usersList.length) {
            this.varJson.total_items = this.usersList[0].total_record;
            this.usersList.forEach(element => {
              if (element.open_user_status == 'No Action') {
                element.open_user_status = '-';
              }
              element.ecourse_list = element.ecourse_list.join();
            });
          }
        }
        this.searchedData = this.usersList;
      },
      err => {
        this.auth.hideLoader();
        this._msgService.showErrorMessage('error', '', err.error.message);
      }
    );

  }

  optionSelected(e) {
    let action = e.action._value;
    let obj = e.data;
    this.auth.showLoader();
    this.httpService.getData('/api/v2/user/' + obj.user_id).subscribe(
      (res: any) => {
        this.selectedRecord = {
          name: res.result.name,
          phone: res.result.mobile_no,
          email: res.result.email_id,
          gender: res.result.gender,
          dob: res.result.dob,
          parent_email: res.result.parent_email,
          school_name: res.result.school_id,
          standard_id: res.result.standard_id,
          parent_name: res.result.parent_name,
          parent_phone: res.result.parent_phone,
          school_id: res.result.school_id,
          curr_address: res.result.address,
          country_id: res.result.country_id,
          user_id: res.result.user_id,
          state_id: res.result.state_id,
          city_id: res.result.city_id,
          source: res.result.source,
          master_course: res.result.master_course,
          course_id: res.result.course_id,
          course_assign: res.result.course_assign
        };
        this.auth.hideLoader();
        this.performAction(action);
      },
      err => {
        this.auth.hideLoader();
        this.performAction(action);
      }
    )
  }

  performAction(action) {
    if (action == 'Convert to Admission') {
      sessionStorage.setItem('studentPrefill', JSON.stringify(this.selectedRecord));
      this.router.navigate(['/view/students/add']);
    }
    if (action == 'Convert to Enquiry') {
      sessionStorage.setItem('enquiryPrefill', JSON.stringify(this.selectedRecord));
      this.router.navigate(['view/leads/add']);
    }
  }

  toggleAllCheckBox($event) {
    console.log('toggleAllCheckBox');
    this.usersList.forEach(element => {
      element.isSelected = this.selectAll;
    });
    this.selectAll ? (this.selectedRowCount = this.usersList.length) : (this.selectedRowCount = 0);
    // if(this.selectAll){
    //   this.selectedRowCount = this.usersList.length;
    // } else {}
  }

  isAllChecked(): boolean {
    return this.usersList.every(_ => _.isSelected);
  }

  rowCheckboxChange(record) {
    (record.isSelected) ? (this.selectedRowCount++) : (this.selectedRowCount--);
  }

  /*** pagination functions */
  /* Fetch next set of data from server and update table */
  fetchNext() {
    this.varJson.PageIndex++;
    this.filterData(this.varJson.PageIndex);
  }

  /* Fetch previous set of data from server and update table */
  fetchPrevious() {
    this.varJson.PageIndex--;
    this.filterData(this.varJson.PageIndex);
  }

  updateTableBatchSize(num) {
    this.varJson.PageIndex = 1;
    this.varJson.displayBatchSize = parseInt(num);
    this.filterData(this.varJson.PageIndex);
  }

  getAllMessageFromServer() {
    this.notificationPopup = true;
    this.messageList = [];
    let tempMessageList: any = [];
    this.auth.showLoader();
    let obj = {
      from_date: '',
      to_date: moment().format("YYYY-MM-DD")
    }
    this.httpService.postData('/api/v1/notification/message/' + sessionStorage.getItem('institute_id') + '/all', obj).subscribe(
      res => {
        this.auth.hideLoader();
        tempMessageList = res;
        for (let i = 0; i < tempMessageList.length; i++) {
          if (tempMessageList[i].source === "SMS") {
            this.messageList.push(tempMessageList[i]);
          }
        }
        // this.messageList = res;
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
          this._msgService.showErrorMessage('success', '', 'Message created Successfully');
          this.auth.hideLoader();
          this.getAllMessageFromServer();
        },
        err => {
          this.auth.hideLoader();
        }
      )
      this.addSMS = false;
    } else {
      this._msgService.showErrorMessage('error', '', 'Please enter message');
    }
  }

  updateSMS() {
    let obj = { message: this.message };
    if (this.message != '' && this.message.trim() != '') {
      this.auth.showLoader();
      this.httpService.putData('/api/v1/notification/message/' + sessionStorage.getItem('institute_id') + '/' + this.editObj.message_id, obj).subscribe(
        (res: any) => {
          this.auth.hideLoader();
          this._msgService.showErrorMessage('success', '', 'Message updated Successfully');
          this.getAllMessageFromServer();
        },
        err => {
          this.auth.hideLoader();
        }
      )
      this.addSMS = false;
    } else {
      this._msgService.showErrorMessage('error', '', 'Please enter message');
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
          this._msgService.showErrorMessage('success', '', 'Message approved successfully');
          this.getAllMessageFromServer();
        },
        err => {
          this.auth.hideLoader();
          this._msgService.showErrorMessage('error', '', err.error.message);
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
          this._msgService.showErrorMessage('success', '', 'Message deleted successfully');
          this.messageList = this.messageList.filter(msg => msg.message_id != message_id);
        },
        err => {
          this.auth.hideLoader();
          this._msgService.showErrorMessage('error', '', err.error.message);
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
      this._msgService.showErrorMessage('info', 'Please select Notification type', '');
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
      institution_id: sessionStorage.getItem('institute_id')
    };
    // if (this.transational_type ==2) {
    //   obj.configuredMessage = false;
    // }
    this.auth.showLoader();
    this.httpService.postData('/api/v1/alerts/config', obj).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this._msgService.showErrorMessage('success', '', 'Message sent successfully');
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
        this._msgService.showErrorMessage('success', '', 'Message sent successfully');
      },
      err => {
        this.auth.hideLoader();
      }
    )
    this.closeNotificationPopup();
  }

  getNotificationMessage() {
    if (this.selectedMsg == '') {
      this._msgService.showErrorMessage('error', '', 'Please select message');
      return false;
    } else {
      return true;
    }
  }

  getListOfIds(key) {
    let id: any = [];
    for (let t = 0; t < this.usersList.length; t++) {
      if (this.usersList[t].isSelected == true) {
        id.push(this.usersList[t][key]);
      }
    }
    return id;
  }

  exportToExcel() {
    let data = {
      'by': [
        {
          'column': 'productId',
          'value': this.filter.product_id
        },
        {
          'column': 'eCourseId',
          'value': Number(this.filter.course_type_id)
        }
      ],
      'start_index': 0,
      'no_of_records': 0,
    };
    this.auth.showLoader();
    this.http.postMethod('user-product/get-user-details', data).then(
      (data: any) => {
        this.auth.hideLoader();
        if (data.body.result != null) {
          let arr = data.body.result;
          if (arr && arr.length) {
            arr.forEach(element => {
              if (element.open_user_status == 'No Action') {
                element.open_user_status = '-';
              }
            });
          }
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
            'register_user'
          );
        }
      },
      err => {
        this.auth.hideLoader();
        this._msgService.showErrorMessage('error', '', err.error.message);
      }
    );
  }

  clearFilter() {
    this.filter = {
      product_id: '',
      course_type_id: '0'
    };
  }

  searchInList() {
    if (this.searchText != "" && this.searchText != null) {
      let searchData = this.usersList.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchText.toLowerCase()))
      );
      this.searchedData = searchData;
      this.varJson.total_items = searchData.length;
      this.searchDataFlag = true;
      this.varJson.PageIndex = 1;
    } else {
      console.log(this.usersList);
      this.searchDataFlag = false;
      this.filterData(this.varJson.PageIndex);
    }
  }

  countNumberOfMessage() {
    let uniCodeFlag = this.hasUnicode(this.message);
    let charLimit = 160;
    if (uniCodeFlag) {
      charLimit = 70
    }
    if (this.message.length == 0) {
      this.messageCount = 0;
    }
    else if (this.message.length > 0 && this.message.length <= charLimit) {
      this.messageCount = 1;
    }
    else {
      let count = Math.ceil(this.message.length / charLimit);
      this.messageCount = count;
    }
  }

  hasUnicode(str) {
    for (var i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) > 127) return true;
    }
    return false;
  }
}

