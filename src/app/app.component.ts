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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  isConvertToStudent: boolean;
  isEnqUpdate: boolean;
  isloggedInAdmin: boolean;

  isSearchMore: boolean = false;

  selectedEnquiry: any = {
    enquiry_no: '',
    name: '',
    status: ''
  }

  enqstatus: any[] = []; enqPriority: any[] = [];
  enqFollowType: any[] = []; enqAssignTo: any[] = [];

  updateFormData: any = {
    comment: "",
    status: "",
    statusValue: "",
    institution_id: sessionStorage.getItem('institute_id'),
    isEnquiryUpdate: "Y",
    closedReason: null,
    slot_id: null,
    priority: "",
    follow_type: "",
    followUpDate: "",
    commentDate: moment().format('YYYY-MM-DD'),
    followUpTime: "",
    followUpDateTime: '',
    isEnquiryV2Update: "N",
    isRegisterFeeUpdate: "N",
    amount: null,
    paymentMode: null,
    paymentDate: null,
    reference: null,
    walkin_followUpDate: '',
    walkin_followUpTime: {
      hour: '',
      minute: '',
    },
    is_follow_up_time_notification: 0,
  }
  isNotifyVisible: boolean = false;
  times: any[] = ['', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM', '12 AM'];
  minArr: any[] = ['', '00', '15', '30', '45'];
  hour: string = ''; minute: string = ''; meridian: string = '';

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
  isMenuVisible: boolean = false;
  updateFormComments: any = []; updateFormCommentsBy: any = []; updateFormCommentsOn: any = [];
  public config: ToasterConfig = new ToasterConfig({
    positionClass: 'toast-top-right',
    limit: 1,
    timeout: 5000,
    mouseoverTimerStop: true,
  });

  helpLoader: boolean = false;
  ticketId = "";
  addReportPopup: boolean = false;
  closechatbot: boolean = true;
  enquiryResult: any[] = [];
  studentResult: any[] = [];
  searchResult: any[] = [];

  globalSearchForm: any = {
    name: '',
    phone: '',
    instituteId: sessionStorage.getItem('institute_id'),
    start_index: '-1',
    batch_size: '-1'
  }

  isRippleLoad: boolean = true;
  institute_id: boolean = false;
  popUpChangePassword: boolean = false;
  changePass: any = {
    username: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  }

  constructor
    (
    toasterService: ToasterService,
    private router: Router,
    private load: LoaderHandlingService,
    private log: LoginService,
    private fetchService: FetchprefilldataService,
    private titleService: Title,
    private auth: AuthenticatorService,
    private intercept: AlertService) {

    this.toasterService = toasterService;

    this.auth.currentInstituteId.subscribe(id => {
      if (id != null && id != "") {
        this.institute_id = id;
      }
    });

  }

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

  }

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
    this.router.navigate(['/student'], { queryParams: { id: s.id } });
  }

  public enquirySelected(e) {
    this.closeSearchArea();
    this.router.navigate(['/enquiry'], { queryParams: { id: e.id } });
  }

  public performAction(a: string, data) {

    let d = data.id
    switch (a) {
      case 'studentEdit': {
        this.closeSearchArea();
        this.router.navigate(['/student'], { queryParams: { id: d, action: a } });
        break;
      }
      case 'studentFee': {
        this.closeSearchArea();
        this.router.navigate(['/student'], { queryParams: { id: d, action: a } });
        break;
      }
      case 'studentInventory': {
        this.closeSearchArea();
        this.router.navigate(['/student'], { queryParams: { id: d, action: a } });
        break;
      }
      case 'studentLeave': {
        this.closeSearchArea();
        this.router.navigate(['/student'], { queryParams: { id: d, action: a } });
        break;
      }
      case 'studentDelete': {
        this.closeSearchArea();
        this.router.navigate(['/student'], { queryParams: { id: d, action: a } });
        break;
      }
      case 'enquiryEdit': {
        this.closeSearchArea();
        this.router.navigate(['/enquiry'], { queryParams: { id: d, action: a } });
        break;
      }
      case 'enquiryUpdate': {
        this.closeSearchArea();
        this.router.navigate(['/enquiry'], { queryParams: { id: d, action: a } });
        break;
      }

    }
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  informFooter() {
  }

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

  loadEnquiryData(e) {
    this.isEnqUpdate = true;
    this.fetchCommentData(e);
    this.enquiryDataFetch(e);
  }

  fetchCommentData(e) {
    this.fetchService.fetchCommentsForEnquiry(e.data.id).subscribe(
      res => {
        this.updateFormComments = res.comments;
        this.updateFormCommentsOn = res.commentedOn;
        this.updateFormCommentsBy = res.commentedBy;
        this.updateFormData.assigned_to = res.assigned_to;
        if (res.walkin_followUpTime != "" && res.walkin_followUpTime != null) {
          let timeObj = this.convertTimeToFormat(res.walkin_followUpTime);
          this.updateFormData.walkin_followUpTime.hour = timeObj.hour + " " + timeObj.meridian;
          this.updateFormData.walkin_followUpTime.minute = timeObj.minute;
        }
        this.updateFormData.walkin_followUpDate = res.walkin_followUpDate;

      },
      err => { }
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
      }
    )
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

  updateRegisterEnquiry() {
    this.isConvertToStudent = true;
    this.pushUpdatedEnquiry();
  }

  pushUpdatedEnquiry() {
    if (this.validateTime()) {
      this.isRippleLoad = true;
      this.updateFormData.comment = this.updateFormData.comment;
      this.updateFormData.follow_type = this.getFollowUpReverse(this.updateFormData.follow_type);
      this.updateFormData.priority = this.getPriorityReverse(this.updateFormData.priority);
      let followupdateTime: string = "";
      if (this.hour != '' && this.hour != null && this.hour != undefined) {
        let time = this.timeChanges(this.hour);
        let followUpTime = time.hour + ":" + this.minute + " " + time.meridian;
        followupdateTime = moment(this.updateFormData.followUpDate).format('DD-MMM-YY') + " " + followUpTime;
        this.updateFormData.followUpTime = followUpTime;
      }
      followupdateTime = moment(this.updateFormData.followUpDate).format('DD-MMM-YY');

      if (this.updateFormData.walkin_followUpTime.hour != "" && this.updateFormData.walkin_followUpTime.hour != null && this.updateFormData.walkin_followUpTime.hour != undefined) {
        let time = this.timeChanges(this.updateFormData.walkin_followUpTime.hour);
        let walkin_followUpTime = time.hour + ":" + this.updateFormData.walkin_followUpTime.minute + " " + time.meridian;
        this.updateFormData.walkin_followUpTime = walkin_followUpTime;
      } else {
        this.updateFormData.walkin_followUpTime = "";
      }

      if (this.updateFormData.walkin_followUpDate != "" && this.updateFormData.walkin_followUpDate != null) {
        let walkinfollowUpDate = moment(this.updateFormData.walkin_followUpDate).format('YYYY-MM-DD');
        this.updateFormData.walkin_followUpDate = walkinfollowUpDate;
      } else {
        this.updateFormData.walkin_followUpDate = "";
      }

      if (this.updateFormData.is_follow_up_time_notification) {
        this.updateFormData.is_follow_up_time_notification = 1;
      }
      else if (!this.updateFormData.is_follow_up_time_notification) {
        this.updateFormData.is_follow_up_time_notification = 0;
      }

      this.fetchService.updateEnquiryForm(this.selectedEnquiry.institute_enquiry_id, this.updateFormData).subscribe(
          res => {
            this.isRippleLoad = false;
            let msg = {
              type: 'success',
              title: 'Enquiry Updated',
              body: 'Your enquiry has been successfully updated'
            }
            this.popToast(msg);
            if (this.isConvertToStudent) {
              let obj = {
                name: this.selectedEnquiry.name,
                phone: this.selectedEnquiry.phone,
                email: this.selectedEnquiry.email,
                gender: this.selectedEnquiry.gender,
                dob: moment(this.selectedEnquiry.dob).format("YYYY-MM-DD"),
                parent_email: this.selectedEnquiry.parent_email,
                parent_name: this.selectedEnquiry.parent_name,
                parent_phone: this.selectedEnquiry.parent_phone,
                enquiry_id: this.selectedEnquiry.institute_enquiry_id,
                institute_enquiry_id: this.selectedEnquiry.institute_enquiry_id
              }
              localStorage.setItem('studentPrefill', JSON.stringify(obj));
              this.closeEnquiryUpdate();
              this.router.navigate(['student/add']);
            }
            else {
              this.closeEnquiryUpdate();
            }
          },
          err => {
            this.isRippleLoad = false;
            let alert = {
              type: 'error',
              title: 'Failed To Update Enquiry',
              body: 'There was an error processing your request'
            }
            this.popToast(alert);
          });
    }
    else {
      let msg = {
        type: 'error',
        title: 'Invalid Time Input',
        body: 'Please select a valid time for follow up'
      }
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



}
