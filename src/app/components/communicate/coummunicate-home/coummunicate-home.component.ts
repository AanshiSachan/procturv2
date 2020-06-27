import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { document } from 'ngx-bootstrap-custome/utils/facade/browser';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { WidgetService } from '../../../services/widget.service';
import { AppComponent } from '../../../app.component';
import { ProductService } from '../../../services/products.service';

declare var $;

@Component({
  selector: 'app-coummunicate-home',
  templateUrl: './coummunicate-home.component.html',
  styleUrls: ['./coummunicate-home.component.scss']
})
export class CoummunicateHomeComponent implements OnInit {

  @ViewChild('ref') private ref: ElementRef;

  permissions: any;
  showSMSReport: boolean = false;
  showEmailReport: boolean = false;
  permissionArray = sessionStorage.getItem('permissions');
  notificationPopUp: boolean = false;
  isProfessional: boolean = false;
  batchList: any = [];
  courseList: any = [];
  sendNotification = {
    standard_id: '-1',
    subject_id: '-1',
    batch_id: '-1',
  };
  studentList: any = [];
  masterCourseList: any = [];
  combinedDataRes: any = {};
  sendNotificationCourse = {
    master_course: '',
    course_id: ''
  }
  addNotification: boolean = false;
  showTableFlag: boolean = false;
  showEmailSubject: boolean = false;
  messageSubject: any = "";
  messageArea: any = "";
  selectedOption: any = "";
  messageList: any = [];
  loginField = {
    checkBox: '0'
  }
  jsonFlag: any = {
    smsTabType: 'approved',
    showAllMessage: false,
    openMessageFlag: false,
    editMessage: false,
    messageObject: {}
  };
  studentSelected: boolean = false;
  userType : any = '';
  newMessageText: string = "";
  messageCount: number = 0;
  openMessageList: any = [];
  allChecked: boolean = true;
  searchData: string = "";
  openAppUserSelected = false;

  constructor(
    private auth: AuthenticatorService,
    private widgetService: WidgetService,
    private appC: AppComponent,
    private productService: ProductService
  ) { }

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
    this.userType =  Number(sessionStorage.getItem('userType'));
    this.permissionArray = sessionStorage.getItem('permissions');
    if(sessionStorage.getItem('userType') != '0' || sessionStorage.getItem('username') != 'admin'){
      if(sessionStorage.getItem('permissions') != '' && sessionStorage.getItem('permissions') != null){
          this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
          this.showSMSReport = this.permissions.includes('206') ? true: false;//sms visiblity
          this.showEmailReport = this.permissions.includes('207') ? true : false; //email visiblity
      }
    }
    else {
      this.showSMSReport = true;
      this.showEmailReport = true;
    }
  }

  checkIfUserHadAccess(id) {
    this.permissionArray = sessionStorage.getItem('permissions');
    if (this.permissionArray == "" || this.permissionArray == null) {
      return false;
    } else {
      let data = JSON.parse(this.permissionArray);
      if (id != "" && data != null && data != "") {
        if (data.indexOf(id) == "-1") {
          return true;
        } else {
          return false;
        }
      } else {
        return '';
      }
    }

  }
  addSendNotification() {
    this.notificationPopUp = true;
    this.clearDropDownBinding();
    if (this.isProfessional) {
      this.getMasterCourseAndBatch(this.sendNotification);
    } else {
      this.getMaterCourseList();
    }
  }

  getMaterCourseList() {
    this.flushData();
    this.auth.showLoader();
    this.widgetService.getAllMasterCourse().subscribe(
      res => {
       this.auth.hideLoader();
        //console.log(res);
        this.masterCourseList = res;
      },
      err => {
       this.auth.hideLoader();
        //console.log(err);
      }
    )
  }
  fetchDataOnBatchBasis(event) {
    if(this.userType!=3){
    document.getElementById('chkBoxActiveSelection').checked = false;
    document.getElementById('chkBoxTutorSelection').checked = false;
    document.getElementById('chkBoxInActiveSelection').checked = false;
    document.getElementById('chkBoxAluminiSelection').checked = false;
    }
    if (this.sendNotification.batch_id == "-1") {
      this.showTableFlag = false;
    } else {
      this.widgetService.fetchStudentListData(this.sendNotification.batch_id).subscribe(
        res => {
          this.showTableFlag = true;
          this.studentList = this.addKeys(res, true);
          this.selectedOption = "filter";
        },
        err => {
          //console.log(err);
        }
      )
    }
  }

  onMasterCourseChange(event) {
    if(this.userType!=3){
    document.getElementById('chkBoxActiveSelection').checked = false;
    document.getElementById('chkBoxTutorSelection').checked = false;
    document.getElementById('chkBoxInActiveSelection').checked = false;
    document.getElementById('chkBoxAluminiSelection').checked = false;
    document.getElementById('chkBoxOpenAppSelection').checked = false;
    this.openAppUserSelected = false;
    }
    this.flushData();
    if (this.sendNotificationCourse.master_course != "-1") {
      this.auth.showLoader();
      this.widgetService.getAllCourse(this.sendNotificationCourse.master_course).subscribe(
        (res: any) => {
          this.showTableFlag = false;
         this.auth.hideLoader();
          this.courseList = res.coursesList;
        },
        err => {
         this.auth.hideLoader();
          //console.log(err);
        }
      )
    }
  }

  onMasterCourseSelection(event) {
    if(this.userType!=3){
    document.getElementById('chkBoxActiveSelection').checked = false;
    document.getElementById('chkBoxTutorSelection').checked = false;
    document.getElementById('chkBoxInActiveSelection').checked = false;
    document.getElementById('chkBoxAluminiSelection').checked = false;
    }
    this.batchList = [];
    this.courseList = [];
    this.showTableFlag = false;
    this.sendNotification.subject_id = '-1';
    this.sendNotification.batch_id = '-1';
    this.showTableFlag = false;
    this.getMasterCourseAndBatch(this.sendNotification);
  }

  onCourseSelection(event) {
    if(this.userType!=3){
    document.getElementById('chkBoxActiveSelection').checked = false;
    document.getElementById('chkBoxTutorSelection').checked = false;
    document.getElementById('chkBoxInActiveSelection').checked = false;
    document.getElementById('chkBoxAluminiSelection').checked = false;
    }
    this.showTableFlag = false;
    this.batchList = [];
    this.sendNotification.batch_id = "-1";
    this.getMasterCourseAndBatch(this.sendNotification);
  }


  getMasterCourseAndBatch(data) {
    this.auth.showLoader();
    this.widgetService.fetchCombinedData(data.standard_id, data.subject_id).subscribe(
      (res: any) => {
       this.auth.hideLoader();
        this.combinedDataRes = res;
        if (res.standardLi != null) {
          this.masterCourseList = res.standardLi;
        }
        if (res.batchLi != null) {
          this.batchList = res.batchLi;
        }
        if (res.subjectLi != null) {
          this.courseList = res.subjectLi;
        }

      },
      err => {
       this.auth.hideLoader();
        //console.log(err);
      }
    )
  }

  flushData() {
    this.batchList = [];
    this.courseList = [];
    this.studentList = [];
  }

  clearDropDownBinding() {
    if (this.isProfessional) {
      this.sendNotification = {
        standard_id: '-1',
        subject_id: '-1',
        batch_id: '-1',
      };
    } else {
      this.sendNotificationCourse = {
        master_course: '',
        course_id: '-1'
      }
    }
  }

  closeNotificationPopUp() {
    this.notificationPopUp = false;
    this.addNotification = false;
    this.showTableFlag = false;
    this.showEmailSubject = false;
    this.messageSubject = "";
    this.messageArea = "";
  }

  validateAllFields() {
    if (this.showEmailSubject) {
      return this.getSubject();
    }

    if (this.selectedOption == "showTextBox") {
      return this.getMessageText();
    }
    return "";
  }

  getMessageText() {
    let text = this.messageArea;
    if (text.trim() == "" && text.trim() == null) {
      let msg = {
        type: 'error',
        title: '',
        body: "Please enter subject for email"
      };
      this.appC.popToast(msg);
      return false;
    } else {
      return text;
    }
  }

  getSubject() {
    let text = this.messageSubject;
    if (text.trim() == "" && text.trim() == null) {
      let msg = {
        type: 'error',
        title: '',
        body: "Please enter subject for email"
      };
      this.appC.popToast(msg);
      return false;
    } else {
      return text;
    }
  }

  getNotificationMessage() {
    let count = 0;
    for (let t = 0; t < this.messageList.length; t++) {
      if (this.messageList[t].assigned == true) {
        return {
          message: this.messageList[t].message, messageId: this.messageList[t].message_id
        };
      } else {
        count++;
      }
    }
    if (this.messageList.length == count) {
      let msg = {
        type: 'error',
        title: '',
        body: "Please select message"
      };
      this.appC.popToast(msg);
      return false;
    }
  }

  getDeliveryModeValue() {
    let sms = document.getElementById('chkbxSmsSend').checked;
    let email = document.getElementById('chkbxEmailSend').checked;
    if (sms == true && email == true) {
      return 2;
    } else if (sms == true && email == false) {
      return 0;
    } else if (sms == false && email == true) {
      return 1;
    } else {
      let msg = {
        type: 'error',
        title: '',
        body: "Please select Delivery Mode(SMS , Email)"
      };
      this.appC.popToast(msg);
      return false;
    }

  }

  getDestinationValue() {
    let student = document.getElementById('chkBoxStudent').checked;
    let parent = document.getElementById('chkBoxParent').checked;
    let gaurdian = document.getElementById('chkBoxGaurdian').checked;
    if (student == true && parent == false && gaurdian == false) {
      return 0;
    } else if (student == false && parent == true && gaurdian == false) {
      return 1;
    } else if (student == false && parent == false && gaurdian == true) {
      return 3;
    } else if (student && parent && gaurdian == false) {
      return 2;
    } else if (student && gaurdian && parent == false) {
      return 5;
    } else if (parent && gaurdian && student == false) {
      return 6;
    }
    else if (student && parent && gaurdian) {
      return 4;
    } else {
      let msg = {
        type: 'error',
        title: '',
        body: "Please correct option in Send SMS To.."
      };
      this.appC.popToast(msg);
      return false;
    }
  }

  selectTabMenu(id, div) {
    document.getElementById('liAdd').classList.add('hide');
    document.getElementById('divAudience').classList.add('hide');
    document.getElementById('divSendMessage').classList.add('hide');
    document.getElementById('idAudience').classList.remove('active');
    document.getElementById('idSendMessage').classList.remove('active');
    if(document.getElementById(id)){
      document.getElementById(id).classList.add('active');
      }
      if(document.getElementById(div)){
      document.getElementById(div).classList.remove('hide');
      }
      if(document.getElementById('divParentOrGaurdian')){
      document.getElementById('divParentOrGaurdian').classList.remove('hide');
      }
      if(document.getElementById('sendToHead')){
      document.getElementById('sendToHead').classList.remove('hide');
      }
      if(document.getElementById('chkbxEmailSend')){
      document.getElementById('chkbxEmailSend').checked = false;
      }
      if(document.getElementById('sendLoginChkbx')){
      document.getElementById('sendLoginChkbx').checked = false;
      }  
    this.showEmailSubject = false;
    if (div == "divSendMessage") {
      this.showViewContent();
      this.getAllMessageFromServer();
      document.getElementById('divDeliveryMode').classList.remove('remove');
      document.getElementById('divDeliveryMode').classList.add('show');
      document.getElementById('divLoginMode').classList.remove('show');
      document.getElementById('divLoginMode').classList.add('hide');
      document.getElementById('liAdd').classList.remove('hide');
      document.getElementById('chkbxEmailSend').checked = false;
      if (document.getElementById('chkBoxTutorSelection').checked) {
        document.getElementById('divParentOrGaurdian').classList.add('hide');
        document.getElementById('sendToHead').classList.add('hide');
      } else {
        document.getElementById('divParentOrGaurdian').classList.remove('hide');
        document.getElementById('sendToHead').classList.remove('hide');
      }
      if (this.selectedOption != "filter") {
        this.whichCheckBoxSelected();
      }
    }
  }

  whichCheckBoxSelected() {
    if (document.getElementById('chkBoxActiveSelection').checked) {
      this.selectedOption = "showTable";
      return;
    } else {
      this.selectedOption = "";
    }

    if (document.getElementById('chkBoxTutorSelection').checked) {
      this.selectedOption = "showTutor";
      return
    } else {
      this.selectedOption = "";
    }

    if (document.getElementById('chkBoxInActiveSelection').checked || document.getElementById('chkBoxAluminiSelection').checked  || document.getElementById('chkBoxOpenAppSelection').checked) {
      this.selectedOption = "showTextBox";
      return
    } else {
      this.selectedOption = "";
    }

  }


    showViewContent() {
      for (let t = 0; t < this.studentList.length; t++) {
        if (this.studentList[t].assigned == true) {
          this.studentSelected = true;
          break;
        } else {
          this.studentSelected = false;
        }
      }
    }

  getAllMessageFromServer() {
    this.messageList = [];
    this.auth.showLoader();
    let obj = {
      from_date: moment().subtract(1, 'months').format("YYYY-MM-DD"),
      status: 1,
      to_date: moment().format("YYYY-MM-DD")
    }
    this.widgetService.getMessageList(obj).subscribe(
      res => {
       this.auth.hideLoader();
        this.messageList = this.addKeys(res, false);
      },
      err => {
       this.auth.hideLoader();
      }
    )
  }

  addKeys(data, val) {
    data.forEach(
      element => {
        element.assigned = val;
      }
    )
    return data;
  }


  sendNotificationMessage() {
    let messageSelected: any;
    let configuredMessage: boolean = false;
    let check = this.validateAllFields();
    if (check === false) {
      return;
    }
    if (this.selectedOption == "showTextBox") {
      messageSelected = { message: this.getMessageText(), messageId: -1 };
      configuredMessage = false;
      check = this.getSubject();
    } else {
      messageSelected = this.getNotificationMessage();
      configuredMessage = true;
    }
    if (messageSelected === false) {
      return
    }
    let delivery_mode = this.getDeliveryModeValue();
    if (delivery_mode === false) {
      return;
    }
    let destination:any;
    if(!this.openAppUserSelected) {
    destination = this.getDestinationValue();
    if (destination === false) {
      return;
    }
    }

    let batch_id;
    if (this.isProfessional) {
      batch_id = this.sendNotification.batch_id;
    } else {
      batch_id = this.sendNotificationCourse.course_id;
    }
    let studentID: any;
    let userId:any;
    let isTeacherSMS: number = 0;
    if (this.selectedOption == "showTutor") {
      studentID = this.getListOfIds('teacher_id');
      isTeacherSMS = 1;
      destination = 0;
    } else {
      if(this.openAppUserSelected){
        userId = this.getListOfIds('user_id')
      } else {
        studentID = this.getListOfIds('student_id');
      }
    }
    let isAlumini = 0;
    if (document.getElementById('chkBoxAluminiSelection').checked) {
      isAlumini = 1;
    }

    let obj = {
      delivery_mode: Number(delivery_mode),
      notifn_message: messageSelected.message,
      notifn_subject: check,
      destination: Number(destination),
      student_ids: studentID,
      user_ids: [userId],
      cancel_date: '',
      isEnquiry_notifn: 0,
      isAlumniSMS: isAlumini,
      isTeacherSMS: isTeacherSMS,
      configuredMessage: configuredMessage,
      message_id: messageSelected.messageId,
      is_user_notify: 0
    }
    if(this.openAppUserSelected) {
      obj.is_user_notify = 1
    }

    this.widgetService.sendNotification(obj).subscribe(
      res => {
        let msg = {
          type: 'success',
          title: '',
          body: "Sent successfully"
        };
        this.appC.popToast(msg);
        this.closeNotificationPopUp();
      },
      err => {
        //console.log(err);
        let msg = {
          type: 'error',
          title: '',
          body: err.error.message
        };
        this.appC.popToast(msg);
      }
    )
  }

  sendPushNotification() {
    let messageSelected: any;
    if (this.selectedOption == "showTextBox") {
      messageSelected = { message: '', messageId: '' };
    } else {
      messageSelected = this.getNotificationMessage();
    }
    if (messageSelected === false) {
      return
    }
    let student_id:any='';
    if(this.openAppUserSelected){
      student_id = this.getListOfIds('user_id')
    } else {
      student_id = this.getListOfIds('student_id')
    }
    let obj = {
      notifn_message: messageSelected.message,
      message_id: messageSelected.messageId,
      student_ids: student_id,
    }
    this.widgetService.sendPushNotificationToServer(obj).subscribe(
      res => {
        //console.log(res);
        let msg = {
          type: 'success',
          title: '',
          body: "Sent successfully"
        };
        this.appC.popToast(msg);
      },
      err => {
        //console.log(err);
        let msg = {
          type: 'error',
          title: '',
          body: err.error.message
        };
        this.appC.popToast(msg);
      }
    )
  }

  changeCurrentView(event) {
    if (event.target.checked) {
      document.getElementById('divDeliveryMode').classList.remove('show');
      document.getElementById('divDeliveryMode').classList.add('hide');
      document.getElementById('divLoginMode').classList.remove('hide');
      document.getElementById('divLoginMode').classList.add('show');
    } else {
      document.getElementById('divDeliveryMode').classList.remove('remove');
      document.getElementById('divDeliveryMode').classList.add('show');
      document.getElementById('divLoginMode').classList.remove('show');
      document.getElementById('divLoginMode').classList.add('hide');
    }
  }

  sendSmsForApp(value, delivery_mode) {
    let type = delivery_mode==0?'SMS':'Email';
    let msg = "Are you sure you want to send "+type+' to selected users';
    if (confirm(msg)) {
      let obj = {
        app_sms_type: Number(value),
        studentArray: this.getListOfIds('student_id'),
        userArray: this.getListOfIds('user_id'),
        user_role: this.loginField.checkBox,
        delivery_mode: delivery_mode
      };
      obj.studentArray = obj.studentArray.split(",");
      obj.userArray = obj.userArray.split(",");
      this.auth.showLoader();
      this.widgetService.smsForAddDownload(obj).subscribe(
        res => {
         this.auth.hideLoader();
          let tempMsg=type+' Sent successfully';
          let msg = {
            type: 'success',
            title: '',
            body: tempMsg
          };
          this.appC.popToast(msg);
        },
        err => {
         this.auth.hideLoader();
          //console.log(err);
          let msg = {
            type: 'error',
            title: '',
            body: err.error.message
          };
          this.appC.popToast(msg);
        }
      )

    }
  }
  onCheckBoxSelection(index, data) {
    this.messageList.map(ele => {
      if (ele.message_id == data.message_id) {
        ele.assigned = true;
      } else {
        ele.assigned = false;
      }
    })
  }

  getListOfIds(key) {
    let id: any = [];
    for (let t = 0; t < this.studentList.length; t++) {
      if (this.studentList[t].assigned == true) {
        id.push(this.studentList[t][key]);
      }
    }
    return id.join(',');
  }

  addNewNotification() {
    this.addNotification = true;
  }
  saveNewMessage() {
    let obj = { message: this.newMessageText };
    this.widgetService.saveMessageTOServer(obj).subscribe(
      res => {
        let msg = {
          type: 'success',
          title: 'Message created Successfully',
          body: " Your request is in queue and process shortly"
        };
        this.appC.popToast(msg);
        this.closeNewMessageDiv();
        this.onTabChange(this.jsonFlag.smsTabType);// as per view it get the sms data --laxmi
      },
      err => {
        //console.log(err);
        let msg = {
          type: 'error',
          title: 'Failed To Save Message',
          body: err.message
        };
        this.appC.popToast(msg);
      }
    )
  }

  closeNewMessageDiv() {
    this.addNotification = false;
    this.newMessageText = "";
    this.messageCount = 0;
    this.jsonFlag.editMessage = false;
  }

  //SMS Approve AND Reject
  onTabChange(tabname) {
    this.jsonFlag.openMessageFlag = false;
    this.jsonFlag.smsTabType = tabname;
    document.getElementById('approvedSMSTab').classList.remove('active');
    document.getElementById('openSMSTab').classList.remove('active');
    if (tabname == 'approved') {
      this.jsonFlag.showAllMessage = false;
      document.getElementById('approvedSMSTab').classList.add('active');
      this.getAllMessageFromServer();
    } else {
      document.getElementById('openSMSTab').classList.add('active');
      this.getOpenStatusSMS();
    }
  }
  getOpenStatusSMS() {
    this.auth.showLoader();
    this.jsonFlag.openMessageFlag = true;
    this.openMessageList = [];
    this.widgetService.getMessageList({}).subscribe(
      res => {
       this.auth.hideLoader();
        this.openMessageList = res;
      },
      err => {
       this.auth.hideLoader();
        //console.log(err);
      }
    )
  }

  fetchDataFromFields() {
    if (this.sendNotificationCourse.course_id != "-1") {
      this.auth.showLoader();
      let obj = {
        course_id: this.sendNotificationCourse.course_id,
        master_course_name: this.sendNotificationCourse.master_course
      }
      this.widgetService.getStudentListOfCourse(obj).subscribe(
        res => {
          this.allChecked = true;
         this.auth.hideLoader();
          this.showTableFlag = true;
          this.selectedOption = "filter";
          this.studentList = this.addKeys(res, true);
        },
        err => {
         this.auth.hideLoader();
          //console.log(err);
        }
      )
    }
  }
  getAllSavedMessages() {
    this.messageList = [];
    this.jsonFlag.showAllMessage = true;
    this.widgetService.getMessageList({ status: 1 }).subscribe(
      res => {
        //console.log(res);
        this.messageList = this.addKeys(res, false);
      },
      err => {
        //console.log(err);
      }
    )
  }


    onCheckBoxEvent(event, row) {
      row.assigned = event;
      this.allChecked = this.checkCheckAllChkboxStatus();
    }

    checkCheckAllChkboxStatus() {
      for (let i = 0; i < this.studentList.length; i++) {
        if (this.studentList[i].assigned == false) {
          return false;
        }
      }
      return true;
    }


    updateMessage() {
      let obj = { message: this.newMessageText };
      this.auth.showLoader();
          this.widgetService.changesSMSStatus(obj,this.jsonFlag.messageObject.message_id ).subscribe(
        res => {
          this.auth.hideLoader();
          let msg = {
            type: 'success',
            title: 'Message updated Successfully',
          };
          this.appC.popToast(msg);
          this.closeNewMessageDiv();
          this.onTabChange(this.jsonFlag.smsTabType);// as per view it get the sms data --laxmi
        },
        err => {
          this.auth.hideLoader();
          //console.log(err);
          let msg = {
            type: 'error',
            title: 'Failed To Update Message',
            body: err.message
          };
          this.appC.popToast(msg);
        }
      )

    }

    approveRejectSms(data, statusCode) {
      let msg: any = "";
      if (statusCode == 1) {
        msg = "approve";
      } else {
        msg = "deleted";
      }
      if (confirm('Are you sure, You want  to ' + msg + ' the message?')) {
        this.widgetService.changesSMSStatus({ 'status': statusCode }, data.message_id).subscribe(
          res => {
            let msg = {
              type: 'success',
              title: '',
              body: ''
            }
            if (statusCode == 1) {
              msg.title = "SMS Approved"
            } else {
              msg.title = "SMS Deleted";
            }
            this.appC.popToast(msg);
            this.getOpenStatusSMS();
          },
          err => {
            let msg = {
              type: 'error',
              title: '',
              body: err.error.message
            }
            this.appC.popToast(msg);
          }
        )
      }
    }

    validateSpecialCharacters(str) {
      let regex = /[^ a-zA-Z0-9.,]/g;
      if (str.match(regex) == null) {
        return true;
      } else {
        return false;
      }
    }

    checkRoleMAnagement(id) {
      let userType: any = Number(sessionStorage.getItem('userType'));
      if (userType != 3) {
        let permissionArray = sessionStorage.getItem('permissions');
        if (permissionArray == "" || permissionArray == null) {
          return false;
        } else {
          let data = JSON.parse(this.permissionArray);
          if (id != "" && data != null && data != "") {
            if (data.includes(id)) {
              return false;
            }
            else
              return true;
          }
          return true;
        }
      } else {
        return true;
      }
    }

    editSMS(row) {
      this.addNotification = true;
      this.jsonFlag.editMessage = true;
      this.jsonFlag.messageObject = row;
      this.newMessageText = row.message;
      this.messageCount = 1;
    }

    showApproveButtons(data) {
      let enableApprove = sessionStorage.getItem('allow_sms_approve_feature');
      const permissionArray = sessionStorage.getItem('permissions');
      if (permissionArray == "" || permissionArray == null) {
        if (enableApprove == '1' && data.statusValue == "Open") {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
    countNumberOfMessage(){
      let uniCodeFlag = this.hasUnicode(this.newMessageText);
      let charLimit = 160;
      if(uniCodeFlag){
        charLimit = 70
      }
      if(this.newMessageText.length == 0){
        this.messageCount = 0;
      }
      else if(this.newMessageText.length > 0 && this.newMessageText.length <= charLimit){
        this.messageCount = 1;
      }
      else{
        let count = Math.ceil(this.newMessageText.length / charLimit);
        console.log(count);
        this.messageCount = count;
      }
    }

    hasUnicode (str) {
      for (var i = 0; i < str.length; i++) {
          if (str.charCodeAt(i) > 127) return true;
      }
      return false;
    }

    clearCheckBoxSelction(id) {
      this.searchData = "";
      document.getElementById('chkBoxActiveSelection').checked = false;
      document.getElementById('chkBoxTutorSelection').checked = false;
      document.getElementById('chkBoxInActiveSelection').checked = false;
      document.getElementById('chkBoxAluminiSelection').checked = false;
      document.getElementById('chkBoxOpenAppSelection').checked = false;
      document.getElementById(id).checked = true;
      this.openAppUserSelected = false;
    }

    chkBoxAllActiveStudent(event) {
      this.openAppUserSelected = false;
      this.clearDropDownBinding();
      if (event.target.checked) {
        this.allChecked = true;
        this.clearCheckBoxSelction(event.target.id);
        this.auth.showLoader();
        this.studentList = [];
        this.widgetService.getAllActiveStudentList().subscribe(
          res => {
           this.auth.hideLoader();
            if (document.getElementById('chkBoxActiveSelection').checked) {
              this.showTableFlag = true;
              this.studentList = this.addKeys(res, true);
            }
          },
          err => {
           this.auth.hideLoader();
            //console.log(err);
          }
        )
      } else {
        this.flushData();
        this.showTableFlag = false;
      }
    }

    chkBoxAllTeacher(event) {
      this.openAppUserSelected = false;
      this.clearDropDownBinding();
      if (event.target.checked) {
        this.allChecked = true;
        this.clearCheckBoxSelction(event.target.id);
        this.auth.showLoader();
        this.studentList = [];
        this.widgetService.getAllTeacherList().subscribe(
          res => {
           this.auth.hideLoader();
            if (document.getElementById('chkBoxTutorSelection').checked) {
              this.showTableFlag = true;
              this.studentList = this.addKeys(res, true);
            }
          },
          err => {
           this.auth.hideLoader();
            //console.log(err);
          }
        )
      } else {
        this.flushData();
        this.showTableFlag = false;

      }
    }

    chkBoxAllInActiveStudent(event) {
      this.openAppUserSelected = false;
      this.clearDropDownBinding();
      if (event.target.checked) {
        this.allChecked = true;
        this.clearCheckBoxSelction(event.target.id);
        this.auth.showLoader();
        this.studentList = [];
        this.widgetService.getAllInActiveList().subscribe(
          res => {
           this.auth.hideLoader();
            if (document.getElementById('chkBoxInActiveSelection').checked) {
              this.showTableFlag = true;
              this.studentList = this.addKeys(res, true);
            }
          },
          err => {
           this.auth.hideLoader();
            //console.log(err);
          }
        )
      } else {
        this.flushData();
        this.showTableFlag = false;

      }
    }

    chkBoxAllOpenAppUsers(event) {
      this.clearDropDownBinding();
      if (event.target.checked) {
        this.allChecked = true;
        this.clearCheckBoxSelction(event.target.id);
        this.auth.showLoader();
        this.studentList = [];
        let obj = {
          "by": [
              {
                  "column": "productId",
                  "value": ""
              },
              {
                  "column": "eCourseId",
                  "value": 0
              }
          ],
          "start_index":0,
          "no_of_records":0   
      }
        this.productService.postMethod('user-product/get-user-details',obj).then(
          res => {
            this.openAppUserSelected = true;
           this.auth.hideLoader();
           let response = res['body'];
            if (document.getElementById('chkBoxOpenAppSelection').checked) {
              this.showTableFlag = true;
              this.studentList = this.addKeys(response.result, true);
            }
          },
          err => {
           this.auth.hideLoader();
            //console.log(err);
          }
        )
      } else {
        this.flushData();
        this.showTableFlag = false;
  
      }
    }

    chkBoxAllAluminiStudent(event) {
      this.openAppUserSelected = false;
      this.clearDropDownBinding();
      if (event.target.checked) {
        this.allChecked = true;
        this.clearCheckBoxSelction(event.target.id);
        this.auth.showLoader();
        this.studentList = [];
        this.widgetService.getAllAluminiList().subscribe(
          res => {
           this.auth.hideLoader();
            if (document.getElementById('chkBoxAluminiSelection').checked) {
              this.showTableFlag = true;
              this.studentList = this.addKeys(res, true);
            }
          },
          err => {
           this.auth.hideLoader();
            //console.log(err);
          }
        )
      } else {
        this.flushData();
        this.showTableFlag = false;

      }
    }

    emailCheckBoxClick(event) {
      if (event.target.checked) {
        this.showEmailSubject = true;
      } else {
        this.showEmailSubject = false;
      }
    }
}
