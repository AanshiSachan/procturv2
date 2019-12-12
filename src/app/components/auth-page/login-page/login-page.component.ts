import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { LoginAuth } from '../../../model/login-auth';
import { instituteList } from '../../../model/institute-list-auth-popup';
import { InstituteLoginInfo } from '../../../model/multiInstituteLoginData';
import { LoginService } from '../../../services/login-services/login.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { TablePreferencesService } from '../../../services/table-preference/table-preferences.service';
import { MessageShowService } from '../../../services/message-show.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {

  /* Variable Declaration */
  @ViewChild('viewChange') changeView: ElementRef;
  @ViewChild('backgroundChange') backgroundChange: ElementRef;
  @ViewChild('virtualStyle') virtualStyle: ElementRef;
  loginDataForm: LoginAuth;
  selectedCourseNames = [];
  courses: any = [];
  userListArr: any[] = [];
  instituteListArr: any = [];

  OTPRegenerateData: any;
  countDown: any;
  serverUserData: any;
  selectedMultiInstitute: any;
  selectedUserRole: any;
  Authorization: any;
  headers: any;
  institute_id: any;
  messages: any;
  returnUrl: string;
  dynamicImgSrc: string = '';
  baseUrl: string = '';
  counter: number = 30;

  no_email_found: boolean = false;
  isProcturVisible: boolean = false;
  isLoginView: boolean = true;
  isInstituteListPop: boolean = false;
  OTPVerificationPopUp: boolean = false;
  isUserListPop: boolean = false;
  loading: boolean = false;
  isGuestUser: boolean = false;
  isGuestUserCourse: boolean = false;
  countryDetails: [{}] = [{}];

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

  multiInstituteLoginInfo: InstituteLoginInfo = {
    alternate_email_id: "",
    password: "",
    userid: "",
    institution_id: ""
  }

  multiUserLoginInfo: any = {
    alternate_email_id: "",
    password: "",
    userid: "",
    institution_id: "",
    user_role: ""
  }

  otpVerificationInfo: any = {
    otp_code: "",
    mobile_no: "",
    alternate_email_id: "",
    password: "",
    userid: "",
    otp_validate_mode: 1
  }

  instituteCountryDetObj: any = {
    "id": "",
    "country_name": "",
    "country_code": "",
    "country_calling_code": "",
    "country_phone_number_length": ""
  };


  constructor(
    private login: LoginService,
    private route: Router,
    private msgService: MessageShowService,
    private auth: AuthenticatorService,
    private titleService: Title,
    private _tablePreferencesService: TablePreferencesService,
    private activatedRoute: ActivatedRoute
  ) {
    this.messages = msgService.getMessages();
    if (sessionStorage.getItem('userid') != null) {
      this.loginDataForm = {
        alternate_email_id: "",
        password: ""
      }
      this.createRoleBasedSidenav();
    }
    else {
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
    })
    this.baseUrl = this.auth.getBaseUrlStudent();
  }

  ngOnInit() {
    let url = window.location.href;
    if (url.indexOf("?") > -1) {
      let arr = url.split('?');
      if (url.length > 1 && arr[1] !== '') {
        this.activatedRoute.queryParams.subscribe(params => {
          this.loginDataForm.alternate_email_id = params['user'];
          this.loginDataForm.password = atob(params['pass']);
          this.loginViaServer();
        });
      }
    }
    this.checkWebUrlForGenerics();
  }

  ngOnDestroy() {
    this.isProcturVisible = true;
  }
  createTablePreferences() {
    console.log(sessionStorage.getItem('course_structure_flag'));
    if (sessionStorage.getItem('userid') != null && sessionStorage.getItem('course_structure_flag')) {
      if (!this._tablePreferencesService.getTablePreferences('procturTablePreference')) {
        this._tablePreferencesService.createdLocalStorageStructure({ userId: sessionStorage.getItem('userid'), role: sessionStorage.getItem('course_structure_flag') });
      }
    }
  }

  checkWebUrlForGenerics() {
    let url: string = window.location.href;
    let test = url.split("/")[2];
    if (test === "webtest.proctur.com" || test === "web.proctur.com" || test === "localhost:4200") {
      this.isProcturVisible = true;
      this.backgroundChange.nativeElement.className = "bg-img"
      this.dynamicImgSrc = "./assets/images/logoProctur.png";
      this.virtualStyle.nativeElement.className = "login-box";
      this.titleService.setTitle('Proctur - Your Pocket Classroom');
      sessionStorage.setItem('institute_title_web', 'Proctur - Your Pocket Classroom');
      sessionStorage.setItem('institute_logo_web', this.dynamicImgSrc);
      // this.checkForVirtualHost("webtest.proctur.com"); // for guest user
      // this.isProcturVisible = false;
      // this.backgroundChange.nativeElement.className = "bg-img-virtual"
      // this.virtualStyle.nativeElement.className = "login-virtual"
      // this.titleService.setTitle("Login");
      // sessionStorage.setItem('institute_title_web', 'Login');
    }
    else {
      this.checkForVirtualHost(test);
      this.isProcturVisible = false;
      this.backgroundChange.nativeElement.className = "bg-img-virtual"
      this.virtualStyle.nativeElement.className = "login-virtual"
      this.titleService.setTitle("Login");
      sessionStorage.setItem('institute_title_web', 'Login');
    }
  }

  checkForVirtualHost(str) {
    this.login.getLogoAndFavcon(str).subscribe(
      res => {
        if (res != null) {
          this.isGuestUser = true;
          sessionStorage.setItem('institution_id', res[0].instituteId); // this id is used for guest user registration do not change it
          if (res[0].logoPath != null && res[0].logoPath != "") {
            this.dynamicImgSrc = res[0].logoPath;
          }
          if (res[0].favIconPath != null && res[0].favIconPath != "") {
            sessionStorage.setItem('institute_logo_web', this.dynamicImgSrc);
            this.changeFavICon(res[0].favIconPath);
          }
          if (res[0].title != null && res[0].title != "") {
            this.titleService.setTitle(res[0].title + " Login");
            sessionStorage.setItem('institute_title_web', res[0].title + " Login");
          }
        }
      },
      err => {
        console.log(err);
      }
    )
  }

  changeFavICon(str) {
    let link = <HTMLLinkElement>document.getElementById('favIconLink');
    link.type = 'image/x-icon';
    link.rel = 'icon';
    link.href = str;
  }

  /*
    When user fill the login form and tries to login : ( START - 0)
      1. Check if email or password is not empty
      2. Send login Info to Server
  */
  loginViaServer() {
    if (this.loginDataForm.alternate_email_id.trim() == "" && this.loginDataForm.password.trim() == "") {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, this.messages.loginMsg.invalid.title, this.messages.loginMsg.invalid.body);

    }
    else if (this.loginDataForm.password.trim() == "") {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, this.messages.loginMsg.invalidPass.title, this.messages.loginMsg.invalidPass.body);
    }
    else {
      this.login.postLoginDetails(this.loginDataForm).subscribe(
        res => {
          console.log(res);
          this.checkForAuthOptions(res);
          console.log(res.institution_id);
          if(res.institution_id!=null){
            this.getCountryDetails(res.institution_id);
          }          
        },
        err => {
          console.log(err);
        }
      );
    }
  }

  //  created by: Nalini Walunj;
  //  description: Below function is written to get country code details of institution based on login details.
  getCountryDetails(institute_id) {

    this.login.getInstituteCountryDetails(institute_id).subscribe(
      (res: any) => {
        this.countryDetails = res;
        let country_info = JSON.stringify(res);
          // console.log(country_info);
          sessionStorage.setItem('country_data',country_info);
        // console.log(this.instituteCountryDetObj);
      },
      err => {
        console.log(err);
      }
    )
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
    this.msgService.showErrorMessage(this.msgService.toastTypes.error, this.messages.loginMsg.notRegister.title, this.messages.loginMsg.notRegister.body);
  }
  //End -2

  validInstituteCheck(res): boolean {
    /* Open For All Institute Currently */
    if (res.data.inst_branding_feature == "N" && res.user_type == 99) {
      return false;
    }
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
      this.msgService.showErrorMessage(this.msgService.toastTypes.success, "Success Alert", "There is no access for Open User login in web..Kindly access the same through APP");
      sessionStorage.clear();
      localStorage.clear();
      return
    }
    else {
      this.serverUserData = res;
      sessionStorage.setItem('institute_info', JSON.stringify(res.data));
      let institute_data = JSON.parse(sessionStorage.getItem('institute_info'));
      let Authorization = btoa(institute_data.userid + "|" + institute_data.userType + ":" + institute_data.password + ":" + institute_data.institution_id);
      this.auth.changeAuthenticationKey(Authorization);
      this.auth.changeInstituteId(institute_data.institution_id);
      sessionStorage.setItem('institute_id', institute_data.institution_id);
      sessionStorage.setItem('institution_id', institute_data.institution_id);
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
      sessionStorage.setItem('enable_vdoCipher_feature', institute_data.enable_vdoCipher_feature);
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
      sessionStorage.setItem('login_teacher_id', institute_data.teacherId);
      sessionStorage.setItem('manual_student_disp_id', institute_data.manual_student_disp_id);
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
      sessionStorage.setItem('userid', institute_data.userid);
      sessionStorage.setItem('name', institute_data.name);
      sessionStorage.setItem('about_us_text', institute_data.about_us_text);
      sessionStorage.setItem('mobile_no', institute_data.mobile_no);
      sessionStorage.setItem('inst_announcement', institute_data.inst_announcement);
      sessionStorage.setItem('logo_url', institute_data.logo_url);
      sessionStorage.setItem('permitted_roles', JSON.stringify(res.data.featureDivMapping));
      sessionStorage.setItem('is_exam_grad_feature', institute_data.is_exam_grad_feature);
      sessionStorage.setItem('enable_routing', institute_data.enable_routing);
      sessionStorage.setItem('enable_online_payment_feature', institute_data.enable_online_payment_feature);
      sessionStorage.setItem('open_enq_Visibility_feature', institute_data.open_enq_Visibility_feature);
      sessionStorage.setItem('institute_setup_type', institute_data.institute_setup_type);
      sessionStorage.setItem('enable_elearn_course_mapping_feature', institute_data.enable_elearn_course_mapping_feature);
      sessionStorage.setItem('enable_eLearn_feature', institute_data.enable_eLearn_feature);
      sessionStorage.setItem('website_url', institute_data.website_url);
      sessionStorage.setItem('proctur_live_expiry_date',institute_data.proctur_live_expiry_date);
      if (res.data.permissions == undefined || res.data.permissions == undefined || res.data.permissions == null) {
        sessionStorage.setItem('permissions', '');
        this.login.changePermissions('');
      }
      else {
        sessionStorage.setItem('permissions', JSON.stringify(res.data.permissions.split(',')));
        this.login.changePermissions(JSON.stringify(res.data.permissions.split(',')));
      }


      if (sessionStorage.getItem('userType') == '0' || sessionStorage.getItem('userType') == '3') {
        this.createTablePreferences();
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
      else if (sessionStorage.getItem('userType') == '99' && sessionStorage.getItem('testprepEnabled')
        && institute_data.courseType == "") {
        sessionStorage.setItem('student_id', "0");
        sessionStorage.setItem('institution_id', res.institution_id);
        sessionStorage.setItem('institution_name', res.data.institute_name);
        sessionStorage.setItem('userid', this.serverUserData.userid);
        sessionStorage.setItem('user_type', this.serverUserData.user_type);
        this.getGuestUserCourser(sessionStorage.getItem('institute_id'));
      }
      else if (sessionStorage.getItem('userType') == '99' && sessionStorage.getItem('testprepEnabled')
        && institute_data.courseType != "") {
        sessionStorage.setItem('student_id', "0");
        sessionStorage.setItem('userid', this.serverUserData.userid);
        sessionStorage.setItem('user_type', this.serverUserData.user_type);
        sessionStorage.setItem('institution_id', res.institution_id);
        sessionStorage.setItem('institution_name', res.data.institute_name);
        this.gotoStudentPortal();
      }
    }
  }

  getGuestUserCourser(institute_id) {
    this.login.getGuestUserCourses(institute_id).subscribe((res: any) => {
      console.log(res);
      if (res.length != 0) {
        this.isGuestUserCourse = true;
        this.courses = res;
      }
      else {
        this.gotoStudentPortal();
      }

    }, err => {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, "", err.error.message);
    });
  }

  updateCourseforGuestUser() {
    let obj = {
      userid: sessionStorage.getItem('userid'),
      courseType: this.selectedCourseNames.toString()
    };
    this.login.updateCourseforGuestUser(obj).subscribe(res => {
      console.log(res);
      sessionStorage.setItem("courseType", this.selectedCourseNames.toString());
      this.gotoStudentPortal();
    }, err => {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, "", err.error.message);
    });
  }

  gotoStudentPortal() {
    if (sessionStorage.getItem('testprepEnabled') != 'false') {
      window.location.href = this.baseUrl + "/sPortal/dashboard.html#/Dashboard";
    }
    else {
      window.location.href = this.baseUrl + "/sPortal/dashboard.html#/Documents";
    }

  }

  toggleCheckbox(course, data) {
    console.log(course, data);
    let index = this.selectedCourseNames.indexOf(data.course_type);
    if (index == -1) {
      this.selectedCourseNames.push(data.course_type);
    }
    else {
      this.selectedCourseNames.splice(index, 1);
    }
  }


  //End - 3
  //if login email is not verified ( Start - 4 )
  alternateLoginEmailNotVerified() {
    this.msgService.showErrorMessage(this.msgService.toastTypes.warning, this.messages.loginMsg.invalidEmail.title, this.messages.loginMsg.invalidEmail.body);
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
      if(el.institution_id!=null){
        this.getCountryDetails(el.institution_id);
      }
    });
  }

  //if user mobile no. is not verified ( Start - 6 )
  OTPVerification(res) {
    this.OTPRegenerateData = res;
    let phone_no = res.mobile_no;
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
      if(el.institution_id!=null){
        this.getCountryDetails(el.institution_id);
      }  
    });
  }
  //END - 7

  alternateLoginOTPVerification() {
    //console.log("##### trying to Validate OTP #####");
    //console.log(this.otpVerificationInfo);
    if (this.otpVerificationInfo.otp_code == null || this.otpVerificationInfo.otp_code == "") {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, this.messages.loginMsg.opt.notFound.title, this.messages.loginMsg.opt.notFound.body);
    } else {
      this.login.validateOTPCode(this.otpVerificationInfo).subscribe((el: any) => {
        //console.log(el);
        if (el.otp_status == 1) {
          //console.log("OTP Expired");
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, this.messages.loginMsg.opt.expired.title, this.messages.loginMsg.opt.expired.body);
        } else if (el.otp_status == 2) {
          //console.log("Incorrect OTP");
          this.msgService.showErrorMessage(this.msgService.toastTypes.warning, this.messages.loginMsg.opt.expired.title, this.messages.loginMsg.opt.expired.body);
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
      this.msgService.showErrorMessage(this.msgService.toastTypes.success, 'Success', 'OTP sent successfully');

      //console.log("OTP Regenerate Success");
      //console.log(el);
      this.OTPVerification(el);
    },
      err => {
        console.log(err);
      })
  }

  forgotPassword() {
    let forgotPasswordData = {
      alternate_email_id: ""
    }
    if (this.loginDataForm.alternate_email_id == "") {
      this.no_email_found = true;
    } else {
      if (confirm('New password will be sent to your registered number. Click Ok to continue.')) {
        forgotPasswordData.alternate_email_id = this.loginDataForm.alternate_email_id;
        this.login.forgotPassowrdServiceMethod(forgotPasswordData).subscribe(
          el => {
            this.msgService.showErrorMessage(this.msgService.toastTypes.success, this.messages.loginMsg.success.title, this.messages.loginMsg.success.body);
          },
          err => {
            this.msgService.showErrorMessage(this.msgService.toastTypes.error, "Error In Forget Password", err.error.message);
          })
      }
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
    let url = "https://proctur.com/contact_us/index.html";
    window.open(url);
  }

  createRoleBasedSidenav() {
    this.auth.currentInstituteId.subscribe(id => {
      /* If Id has been updated to the services then proceed */
      if (id != null && id != "null") {
        if (sessionStorage.getItem('userType') == '0' || sessionStorage.getItem('userType') == '3') {
          this.login.storeInstituteInfoToSession().subscribe(
            (res: any) => {
              sessionStorage.setItem('live_class_recorded_session_visibility', res.live_class_recorded_session_visibility);
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
        else if (sessionStorage.getItem('userType') == '1' && this.serverUserData) {
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
        else if (sessionStorage.getItem('userType') == '5' && this.serverUserData) {
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
