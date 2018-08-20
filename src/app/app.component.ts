import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { trigger, animate, style, group, animateChild, query, stagger, transition } from '@angular/animations';
import { ToasterModule, Toast, ToasterService, ToasterConfig } from '../assets/imported_modules/angular2-toaster/angular2-toaster';
import { LoaderHandlingService } from './services/loading-services/loader-handling.service';
import { LoginService } from './services/login-services/login.service';
import { FetchprefilldataService } from './services/fetchprefilldata.service';
import { Title } from '@angular/platform-browser';
import * as moment from 'moment';
import { AuthenticatorService } from './services/authenticator.service';
import { AlertService } from './services/alert.service';
import { MultiBranchDataService } from './services/multiBranchdata.service';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {


  /* =========================================================================================================== */
  /* =========================================================================================================== */
  /* 
  * Variable Declaration for Global search, Enquiry update and Password Change  
  */
  /* =========================================================================================================== */
  /* =========================================================================================================== */

  /* Enquiry Declarations */
  isConvertToStudent: boolean = false; isEnqUpdate: boolean = false; isloggedInAdmin: boolean = false; isSearchMore: boolean = false;
  selectedEnquiry: any = { enquiry_no: '', name: '', status: '' };
  enqstatus: any[] = []; enqPriority: any[] = []; enqFollowType: any[] = []; enqAssignTo: any[] = [];
  updateFormData: any = { comment: "", status: "", statusValue: "", institution_id: sessionStorage.getItem('institute_id'), isEnquiryUpdate: "Y", closedReason: null, slot_id: null, priority: "", follow_type: "", followUpDate: "", commentDate: moment().format('YYYY-MM-DD'), followUpTime: null, followUpDateTime: '', isEnquiryV2Update: "N", isRegisterFeeUpdate: "N", amount: null, paymentMode: null, paymentDate: null, reference: null, walkin_followUpDate: '', walkin_followUpTime: { hour: '', minute: '', }, is_follow_up_time_notification: 0, closing_reason_id: '0' };
  times: any[] = ['', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM', '12 AM'];
  minArr: any[] = ['','00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
  hour: string = ''; minute: string = ''; meridian: string = '';
  updateFormComments: any = []; updateFormCommentsBy: any = []; updateFormCommentsOn: any = [];
  isEnquiryAdmin: boolean = false; isMainBranch: string = "N"; isMultiBranch: boolean = false;
  subBranchSelected: boolean = false; branchesList: any[] = []; isNotifyVisible: boolean = false;



  isMenuVisible: boolean = false;
  isRippleLoad: boolean = true;

  /* Toaster handlers */
  /* ToasterConfig ==> {
    animation: 'fade', 'flyLeft', 'flyRight', 'slideDown', and 'slideUp'
    limit: number
    tapToDismiss: false
    showCloseButton: true === or else ==== 'warning': true, 'error': false'
    newestOnTop: false
    timeout: 2000
    mouseoverTimerStop: false
  } */
  private toasterService: ToasterService;
  public config: ToasterConfig = new ToasterConfig({ positionClass: 'toast-top-right', limit: 1, timeout: 5000, mouseoverTimerStop: true, });


  /* Variable for Zendesk */
  helpLoader: boolean = false;
  ticketId = "";
  addReportPopup: boolean = false;
  closechatbot: boolean = true;


  /* Change Password  */
  institute_id: any = false;
  popUpChangePassword: boolean = false;
  changePass: any = { username: '', oldPassword: '', newPassword: '', confirmPassword: '', };



  /* Global Search variable */
  globalSearchForm: any = { name: '', phone: '', instituteId: sessionStorage.getItem('institute_id'), start_index: '-1', batch_size: '-1' };
  enquiryResult: any[] = []; studentResult: any[] = []; searchResult: any[] = [];
  hasStudent: boolean = false; hasEnquiry: boolean = false;
  closingReasonDataSource: any = [];



  /* =========================================================================================================== */
  /* =========================================================================================================== */
  /* 
  * Constructor declaration for injecting services and dependencies
  */
  /* =========================================================================================================== */
  /* =========================================================================================================== */
  constructor(toasterService: ToasterService, private router: Router, private load: LoaderHandlingService, private log: LoginService, private fetchService: FetchprefilldataService, private titleService: Title, private auth: AuthenticatorService, private intercept: AlertService, private multiBranchService: MultiBranchDataService) {
    this.toasterService = toasterService;
    this.auth.currentInstituteId.subscribe(id => {
      if (id != null && id != "") {
        this.institute_id = id;
      }
    });
  }




  /* =========================================================================================================== */
  /* =========================================================================================================== */
  /* 
  * Lifecycle Init
  */
  /* =========================================================================================================== */
  /* =========================================================================================================== */
  ngOnInit() {
    this.router.events.subscribe(event => {
      this.popUpChangePassword = false;
      if (event instanceof NavigationStart) {
        this.isRippleLoad = true;
        this.closeSearchArea();
        if (sessionStorage.getItem('userid') != null) {
          this.log.changeSidenavStatus('authorized');
        }
      }
      else if (event instanceof NavigationEnd) {
        this.closeSearchArea();
        this.isRippleLoad = false;
      }
      else if (event instanceof NavigationCancel) {
        this.isRippleLoad = false;
        this.closeSearchArea();
        if (sessionStorage.getItem('userid') != null) {
          this.log.changeSidenavStatus('authorized');
        }
      }
      else if (event instanceof NavigationError) {
        this.isRippleLoad = false;
        this.closeSearchArea();
        if (sessionStorage.getItem('userid') != null) {
          this.log.changeSidenavStatus('authorized');
        }
      }
    });

    this.log.currentMenuState.subscribe(el => {
      this.isMenuVisible = el;
    })


    this.auth.currentInstituteId.subscribe(e => {
      if (e == null || e == undefined || e == '') {
        this.isloggedInAdmin = false;
      }
      else {
        let p = sessionStorage.getItem('permissions');
        let user = sessionStorage.getItem('userType')
        this.getEnquiryPrefiller();
        if (user == "0") {
          if (p == null || p == undefined || p == '') {
            this.isloggedInAdmin = true;
          }
          else {
            this.isloggedInAdmin = false
          }
        }
      }
    });


    this.intercept.messageList.subscribe(e => {
      if (e != '') {
        let obj = JSON.parse(e);
        this.popToast(obj);
        this.intercept.changeErrorObject('');
      }
    });


    this.log.currentPermissions.subscribe(e => {
      if (e != '' && e != null && e != undefined && e != []) {
        let perm = JSON.parse(sessionStorage.getItem('permissions'));
        if (perm != '' && perm != null && perm != undefined && perm != []) {
          let permissionArray: any[] = perm;
          let id = '115';
          let id2 = '110';
          let id3 = '301';
          let id4 = '303';
          if (permissionArray.indexOf(id) != -1 || permissionArray.indexOf(id2) != -1) {
            this.hasEnquiry = true;
          }
          else if (permissionArray.indexOf(id3) != -1 || permissionArray.indexOf(id4) != -1) {
            this.hasStudent = true;
          }
        }
      }
      else {
        this.hasEnquiry = false;
        this.hasStudent = false;
        let type = sessionStorage.getItem('userType');
        if (type == '0') {
          this.hasEnquiry = true;
          this.hasStudent = true;
        }
      }
    });

    this.checkVirtualHosting();

  }



  ///// Virtual Hosting check ////////

  checkVirtualHosting() {
    let url = window.location.href;
    if (url.includes('webtest') || url.includes('web') || url.includes('localhost')) {
      this.titleService.setTitle("Proctur - Your Pocket Classroom");
    } else {
      this.titleService.setTitle("Login");
    }
  }

  /* =========================================================================================================== */
  /* =========================================================================================================== */
  /* 
  * Global Search and general mothods used for zendesk and others 
  */
  /* =========================================================================================================== */
  /* =========================================================================================================== */

  public popToast(data) {
    var toast: Toast = {
      type: data.type,
      title: data.title,
      body: data.body
    };
    this.toasterService.pop(toast);
  }

  public removeFullscreen() {
    var header = document.getElementsByTagName('core-header');
    var sidebar = document.getElementsByTagName('core-sidednav');

    document.getElementById('login-center-block').classList.add('hide');

    [].forEach.call(header, function (el) {
      el.classList.remove('hide');
    });
    [].forEach.call(sidebar, function (el) {
      el.classList.remove('hide');
    });
  }

  public searchViewMore(e) {
    if (e != null) {
      this.isSearchMore = true;
      this.log.currentPermissions.subscribe(e => {
        this.hasEnquiry = false;
        this.hasStudent = false;
        if (e != '' && e != null && e != undefined && e != []) {
          let perm = JSON.parse(sessionStorage.getItem('permissions'));
          if (perm != '' && perm != null && perm != undefined && perm != []) {
            let permissionArray: any[] = perm;
            let id = '115';
            let id2 = '110';
            let id3 = '301';
            let id4 = '303';
            if (permissionArray.indexOf(id) != -1 || permissionArray.indexOf(id2) != -1) {
              this.hasEnquiry = true;
            }
            else if (permissionArray.indexOf(id3) != -1 || permissionArray.indexOf(id4) != -1) {
              this.hasStudent = true;
            }
          }
        }
        else {
          let type = sessionStorage.getItem('userType');
          if (type == '0') {
            this.hasEnquiry = true;
            this.hasStudent = true;
          }
        }
      });
      this.filterGlobal(e.input);
    }
    else {
      this.closeSearchArea();
      this.searchResult = [];
      this.enquiryResult = [];
      this.studentResult = [];
    }
  }

  public closeSearchArea() {
    this.isSearchMore = false;
    this.closeEnquiryUpdate();
  }

  public filterGlobal(value) {
    if (value != null && value != undefined) {
      if (value.trim() != '' && value.length >= 4) {
        let obj = this.getSearchObject(value);

        /* Loading Shows */
        this.fetchService.globalSearch(obj).subscribe(
          res => {
            if (res.length != 0) {
              this.searchResult = res;
              this.enquiryResult = res.filter(e => e.source == "Enquiry");
              this.studentResult = res.filter(s => s.source == "Student");
            }
            else {
              let obj = {
                type: "info",
                title: "No Records Found",
                body: "Please try with a different keyword"
              }
              this.popToast(obj);
            }
          },
          err => {
          }
        )
      }
      else {

      }
    }

  }

  public getSearchObject(e): any {
    let obj = this.globalSearchForm;
    /* Name detected */
    if (isNaN(e)) {
      this.globalSearchForm.name = e;
      this.globalSearchForm.phone = '';
      return this.globalSearchForm;
    }
    /* Nmber detected */
    else {
      this.globalSearchForm.phone = e;
      this.globalSearchForm.name = '';
      return this.globalSearchForm;
    }
  }

  public studentSelected(s) {
    this.closeSearchArea();
    this.router.navigate(['/view/student'], { queryParams: { id: s.id } });
  }

  public enquirySelected(e) {
    this.closeSearchArea();
    this.router.navigate(['/view/enquiry'], { queryParams: { id: e.id } });
  }

  public performAction(a: string, data) {

    let d = data.id
    switch (a) {
      case 'studentEdit': {
        this.closeSearchArea();
        this.router.navigate(['/view/student'], { queryParams: { id: d, action: a } });
        break;
      }
      case 'studentFee': {
        this.closeSearchArea();
        this.router.navigate(['/view/student'], { queryParams: { id: d, action: a } });
        break;
      }
      case 'studentInventory': {
        this.closeSearchArea();
        this.router.navigate(['/view/student'], { queryParams: { id: d, action: a } });
        break;
      }
      case 'studentLeave': {
        this.closeSearchArea();
        this.router.navigate(['/view/student'], { queryParams: { id: d, action: a } });
        break;
      }
      case 'studentDelete': {
        this.closeSearchArea();
        this.router.navigate(['/view/student'], { queryParams: { id: d, action: a } });
        break;
      }
      case 'enquiryEdit': {
        this.closeSearchArea();
        this.router.navigate(['/view/enquiry'], { queryParams: { id: d, action: a } });
        break;
      }
      case 'enquiryUpdate': {
        this.closeSearchArea();
        let obj = {
          action: a,
          data: data
        }
        this.otherAction(obj);
        break;
      }

    }
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  informFooter() {
  }
















  /* =========================================================================================================== */
  /* =========================================================================================================== */
  /* 
  * Methods for Change Password  
  */
  /* =========================================================================================================== */
  /* =========================================================================================================== */


  handler(f) {
    let flag: any = f;

    if (flag.hasOwnProperty('ticket')) {
      this.addReportPopup = true;
      this.ticketId = flag.ticket.id;
      this.closechatbot = false;
    }
    else {
      this.closechatbot = false;
    }
  }

  closeReportPopup() {
    this.addReportPopup = false;
  }

  changePasswordPopUp(event) {
    this.popUpChangePassword = true;
    let emailId = sessionStorage.getItem('alternate_email_id');
    if (emailId != "" && emailId != null && emailId != undefined) {
      this.changePass.username = emailId;
    }
    this.changePass.oldPassword = '';
    this.changePass.newPassword = '';
    this.changePass.confirmPassword = '';
  }

  closeChangePasswordPopup() {
    this.popUpChangePassword = false;
    this.changePass = {
      username: sessionStorage.getItem('alternate_email_id'),
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  }

  changeUserPassword() {
    if (this.changePass.oldPassword.trim() == "" || this.changePass.oldPassword.trim() == null) {
      this.messageNotifier('error', 'Error', 'Please provide old password');
      return true;
    }
    if (this.changePass.newPassword.trim() == "" || this.changePass.newPassword.trim() == null) {
      this.messageNotifier('error', 'Error', 'Please provide new password');
      return true;
    }
    if (this.changePass.confirmPassword.trim() == "" || this.changePass.confirmPassword == null) {
      this.messageNotifier('error', 'Error', 'Please provide password in confirm password');
      return true;
    }
    if (this.changePass.newPassword.trim() != this.changePass.confirmPassword.trim()) {
      this.messageNotifier('error', 'Error', 'Please check password provided in confirm password field');
      return true;
    }
    let userId = sessionStorage.getItem('userid') + '|' + sessionStorage.getItem('userType');
    let dataToSend: any = {
      username: userId,
      userid: sessionStorage.getItem('userid'),
      oldPassword: this.changePass.oldPassword,
      newPassword: this.changePass.newPassword,
      institute_id: this.institute_id,
    }
    this.log.changePasswordService(dataToSend).subscribe(
      res => {
        this.messageNotifier('success', 'Password Changed', 'Password Changed Successfully');
        this.closeChangePasswordPopup();
        if (this.log.logoutUser()) {
          this.router.navigateByUrl('/authPage');
        }
      },
      err => {
        console.log(err);
        this.messageNotifier('error', 'Error', JSON.parse(err._body).message);
      }
    )
  }

  resetUserPassword() {
  }

  messageNotifier(type, title, message) {
    let obj = {
      type: type,
      title: title,
      body: message
    };
    this.popToast(obj);
  }

  otherAction(e) {
    if (e.action == "enquiryUpdate") {
      this.loadEnquiryData(e);
    }
  }
















  /* =========================================================================================================== */
  /* =========================================================================================================== */
  /* 
  * Enquiry Update Methods
  */
  /* =========================================================================================================== */
  /* =========================================================================================================== */

  loadEnquiryData(e) {
    this.isRippleLoad = true;
    this.isEnquiryAdministrator();
    this.checkForMultiBranch();
    this.fetchCommentData(e);
    this.enquiryDataFetch(e);
  }

  fetchCommentData(e) {
    this.fetchService.fetchCommentsForEnquiry(e.data.id).subscribe(
      (res: any) => {

        if (res.comments != null) {
          this.updateFormComments = res.comments;
          this.updateFormCommentsOn = res.commentedOn;
          this.updateFormCommentsBy = res.commentedBy;
        }
        else if (res.comments == null) {
          this.updateFormComments = [];
          this.updateFormCommentsOn = [];
          this.updateFormCommentsBy = [];
        }

        this.updateFormData.assigned_to = res.assigned_to;

        if (res.walkin_followUpTime != "" && res.walkin_followUpTime != null) {
          let timeObj = this.convertTimeToFormat(res.walkin_followUpTime);
          this.updateFormData.walkin_followUpTime.hour = timeObj.hour + " " + timeObj.meridian;
          this.updateFormData.walkin_followUpTime.minute = timeObj.minute;
        }
        this.updateFormData.walkin_followUpDate = res.walkin_followUpDate;

      },
      err => {
        this.popToast({ type: "error", title: "Error Fetching Enquiry Comments", body: "" });
      }
    );
  }

  enquiryDataFetch(e) {
    this.fetchService.fetchEnquiryByInstituteID(e.data.id).subscribe(
      res => {
        this.selectedEnquiry = res;
        this.updateFormData.priority = this.getPriority(res.priority);
        this.updateFormData.follow_type = this.getFollowUp(res.follow_type);
        this.updateFormData.status = res.status;
        this.updateFormData.followUpDate = moment(this.selectedEnquiry.followUpDate).format('YYYY-MM-DD');
        if (res.followUpTime != '' && res.followUpTime != null) {
          let timeObj = this.convertTimeToFormat(this.selectedEnquiry.followUpTime);
          this.hour = timeObj.hour + " " + timeObj.meridian;
          this.minute = timeObj.minute;
        }
        this.updateFormData.followUpTime = res.followUpTime;
        if (res.followUpTime != "" && res.followUpTime != null && res.followUpDate != null && res.followUpDate != "") {
          if (res.is_follow_up_time_notification == 1) {
            this.updateFormData.is_follow_up_time_notification = true;
          }
          else {
            this.updateFormData.is_follow_up_time_notification = false;
          }
        }
        else {
          this.updateFormData.is_follow_up_time_notification = false;
        }
        if (res.walkin_followUpDate != "" && res.walkin_followUpDate != "Invalid date" && res.walkin_followUpDate != null) {
          this.updateFormData.walkin_followUpDate = res.walkin_followUpDate;
        }

        if (res.walkin_followUpTime != "" && res.walkin_followUpTime != null && res.walkin_followUpTime != ": ") {
          this.updateFormData.walkin_followUpTime = this.breakTimeInToHrAndMin(res.walkin_followUpTime);
        }

        this.isEnqUpdate = true;
        this.isRippleLoad = false;
      },
      err => {
        this.isRippleLoad = false;
        this.popToast({ type: "error", title: "Error Fetching Enquiry Data", body: "" });
      }

    );
  }

  checkForMultiBranch() {
    let insttitueId = sessionStorage.getItem("institute_id");
    const permissionArray = sessionStorage.getItem('permissions');

    if (permissionArray == "" || permissionArray == null) {
      this.auth.isMainBranch.subscribe(
        (value: any) => {
          this.isMainBranch = value;
          if (this.isMainBranch == "Y") {
            this.updateFormData.source_instituteId = insttitueId;
            this.multiBranchInstituteFound(insttitueId);
            this.branchUpdated(this.updateFormData.source_instituteId);
            this.updateBranchVisibility();
          }
        }
      );

      this.multiBranchService.subBranchSelected.subscribe(
        res => {
          this.subBranchSelected = res;
          if (res == true) {
            this.updateFormData.source_instituteId = insttitueId;
            const mainBranchId = sessionStorage.getItem('mainBranchId');
            if (mainBranchId != null) {
              this.multiBranchInstituteFound(mainBranchId);
              this.branchUpdated(this.updateFormData.source_instituteId);
              this.updateBranchVisibility();
            }
          }
        }
      )
    }
    else {
      this.isMainBranch = "N";
      this.subBranchSelected = false;
      this.updateBranchVisibility();
    }
  }

  updateBranchVisibility() {
    if (this.isMainBranch == 'Y' || this.subBranchSelected == true) {
      this.isMultiBranch = true;
    }
  }

  isEnquiryAdministrator() {
    if (sessionStorage.getItem('permissions') == null || sessionStorage.getItem('permissions') == undefined || sessionStorage.getItem('permissions') == '') {
      this.isEnquiryAdmin = true;
    }
    else {
      let permissions: any[] = [];
      permissions = JSON.parse(sessionStorage.getItem('permissions'));
      /* User has permission to view all enquiries */
      if (permissions.includes('115')) {
        this.isEnquiryAdmin = true;
      }
      /* User is not authorized as enquiry admin and see only enquiry assigned to him */
      else {
        this.isEnquiryAdmin = false;
      }
    }
  }

  getEnquiryPrefiller() {

    this.fetchService.getEnqStatus().subscribe(
      data => {
        this.enqstatus = data;
      }
    );

    this.fetchService.getFollowupType().subscribe(
      data => { this.enqFollowType = data }
    );

    this.fetchService.getEnqPriority().subscribe(
      data => { this.enqPriority = data; }
    );

    this.fetchService.getAssignTo().subscribe(
      data => { this.enqAssignTo = data; }
    );

    this.fetchService.getClosingReasons().subscribe(
      data => { this.closingReasonDataSource = data; }
    )

  }

  getPriority(id): string {
    let temp: string = ""
    this.enqPriority.forEach(el => {
      if (el.data_key === id) {
        temp = el.data_value;
      }
    });
    return temp;
  }

  closeEnquiryUpdate() {
    this.isEnqUpdate = false;
    this.updateFormData = { comment: "", status: "", statusValue: "", institution_id: sessionStorage.getItem('institute_id'), isEnquiryUpdate: "Y", closedReason: null, slot_id: null, priority: "", follow_type: "", followUpDate: "", commentDate: moment().format('YYYY-MM-DD'), followUpTime: null, followUpDateTime: '', isEnquiryV2Update: "N", isRegisterFeeUpdate: "N", amount: null, paymentMode: null, paymentDate: null, reference: null, walkin_followUpDate: '', walkin_followUpTime: { hour: '', minute: '', }, is_follow_up_time_notification: 0, };
  }

  getFollowUp(id): string {
    let temp: string = ""
    this.enqFollowType.forEach(el => {
      if (el.data_key === id) {
        temp = el.data_value;
      }
    });
    return temp;
  }

  convertTimeToFormat(data) {
    let time: any = {};
    time.hour = data.split(':')[0];
    time.minute = data.split(':')[1].split(" ")[0];
    time.meridian = data.split(':')[1].split(" ")[1];
    return time;
  }

  isNotifyDisplayed() {
    if (this.updateFormData.followUpDate != '' && this.updateFormData.followUpDate != null && this.updateFormData.followUpDate != "Invalid date") {
      if (this.hour != '' && this.hour != null && this.hour != undefined) {
        if (this.minute != '' && this.minute != null && this.minute != 'Invalid date') {
          this.isNotifyVisible = true;
        }
        else {
          this.isNotifyVisible = false;
        }
      }
      else {
        this.isNotifyVisible = false;
      }
    }
    else {
      this.isNotifyVisible = false;
    }
  }

  getFollowupTime(): any {
    let hour: any = parseInt(moment(new Date()).format('hh'));
    let min: any = moment(new Date()).format('mm');
    let mer: any = moment(new Date()).format('A');

    if (parseInt(min) % 5 != 0) {
      min = Math.ceil(parseInt(min) / 5) * 5;
      if (min >= 60) {
        min = '00';
        if (hour == 12) {
          hour = '1';
          if (mer == 'AM') {
            mer = 'PM';
          }
          else {
            mer = 'AM';
          }
        }
        else {
          hour += 1;
          let formattedNumber = (hour).slice(-2);
          hour = formattedNumber.toString();
        }
      }
    }

    return (hour + ":" + min + " " + mer);
  }

  updateRegisterEnquiry() {
    this.isConvertToStudent = true;
    this.updateFormData.follow_type = "Walkin";
    this.updateFormData.walkin_followUpDate = moment(new Date()).format('YYYY-MM-DD');
    this.updateFormData.walkin_followUpTime = this.getFollowupTime();
    if (this.updateFormData.walkin_followUpTime != '' && this.updateFormData.walkin_followUpTime != null) {
      this.pushUpdatedEnquiry();
    }
  }

  pushUpdatedEnquiry() {
    if (this.validateTime()) {

      this.isRippleLoad = true;
      this.updateFormData.comment = this.updateFormData.comment;

      if (this.hour != '' && this.hour != null && this.hour != undefined) {
        let time = this.timeChanges(this.hour);
        let followUpTime = time.hour + ":" + this.minute + " " + time.meridian;
        this.updateFormData.followUpTime = followUpTime;
      }

      if (this.updateFormData.followUpDate != "" && this.updateFormData.followUpDate != null && this.updateFormData.followUpDate != "Invalid date") {
        this.updateFormData.followUpDate = moment(this.updateFormData.followUpDate).format('DD-MMM-YY');
      } else {
        this.updateFormData.followUpDate = "";
      }


      if (this.isConvertToStudent === false) {

        if (this.updateFormData.walkin_followUpDate != "" && this.updateFormData.walkin_followUpDate != null && this.updateFormData.walkin_followUpDate != "Invalid date") {
          this.updateFormData.walkin_followUpDate = moment(this.updateFormData.walkin_followUpDate).format('YYYY-MM-DD');
        }
        else {
          this.updateFormData.walkin_followUpDate = "";
        }

        if (this.updateFormData.walkin_followUpTime.hour != "" && this.updateFormData.walkin_followUpTime.minute != "") {
          let time = this.updateFormData.walkin_followUpTime.hour.split(' ');
          this.updateFormData.walkin_followUpTime = time[0] + ':' + this.updateFormData.walkin_followUpTime.minute + " " + time[1];
        } else {
          this.updateFormData.walkin_followUpTime = "";
        }

        if (this.updateFormData.follow_type == "Walkin") {
          if (this.updateFormData.walkin_followUpDate == "") {
            this.popToast({ type: 'error', title: 'Error', body: 'Please provide walkin date for follow up type walkin.' })
            return;
          }

          if (this.updateFormData.walkin_followUpTime == "") {
            this.popToast({ type: 'error', title: 'Error', body: 'Please provide walkin time for follow up type walkin.' })
            return;
          }

        }
      }

      if (this.updateFormData.is_follow_up_time_notification) {
        this.updateFormData.is_follow_up_time_notification = 1;
      }
      else if (!this.updateFormData.is_follow_up_time_notification) {
        this.updateFormData.is_follow_up_time_notification = 0;
      }

      if (this.updateFormData.status == '1') {
        if (this.updateFormData.closing_reason_id == '0' || this.updateFormData.closing_reason_id == '-1') {
          this.popToast({ type: 'error', title: 'Error', body: 'Please provide closing reason' });
          return;
        }
      }

      if (this.updateFormData.followUpDate != "Invalid date") {
        this.updateFormData.priority = this.getPriorityReverse(this.updateFormData.priority);
        this.updateFormData.followUpDate = moment(this.updateFormData.followUpDate).format("YYYY-MM-DD");
        this.fetchService.updateEnquiryForm(this.selectedEnquiry.institute_enquiry_id, this.updateFormData).subscribe(
          res => {
            this.isRippleLoad = false;
            let msg = { type: 'success', title: 'Enquiry Updated', body: 'Your enquiry has been successfully updated' };
            this.popToast(msg);
            if (this.isConvertToStudent) {
              let obj = { name: this.selectedEnquiry.name, phone: this.selectedEnquiry.phone, email: this.selectedEnquiry.email, gender: this.selectedEnquiry.gender, dob: moment(this.selectedEnquiry.dob).format("YYYY-MM-DD"), parent_email: this.selectedEnquiry.parent_email, parent_name: this.selectedEnquiry.parent_name, parent_phone: this.selectedEnquiry.parent_phone, enquiry_id: this.selectedEnquiry.institute_enquiry_id, institute_enquiry_id: this.selectedEnquiry.institute_enquiry_id };
              localStorage.setItem('studentPrefill', JSON.stringify(obj));
              this.closeEnquiryUpdate();
              this.router.navigate(['/view/student/add']);
            }
            else {
              this.closeEnquiryUpdate();
            }
          },
          err => {
            this.isRippleLoad = false;
            let alert = { type: 'error', title: 'Failed To Update Enquiry', body: err.error.message };
            this.popToast(alert);
          }
        );
      }
      else {
        this.isRippleLoad = false;
        let msg = { type: 'error', title: 'Invalid Date Time Input', body: 'Please select a valid date time for follow up' };
        this.popToast(msg);
      }
    }
    else {
      this.isRippleLoad = false;
      let msg = { type: 'error', title: 'Invalid Date Time Input', body: 'Please select a valid date time for follow up' };
      this.popToast(msg);
    }
  }

  validateTime(): boolean {
    /* some time selected by user or nothing*/
    let check = false;
    if ((this.hour != '' && this.minute != '') || (this.hour == '' && this.minute == '')) {
      check = true;
    }
    else {
      check = false;
      return check;
    }
    if ((this.updateFormData.walkin_followUpTime.hour != "" && this.updateFormData.walkin_followUpTime.minute != "") || (this.updateFormData.walkin_followUpTime.hour == "" && this.updateFormData.walkin_followUpTime.minute == "")) {
      check = true;
    } else {
      check = false;
      return check;
    }
    return check;
  }

  timeChanges(ev) {
    let obj: any = {};
    let time = ev.split(' ');
    obj.hour = time[0];
    obj.meridian = time[1];
    return obj;
  }

  getFollowUpReverse(id): string {
    let temp: string = ""
    this.enqFollowType.forEach(el => {
      if (el.data_value === id) {
        temp = el.data_key;
      }
    });
    return temp;
  }


  getPriorityReverse(id): string {
    let temp: string = ""
    this.enqPriority.forEach(el => {
      if (el.data_value === id) {
        temp = el.data_key;
      }
    });
    //console.log(temp);
    return temp;
  }

  notifyMe(e) {
    if (e) {
      this.updateFormData.is_follow_up_time_notification = 1;
    }
    else {
      this.updateFormData.is_follow_up_time_notification = 0;
    }
  }

  multiBranchInstituteFound(id) {
    this.fetchService.getAllSubBranches(id).subscribe(
      (res: any) => {
        this.branchesList = res;
      },
      err => {
        console.log(err);
      }
    );
  }


  branchUpdated(e) {
    this.enqAssignTo = [];
    this.isRippleLoad = true;
    this.fetchService.fetchAssignedToData(e).subscribe(
      res => {
        this.isRippleLoad = false;
        this.enqAssignTo = res;
      },
      err => {
        this.isRippleLoad = false;
        console.log(err);
      }
    );
  }

  breakTimeInToHrAndMin(time) {
    let obj: any = {
      hour: '',
      minute: ''
    };
    obj.hour = time.split(':')[0] + " " + time.split(':')[1].split(' ')[1];
    obj.minute = time.split(':')[1].split(' ')[0];
    return obj;
  }

}
