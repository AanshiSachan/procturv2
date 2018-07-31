import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '../../../app.component';
import { LoginService } from '../../../services/login-services/login.service';
import { LoginAuth } from '../../../model/login-auth';
import { instituteList } from '../../../model/institute-list-auth-popup';
import { InstituteLoginInfo } from '../../../model/multiInstituteLoginData';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {

  serverUserData: any;
  /* Variable Declaration */
  loginDataForm: LoginAuth;
  loading = false;
  returnUrl: string;
  isLoginView: boolean = true;
  isInstituteListPop: boolean = false;
  OTPVerificationPopUp: boolean = false;
  isUserListPop: boolean = false;
  instituteListArr: any = [];
  OTPRegenerateData: any;
  countDown: any;
  counter: number = 30;
  no_email_found: boolean = false;
  isProcturVisible: boolean = false;


  instituteListObj: instituteList = {
    institute_id: "",
    institute_name: "",
    userId: ""

  }
  multiUserListObj: any = {
    alternate_email_id: "",
    password: "",
    institution_id: "",
    userID: "",
    userType: "",
    user_role: ""
  }



  selectedMultiInstitute: any;
  selectedUserRole: any;

  multiInstituteLoginInfo: InstituteLoginInfo = {
    alternate_email_id: "",
    password: "",
    userid: "",
    institution_id: ""
  }

  userListArr: any[] = [];
  multiUserLoginInfo: any = {
    alternate_email_id: "",
    password: "",
    userid: "",
    institution_id: "",
    user_role: ""
  }


  otpVerificationPhoneNumber: string;
  otpVerificationInfo: any = {
    otp_code: "",
    mobile_no: "",
    alternate_email_id: "",
    password: "",
    userid: "",
    otp_validate_mode: 1
  }

  baseUrl: string = '';
  Authorization: any;
  headers;
  institute_id;
  @ViewChild('viewChange') changeView : ElementRef;

  constructor(private login: LoginService, private route: Router, private actroute: ActivatedRoute,
    private toastCtrl: AppComponent, private auth: AuthenticatorService) {
    /* hide header and sidebar from the view onInit to give the user the full screen view of the web app  */
    if (sessionStorage.getItem('userid') != null) {
      this.fullscreenLogin();
      this.loginDataForm = {
        alternate_email_id: "",
        password: ""
      }
      this.createRoleBasedSidenav();
    }
    /* If Null then continue login else move to enq */
    else {
      this.fullscreenLogin();
      this.loginDataForm = {
        alternate_email_id: "",
        password: ""
      }
    }

    this.auth.currentAuthKey.subscribe(key => {
      this.Authorization = key;
      this.headers = new HttpHeaders({ "Content-Type": "application/json", "Authorization": this.Authorization });
    })
    this.auth.currentInstituteId.subscribe(id => {
      this.institute_id = id;
    });
    // this.institute_id = this.auth.getInstituteId();
    // this.Authorization = this.auth.getAuthToken();
    //console.log(this.institute_id);
    this.baseUrl = this.auth.getBaseUrlStudent()

  }



  ngOnInit() {
    this.checkWebUrlForGenerics();
  }



  ngOnDestroy() {
    this.isProcturVisible = true;
  }


  checkWebUrlForGenerics() {
    let url: string = window.location.href;
    let test = url.split("/")[2];
    if (test === "webtest.proctur.com" || test === "web.proctur.com" || test === "localhost:4200") {
      this.isProcturVisible = true;
      this.changeView.nativeElement.className = "box"
    }

    else {
      this.isProcturVisible = false;
      this.changeView.nativeElement.className = "boxNew"
    }

  }


  /* Function to hide element with tag name header and sidebar */
  fullscreenLogin() {
    var header = document.getElementsByTagName('core-header');
    var sidebar = document.getElementsByTagName('core-sidednav');

    [].forEach.call(header, function (el) {
      el.classList.add('hide');
    });
    [].forEach.call(sidebar, function (el) {
      el.classList.add('hide');
    });
  }

  /*
    When user fill the login form and tries to login : ( START - 0)
      1. Check if email or password is not empty
      2. Send login Info to Server
  */
  loginViaServer() {
    if (this.loginDataForm.alternate_email_id == "" && this.loginDataForm.password == "") {
      let data = {
        type: "error",
        title: "Invalid Input",
        body: "Please enter valid Email ID/Mobile number and Password"
      }
      this.toastCtrl.popToast(data);
    }
    else if (this.loginDataForm.password == "") {
      let data = {
        type: "warning",
        title: "Invalid Password",
        body: "Please enter Password"
      }
      this.toastCtrl.popToast(data);
    }
    else {
      this.login.postLoginDetails(this.loginDataForm).subscribe(
        res => {
          this.checkForAuthOptions(res);
        },
        err => {
          console.log(err);
        }
      );
    }
  }



  //END - 0

  //Method to decide where to take user when he/she Logs in (START - 1)
  checkForAuthOptions(res) {
    let login_option: number = res.login_option;
    switch (login_option) {
      case 1:
        this.OTPVerification(res);
        break;
      case 4:
        this.alternateLoginFailure();
        break;
      case 3:
        this.alternateLoginSuccess(res);
        break;
      case 7:
        this.alternateLoginEmailNotVerified();
        break;
      case 6:
        this.alternateLoginMultiInstitute(res);
        break;
      case 5:
        this.alternateLoginMultiUser(res);
        break;
    }
  }



  //End - 1

  //if login is fails ( Start - 2)
  alternateLoginFailure() {
    let data = {
      type: "error",
      title: "User not Registered",
      body: "You are not registered with our System."
    }
    this.toastCtrl.popToast(data);
  }
  //End -2

  validInstituteCheck(data): boolean {
    /* Open For All Institute Currently */
    return true;
    /* Code to Resrict Users from login without invitation */
    /* let instIdArr = this.login.getAllInstituteId();
    if (instIdArr.indexOf(data.institution_id) == -1) {
      return false;
    } else {
      return true;
    } */
  }

  //if login is successfull ( Start - 3)
  alternateLoginSuccess(res) {
    if (!this.validInstituteCheck(res)) {
      this.route.navigateByUrl('/authPage');
      //console.log('Institute ID Not Found');
      let data = {
        type: "error",
        title: "Institute not registered",
        body: "Your institute not registered to use this."
      }
      this.toastCtrl.popToast(data);
      sessionStorage.clear();
      localStorage.clear();
      return
    }
    else {
      this.serverUserData = res;
      sessionStorage.setItem('institute_info', JSON.stringify(res.data));
      this.toastCtrl.informFooter();
      let institute_data = JSON.parse(sessionStorage.getItem('institute_info'));
      let Authorization = btoa(institute_data.userid + "|" + institute_data.userType + ":" + institute_data.password + ":" + institute_data.institution_id);
      this.auth.changeAuthenticationKey(Authorization);
      this.auth.changeInstituteId(institute_data.institution_id);
      sessionStorage.setItem('institute_id', institute_data.institution_id);
      sessionStorage.setItem('about_us_image', institute_data.about_us_image);
      sessionStorage.setItem('about_us_text', institute_data.about_us_text);
      sessionStorage.setItem('accountId', institute_data.accountId);
      sessionStorage.setItem('alternate_email_id', institute_data.alternate_email_id);
      sessionStorage.setItem('biometric_attendance_feature', institute_data.biometric_attendance_feature);
      sessionStorage.setItem('courseType', institute_data.courseType);
      sessionStorage.setItem('course_structure_flag', institute_data.course_structure_flag);
      this.auth.course_flag.next(institute_data.course_structure_flag);
      sessionStorage.setItem('enable_fee_payment_mandatory_student_creation', institute_data.enable_fee_payment_mandatory_student_creation);
      sessionStorage.setItem('enable_fee_templates', institute_data.enable_fee_templates);
      sessionStorage.setItem('enable_tax_applicable_fee_installments', institute_data.enable_tax_applicable_fee_installments);
      sessionStorage.setItem('exam_grading_system', institute_data.exam_grading_system);
      sessionStorage.setItem('fb_page_url', institute_data.fb_page_url);
      sessionStorage.setItem('fee_functionality', institute_data.fee_functionality);
      sessionStorage.setItem('fetaures_map', institute_data.fetaures_map);
      sessionStorage.setItem('inst_email', institute_data.inst_email);
      sessionStorage.setItem('inst_phone', institute_data.inst_phone);
      sessionStorage.setItem('inst_reg_code', institute_data.inst_reg_code);
      sessionStorage.setItem('inst_set_up', institute_data.inst_set_up);
      sessionStorage.setItem('institute_type', institute_data.institute_type);
      this.auth.institute_type.next(institute_data.institute_type);
      this.auth.instituteType_name.next(institute_data.institute_type);
      this.auth.makeInstituteType(institute_data.institute_type, institute_data.course_structure_flag);
      sessionStorage.setItem('institution_footer', institute_data.institution_footer);
      sessionStorage.setItem('institution_header1', institute_data.institution_header1);
      sessionStorage.setItem('institution_header2', institute_data.institution_header2);
      sessionStorage.setItem('institution_header3', institute_data.institution_header3);
      sessionStorage.setItem('institution_logo', institute_data.institution_logo);
      sessionStorage.setItem('institution_name', institute_data.institution_name);
      sessionStorage.setItem('institute_name', institute_data.institute_name);
      sessionStorage.setItem('is_campaign_message_approve_feature', institute_data.is_campaign_message_approve_feature);
      sessionStorage.setItem('allow_sms_approve_feature', res.data.allow_sms_approve_feature);
      sessionStorage.setItem('is_main_branch', institute_data.is_main_branch);
      this.auth.changeMainBranchValue(institute_data.is_main_branch);
      sessionStorage.setItem('is_student_bulk_upload_byClient', institute_data.is_student_bulk_upload_byClient);
      sessionStorage.setItem('is_student_mgmt_flag', institute_data.is_student_mgmt_flag);
      sessionStorage.setItem('login_student_id', institute_data.login_student_id);
      sessionStorage.setItem('login_teacher_id', institute_data.login_teacher_id);
      sessionStorage.setItem('manual_student_disp_id', institute_data.manual_student_disp_id);
      sessionStorage.setItem('name', institute_data.name);
      sessionStorage.setItem('online_payment_feature', institute_data.online_payment_feature);
      sessionStorage.setItem('password', institute_data.password);
      sessionStorage.setItem('promoCode', institute_data.promoCode);
      sessionStorage.setItem('religion_feature', institute_data.religion_feature);
      sessionStorage.setItem('student_report_card_fee_module', institute_data.student_report_card_fee_module);
      sessionStorage.setItem('studwise_fee_mod_with_amt', institute_data.studwise_fee_mod_with_amt);
      sessionStorage.setItem('tag_line', institute_data.tag_line);
      sessionStorage.setItem('test_feature', institute_data.test_feature);
      sessionStorage.setItem('testprepEnabled', institute_data.testprepEnabled);
      sessionStorage.setItem('userCat', institute_data.userCat);
      sessionStorage.setItem('userTimeGrp', institute_data.userTimeGrp);
      sessionStorage.setItem('userType', institute_data.userType);
      this.login.changeUserType(institute_data.userType);
      sessionStorage.setItem('user_permission', institute_data.user_permission);
      sessionStorage.setItem('user_type_name', institute_data.user_type_name);
      sessionStorage.setItem('username', institute_data.username);
      sessionStorage.setItem('username', institute_data.username);
      sessionStorage.setItem('userid', institute_data.userid);
      sessionStorage.setItem('message', institute_data.message);
      sessionStorage.setItem('name', institute_data.name);
      sessionStorage.setItem('fb_page_url', institute_data.fb_page_url);
      sessionStorage.setItem('about_us_text', institute_data.about_us_text);
      sessionStorage.setItem('mobile_no', institute_data.mobile_no);
      sessionStorage.setItem('inst_announcement', institute_data.inst_announcement);
      sessionStorage.setItem('logo_url', institute_data.logo_url);
      sessionStorage.setItem('permitted_roles', JSON.stringify(res.data.featureDivMapping));
      sessionStorage.setItem('is_exam_grad_feature', institute_data.is_exam_grad_feature);
      sessionStorage.setItem('enable_routing', institute_data.enable_routing);
      sessionStorage.setItem('enable_online_payment_feature', institute_data.enable_online_payment_feature);
      if (res.data.permissions == undefined || res.data.permissions == undefined || res.data.permissions == null) {
        sessionStorage.setItem('permissions', '');
        this.login.changePermissions('');
      }
      else {
        sessionStorage.setItem('permissions', JSON.stringify(res.data.permissions.split(',')));
        this.login.changePermissions(JSON.stringify(res.data.permissions.split(',')));
      }


      if (sessionStorage.getItem('userType') == '0' || sessionStorage.getItem('userType') == '3') {
        this.createRoleBasedSidenav();
      }
      else if (sessionStorage.getItem('userType') == '1') {
        sessionStorage.setItem('student_id', res.data.studentId);
        sessionStorage.setItem('institution_id', res.institution_id);
        sessionStorage.setItem('user_type_name', 'Student');
        sessionStorage.setItem('inst_set_up', res.data.institute_setup_type);
        sessionStorage.setItem('institution_name', res.data.institute_name);
        sessionStorage.setItem('is_cobranding', res.data.is_cobranding);
        window.location.href = this.baseUrl + "/sPortal/dashboard.html#/Dashboard";
      }
      else if (sessionStorage.getItem('userType') == '5') {
        sessionStorage.setItem('student_id', res.data.parentStudentList[0].student_id);
        sessionStorage.setItem('user_type_name', 'Parent');
        sessionStorage.setItem('institution_id', res.institution_id);
        sessionStorage.setItem('inst_set_up', res.data.institute_setup_type);
        sessionStorage.setItem('institution_name', res.data.institute_name);
        sessionStorage.setItem('is_cobranding', res.data.is_cobranding);
        window.location.href = this.baseUrl + "/sPortal/dashboard.html#/Dashboard";
      }
    }
  }
  //End - 3




  //if login email is not verified ( Start - 4 )
  alternateLoginEmailNotVerified() {
    let data = {
      type: "warning",
      title: "Email Not Verified",
      body: "Kindly, Login to mail and verify that its you."
    }
    this.toastCtrl.popToast(data);
  }
  //End - 4




  //if login email is registered in multi insititute ( Start - 5 )
  alternateLoginMultiInstitute(data) {

    this.instituteListArr = [];
    data.institutesList.forEach(el => {
      this.instituteListObj.institute_id = el.institute_id;
      this.instituteListObj.institute_name = el.institute_name;
      this.instituteListObj.userId = el.userId;
      this.instituteListArr.push({ 'institute_id': this.instituteListObj.institute_id, 'institute_name': this.instituteListObj.institute_name, 'userId': this.instituteListObj.userId });
    });
    this.isLoginView = false;
    //console.log(this.instituteListArr);
    this.showInstituteList();
  }
  //End - 5




  alternateLoginMultiInstituteData(u_id, inst_id) {
    this.multiInstituteLoginInfo.userid = u_id;
    this.multiInstituteLoginInfo.institution_id = inst_id;
    this.multiInstituteLoginInfo.alternate_email_id = this.loginDataForm.alternate_email_id;
    this.multiInstituteLoginInfo.password = this.loginDataForm.password;
    //console.log(this.multiInstituteLoginInfo);
    this.closeInstituteList();
    this.login.postLoginDetails(this.multiInstituteLoginInfo).subscribe(el => {
      //console.log(el);
      this.checkForAuthOptions(el);
    });
  }




  //if user mobile no. is not verified ( Start - 6 )
  OTPVerification(res) {
    this.OTPRegenerateData = res;
    let phone_no = res.mobile_no;
    this.otpVerificationPhoneNumber = phone_no.substring(6);
    this.otpVerificationInfo.alternate_email_id = this.loginDataForm.alternate_email_id;
    this.otpVerificationInfo.password = this.loginDataForm.password;
    this.otpVerificationInfo.mobile_no = res.mobile_no;
    this.otpVerificationInfo.userid = res.userid;
    this.isLoginView = false;
    this.showOTPValidationModal();
    this.countDown = Observable.timer(0, 1000)
      .take(this.counter)
      .map(() => --this.counter);
  }
  //END - 6




  //if login email is registered as multi user ( Start - 7 )
  alternateLoginMultiUser(data) {
    this.userListArr = [];
    this.multiUserListObj.institute_id = data.institution_id;
    data.userTypeMappingList.forEach(el => {
      if (el.userType == 0) { // Custom User Type
        this.multiUserListObj.userType = "Custom";
      } else if (el.userType == 3) { // Teacher User Type
        this.multiUserListObj.userType = "Teacher";
      } else if (el.userType == 5) { // Parent User Type
        this.multiUserListObj.userType = "Parent";
      }
      this.multiUserListObj.userID = el.userID;
      this.multiUserListObj.user_role = el.userType;
      this.userListArr.push({ 'institute_id': this.multiUserListObj.institute_id, 'userID': this.multiUserListObj.userID, 'userType': this.multiUserListObj.userType, 'user_role': this.multiUserListObj.user_role });
    })
    this.isLoginView = false;
    this.showUserList();
  }




  alternateLoginMultiUserData(u_id, u_role, inst_id) {
    this.multiUserLoginInfo.userid = u_id;
    this.multiUserLoginInfo.user_role = u_role;
    this.multiUserLoginInfo.institution_id = inst_id;
    this.multiUserLoginInfo.alternate_email_id = this.loginDataForm.alternate_email_id;
    this.multiUserLoginInfo.password = this.loginDataForm.password;
    this.closeUserList();
    this.login.postLoginDetails(this.multiUserLoginInfo).subscribe(el => {
      //console.log(el);
      this.checkForAuthOptions(el);
    });
  }
  //END - 7





  alternateLoginOTPVerification() {
    //console.log("##### trying to Validate OTP #####");
    //console.log(this.otpVerificationInfo);
    if (this.otpVerificationInfo.otp_code == null || this.otpVerificationInfo.otp_code == "") {
      let data = {
        type: "error",
        title: "Not Found",
        body: "Kindly, Enter the OTP."
      }
      this.toastCtrl.popToast(data);
    } else {
      this.login.validateOTPCode(this.otpVerificationInfo).subscribe((el: any) => {
        //console.log(el);
        if (el.otp_status == 1) {
          //console.log("OTP Expired");
          let data = {
            type: "error",
            title: "OTP Expired",
            body: "Kindly, Regenerate the OTP."
          }
          this.toastCtrl.popToast(data);
        } else if (el.otp_status == 2) {
          //console.log("Incorrect OTP");
          let data = {
            type: "warning",
            title: "OTP Incorrect",
            body: "Kindly, Enter the right OTP."
          }
          this.toastCtrl.popToast(data);
        } else if (el.login_option == 3) {
          //console.log("OTP Verified Success");
          this.alternateLoginSuccess(el);
          this.closeOTPValidationModal();
        }
      })
    }
  }




  alternateLoginOTPRegenerate() {
    //console.log("##### in Regenerate Method ######");
    //console.log(this.OTPRegenerateData);
    this.login.regenerateOTP(this.OTPRegenerateData).subscribe(el => {
      //console.log("OTP Regenerate Success");
      //console.log(el);
      this.OTPVerification(el);
    })
  }




  forgotPassword() {
    let forgotPasswordData = {
      alternate_email_id: ""
    }
    if (this.loginDataForm.alternate_email_id == "") {
      //console.log("no email id");
      this.no_email_found = true;
    } else {
      forgotPasswordData.alternate_email_id = this.loginDataForm.alternate_email_id;
      this.login.forgotPassowrdServiceMethod(forgotPasswordData).subscribe(
        el => {
          let data = {
            type: "success",
            title: "Password Reset Successfull",
            body: "Kindly check your Mobile/Email Id for further Details!"
          }
          this.toastCtrl.popToast(data);
        },
        err => {
          let errorObj = JSON.parse(JSON.stringify(err._body));
          let error_JSON = JSON.parse(errorObj);
          let data = {
            type: "error",
            title: "Not Found",
            body: error_JSON.message
          }
          this.toastCtrl.popToast(data);
        })
    }
  }




  showInstituteList() {
    this.isInstituteListPop = true;
  }




  showUserList() {
    this.isUserListPop = true;
  }




  closeUserList() {
    this.isUserListPop = false;
  }




  /* function to hide isInstituteList popup */
  closeInstituteList() {
    this.isInstituteListPop = false;
  }




  showOTPValidationModal() {
    this.OTPVerificationPopUp = true;
  }




  /* function to hide popup to add institute */
  closeOTPValidationModal() {
    this.OTPVerificationPopUp = false;
  }




  openGetAdvice() {
    let url = "http://proctur.com/get_advice.html";
    window.open(url);
  }


  removeFullscreen() {
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


  createRoleBasedSidenav() {
    this.auth.currentInstituteId.subscribe(id => {
      /* If Id has been updated to the services then proceed */
      if (id != null && id != "null") {
        if (sessionStorage.getItem('userType') == '0' || sessionStorage.getItem('userType') == '3') {
          this.login.storeInstituteInfoToSession().subscribe(
            (res: any) => {
              sessionStorage.setItem('manual_student_disp_id', res.is_student_displayId_manual);
              this.login.changeSidenavStatus('authorized');
              this.route.navigateByUrl('/view/home');
            },
            err => {
              this.login.changeSidenavStatus('authorized');
              this.route.navigateByUrl('/view/home');
            }
          );
        }
        else if (sessionStorage.getItem('userType') == '1') {
          //sessionStorage.setItem('student_id', this.serverUserData.data.studentId);
          //sessionStorage.setItem('user_type_name', 'Student');
          //window.location.href = "http://127.0.0.1:8001/sPortal/dashboard.html#/Dashboard";
          sessionStorage.setItem('student_id', this.serverUserData.data.studentId);
          sessionStorage.setItem('institution_id', this.serverUserData.institution_id);
          sessionStorage.setItem('user_type_name', 'Student');
          sessionStorage.setItem('inst_set_up', this.serverUserData.data.institute_setup_type);
          sessionStorage.setItem('institution_name', this.serverUserData.data.institute_name);
          sessionStorage.setItem('is_cobranding', this.serverUserData.data.is_cobranding);
          window.location.href = this.baseUrl + "/sPortal/dashboard.html#/Dashboard";
        }
        else if (sessionStorage.getItem('userType') == '5') {
          // sessionStorage.setItem('student_id', this.serverUserData.data.parentStudentList[0].student_id);
          // sessionStorage  .setItem('user_type_name', 'Parent');

          sessionStorage.setItem('student_id', this.serverUserData.data.parentStudentList[0].student_id);
          sessionStorage.setItem('user_type_name', 'Parent');
          sessionStorage.setItem('institution_id', this.serverUserData.institution_id);
          sessionStorage.setItem('inst_set_up', this.serverUserData.data.institute_setup_type);
          sessionStorage.setItem('institution_name', this.serverUserData.data.institute_name);
          sessionStorage.setItem('is_cobranding', this.serverUserData.data.is_cobranding);
          window.location.href = this.baseUrl + "/sPortal/dashboard.html#/Dashboard";
        }
      }
      /* If Id Not set then recall the function as user has successfully logged in */
      else {
        setTimeout(this.reCheckLogin(), 3000);
      }
    });
  }


  reCheckLogin() {
    let id = sessionStorage.getItem('institute_id');
    let institute_data = JSON.parse(sessionStorage.getItem('institute_info'));
    if (id != null && id != "null") {
      if (institute_data != null && institute_data != undefined) {
        let Authorization = btoa(institute_data.userid + "|" + institute_data.userType + ":" + institute_data.password + ":" + institute_data.institution_id);
        this.auth.changeAuthenticationKey(Authorization);
      }
      this.auth.changeInstituteId(sessionStorage.getItem('institute_id'));
      this.createRoleBasedSidenav();
    }
  }

  getBaseUrlStudent(): string {
    let test = window.location.href.split("/")[2];

    if (test === "webtest.proctur.com") {
      return "http://webtest.proctur.com";
    }
    else if (test === "web.proctur.com") {
      return "https://web.proctur.com";
    }
  }

}
