import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { trigger, animate, style, group, animateChild, query, stagger, transition } from '@angular/animations';
import { ToasterModule, Toast, ToasterService, ToasterConfig } from '../assets/imported_modules/angular2-toaster/angular2-toaster';
import { LoaderHandlingService } from './services/loading-services/loader-handling.service';
import { LoginService } from './services/login-services/login.service';
import { FetchprefilldataService } from './services/fetchprefilldata.service';
import { Title } from '@angular/platform-browser';
import { AuthenticatorService } from './services/authenticator.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  isloggedInAdmin: boolean;

  isSearchMore: boolean = false;
  @ViewChild('footer') footer: ElementRef;
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
    private auth: AuthenticatorService
    ) {

    this.toasterService = toasterService;
    this.auth.currentInstituteId.subscribe(id => {
      if (id != null && id != "") {
        this.institute_id = id;
      }
    });
  }



  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isRippleLoad = true;
        this.closeSearchArea();
        if (sessionStorage.getItem('Authorization') != null) {
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
        if (sessionStorage.getItem('Authorization') != null) {
          this.log.changeSidenavStatus('authorized');
        }
      }
      else if (event instanceof NavigationError) {
        this.isRippleLoad = false;
        this.closeSearchArea();
        if (sessionStorage.getItem('Authorization') != null) {
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
    this.footer.nativeElement.classList.remove('hide');
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

}
