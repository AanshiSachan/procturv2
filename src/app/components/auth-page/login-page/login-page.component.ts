
import {timer as observableTimer,  Observable } from 'rxjs';

import {map, take} from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { instituteList } from '../../../model/institute-list-auth-popup';
import { LoginAuth } from '../../../model/login-auth';
import { InstituteLoginInfo } from '../../../model/multiInstituteLoginData';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { CommonServiceFactory } from '../../../services/common-service';
import { LoginService } from '../../../services/login-services/login.service';
import { MessageShowService } from '../../../services/message-show.service';
import { TablePreferencesService } from '../../../services/table-preference/table-preferences.service';
declare var $;
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
    institution_id: "",
    source: "WEB"
  }

  multiUserLoginInfo: any = {
    alternate_email_id: "",
    password: "",
    userid: "",
    institution_id: "",
    user_role: "",
    source: "WEB"
  }

  otpVerificationInfo: any = {
    otp_code: "",
    mobile_no: "",
    alternate_email_id: "",
    password: "",
    userid: "",
    otp_validate_mode: 1,
    source: "WEB"
  }
  // zoom
  zoom_enable: any = false;
  single_login_login_check = false;
  multiWindowLogin: boolean = false;
  isKominaInstitute: boolean = false;
  constructor(
    private login: LoginService,
    private route: Router,
    private msgService: MessageShowService,
    private auth: AuthenticatorService,
    private titleService: Title,
    private _tablePreferencesService: TablePreferencesService,
    private activatedRoute: ActivatedRoute,
    private _commService: CommonServiceFactory
  ) {
    this.messages = msgService.getMessages();
    if (sessionStorage.getItem('userid') != null) {
      this.loginDataForm = {
        alternate_email_id: "",
        password: "",
        source: "WEB"
      }
      this.createRoleBasedSidenav();
    }
    else {
      this.loginDataForm = {
        alternate_email_id: "",
        password: "",
        source: "WEB"
      }
    }
    //     sessionStorage.clear();
    //     this.auth.clearStoredData();
    //     this.auth.getAuthToken();
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
          this._commService.show_loader.next('student_login');
          this.auth.showLoader();
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
      if(test == 'kohimacollege.in') {
        this.isKominaInstitute = true;
      }
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
      this.auth.showLoader();
      this.login.postLoginDetails(this.loginDataForm).subscribe(
        res => {
          console.log(res);
          this.auth.hideLoader();
          sessionStorage.setItem('login-response',JSON.stringify(res));
          this.single_login_login_check = res.single_device_login;
          this.checkForAuthOptions(res);
        },
        err => {
          this.auth.hideLoader();
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, "", err.error.message);
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
        for (let i = 0; i < this.countryDetails.length; i++) {
          let row: any = this.countryDetails[i];
          row.symbol = this.getCurrencyDetails(900, row.currency_code, row.country_code);
          if (row.is_default == 'Y') {
            this._commService.setDefaultCurrencySymbol(row.symbol);
          }
        }
        sessionStorage.setItem('country_data', JSON.stringify(this.countryDetails));
      },
      err => {
        console.log(err);
      }
    )
  }

  getCurrencyDetails(value, currency, lang) {
    if (value && currency && lang) {
      let formatted = value.toLocaleString(lang, {
        maximumFractionDigits: 4,
        style: 'currency',
        currency: currency
      });

      formatted = formatted.replace(/[,.]/g, '');
      return formatted.replace(/[0-9]/g, '');
    }
    else {
      return lang;
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
        this.alternateLoginFailure(res.login_error_message);
        break;
      case 3:
        this.setAuthToken(res.data, res.device_id);
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
      case 10:
        this.multiDeviceLogin(res);
        break;
      case 11:
        this.registeredDeviceNotFount(res);
        break;
    }
  }

  registeredDeviceNotFount(obj) {
    this.msgService.showErrorMessage('error','','This is not your registered device for login kindly use a registered device. For any query please contact your administrator.');
  }

  multiDeviceLogin(res){
    this.auth.hideLoader();
    this.multiWindowLogin = true;
    $('#multiLogin').modal('show');
  }

  logOutFromOtherDeveices(){

    this.auth.showLoader();
    let obj = {}
    if(this.multiInstituteLoginInfo.userid != "" && this.multiInstituteLoginInfo.institution_id != ""){
      obj = {
        alternate_email_id: this.multiInstituteLoginInfo.alternate_email_id,
        password: this.multiInstituteLoginInfo.password,
        userid: this.multiInstituteLoginInfo.userid,
        institution_id: this.multiInstituteLoginInfo.institution_id,
        source: "WEB",
        logout_from_all_devices: true
      }
    }
    else{
      this.loginDataForm.logout_from_all_devices = true;
      obj = this.loginDataForm;
    }
    this.login.postLoginDetails(obj).subscribe(
      res => {
        console.log(res);
        this.auth.hideLoader();
        sessionStorage.setItem('login-response',JSON.stringify(res));
        sessionStorage.setItem('institute_info', JSON.stringify(res.data));

        let institute_data = JSON.parse(sessionStorage.getItem('institute_info'));
        sessionStorage.setItem('userid', institute_data.userid);
        sessionStorage.setItem('userType', institute_data.userType);
        sessionStorage.setItem('password', institute_data.password);
        sessionStorage.setItem('institute_id', institute_data.institution_id);
        sessionStorage.setItem('deviceId', res.device_id);
        sessionStorage.setItem('source', 'WEB');
        this.single_login_login_check = res.single_device_login;
        if(this.single_login_login_check){
          this.auth.getAuthToken(true);
        }
        else{
          this.auth.getAuthToken(false);
        }
        this.alternateLoginSuccess(res);
      },
      err => {
        this.auth.showLoader();
        console.log(err);
      }
    );
  }

  setAuthToken(institute_data, device_id) {

    sessionStorage.setItem('userid', institute_data.userid);
    sessionStorage.setItem('userType', institute_data.userType);
    sessionStorage.setItem('password', institute_data.password);
    sessionStorage.setItem('institute_id', institute_data.institution_id);
    if(institute_data.userType == '1' || institute_data.userType == '99'){
      sessionStorage.setItem('deviceId', device_id);
      sessionStorage.setItem('source', 'WEB');
      if(this.single_login_login_check){
        this.auth.getAuthToken(true);
      }
      else{
        this.auth.getAuthToken(false);
      }
    }
    else{
      this.auth.getAuthToken(false);
    }

  }

  //End - 1

  //if login is fails ( Start - 2)
  alternateLoginFailure(obj) {
    this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', obj);
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
      this.msgService.showErrorMessage(this.msgService.toastTypes.success, "", "There is no access for Open User login in web..Kindly access the same through APP");
      sessionStorage.clear();
      localStorage.clear();
      return
    }
    else {
      if (res.institution_id != null) {
        if(sessionStorage.getItem('userType') != '1' && sessionStorage.getItem('userType') != '99'){
          this.getCountryDetails(res.institution_id);
        }
      }
      this.serverUserData = res;
      sessionStorage.setItem('institute_info', JSON.stringify(res.data));
      let institute_data = JSON.parse(sessionStorage.getItem('institute_info'));
      let type = sessionStorage.getItem('source');
      if(institute_data.userType != '1' && institute_data.userType != '99'){
        let Authorization = btoa(institute_data.userid + "|" + institute_data.userType + ":" + institute_data.password + ":" + institute_data.institution_id);
        this.auth.changeAuthenticationKey(Authorization);
      }
      else{
        if(this.single_login_login_check){
          sessionStorage.setItem('single_device_login', 'true');
          let deviceId = sessionStorage.getItem('deviceId');
          let source = sessionStorage.getItem('source');
          let Authorization = btoa(institute_data.userid + "|" + institute_data.userType + ":" + institute_data.password + ":" + institute_data.institution_id + ":" + res.device_id + ":WEB");
          this.auth.changeAuthenticationKey(Authorization);
        }
        else{
          sessionStorage.setItem('single_device_login', 'false');
          let Authorization = btoa(institute_data.userid + "|" + institute_data.userType + ":" + institute_data.password + ":" + institute_data.institution_id);
          this.auth.changeAuthenticationKey(Authorization);
        }
      }
      // this.auth.changeInstituteId(institute_data.institution_id);
      this.zoom_enable = JSON.stringify(institute_data.is_zoom_integration_enable)
      this.auth.course_flag.next(institute_data.course_structure_flag);
      this.auth.institute_type.next(institute_data.institute_type);
      this.auth.instituteType_name.next(institute_data.institute_type);
      this.auth.changeMainBranchValue(institute_data.is_main_branch);
      this.login.changeUserType(institute_data.userType);
      this.auth.makeInstituteType(institute_data.institute_type, institute_data.course_structure_flag);
      sessionStorage.setItem('user_permission', institute_data.user_permission);
      sessionStorage.setItem('institute_id', institute_data.institution_id);
      sessionStorage.setItem('institution_id', institute_data.institution_id); //y
      sessionStorage.setItem('about_us_image', institute_data.about_us_image);
      sessionStorage.setItem('about_us_text', institute_data.about_us_text);
      sessionStorage.setItem('accountId', institute_data.accountId);
      sessionStorage.setItem('alternate_email_id', institute_data.alternate_email_id);
      sessionStorage.setItem('biometric_attendance_feature', institute_data.biometric_attendance_feature);
      sessionStorage.setItem('courseType', institute_data.courseType);
      sessionStorage.setItem('course_structure_flag', institute_data.course_structure_flag);
      sessionStorage.setItem('enable_fee_payment_mandatory_student_creation', institute_data.enable_fee_payment_mandatory_student_creation);
      sessionStorage.setItem('enable_fee_templates', institute_data.enable_fee_templates);
      sessionStorage.setItem('enable_tax_applicable_fee_installments', institute_data.enable_tax_applicable_fee_installments);
      sessionStorage.setItem('enable_vdoCipher_feature', institute_data.enable_vdoCipher_feature);
      sessionStorage.setItem('enable_vimeo_feature', institute_data.enable_vimeo_feature);
      sessionStorage.setItem('exam_grading_system', institute_data.exam_grading_system);
      sessionStorage.setItem('fb_page_url', institute_data.fb_page_url);
      sessionStorage.setItem('fee_functionality', institute_data.fee_functionality);
      sessionStorage.setItem('fetaures_map', institute_data.fetaures_map);
      sessionStorage.setItem('inst_email', institute_data.inst_email);
      sessionStorage.setItem('inst_phone', institute_data.inst_phone);
      sessionStorage.setItem('inst_reg_code', institute_data.inst_reg_code);
      sessionStorage.setItem('inst_set_up', institute_data.inst_set_up);
      sessionStorage.setItem('institute_type', institute_data.institute_type);
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
      sessionStorage.setItem('enable_fee_template_country_wise', institute_data.enable_fee_template_country_wise);
      sessionStorage.setItem('tax_type_without_percentage', institute_data.tax_type);
      sessionStorage.setItem('tax_type_with_percentage', institute_data.tax_type + "(%)");
      sessionStorage.setItem('is_zoom_enable', this.zoom_enable)
      sessionStorage.setItem('enable_ip_lock_feature', institute_data.enable_ip_lock_feature);
      sessionStorage.setItem("student_study_material_visibility", institute_data.student_study_material_visibility);
      sessionStorage.setItem('youtube_url', institute_data.youtube_url);
      sessionStorage.setItem('facebook_url', institute_data.facebook_url);
      sessionStorage.setItem('whatsapp_url', institute_data.whatsapp_url);
      sessionStorage.setItem('linkedin_url', institute_data.linkedin_url);
      sessionStorage.setItem('instagram_url', institute_data.instagram_url);
      sessionStorage.setItem('website_url', institute_data.website_url);
      sessionStorage.setItem('privacy_alert', 'true');
      sessionStorage.setItem('liveClassExpiryPop', "true");
      sessionStorage.setItem('feedback_url', institute_data.feedback_url);
      sessionStorage.setItem('help_url', institute_data.help_url);
      sessionStorage.setItem('terms_and_condition_url', institute_data.terms_and_condition_url);
      sessionStorage.setItem('privacy_policy_url', institute_data.privacy_policy_url);
      sessionStorage.setItem('deviceId', this.serverUserData.device_id);
      sessionStorage.setItem('distinct_device_login', institute_data.distinct_device_login);
      sessionStorage.setItem('single_device', institute_data.single_device_login);
      sessionStorage.setItem('enable_library_feature', institute_data.enable_library_feature);
      sessionStorage.setItem('enable_online_assignment_feature', institute_data.enable_online_assignment_feature);

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
      if (el.institution_id != null && !this.multiWindowLogin) {
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
    this.countDown = observableTimer(0, 1000).pipe(
      take(this.counter),
      map(() => --this.counter),);
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
        this.multiUserListObj.userType = "Faculty";
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
      if (el.institution_id != null) {
        this.getCountryDetails(el.institution_id);
      }
    });
  }
  //END - 7

  alternateLoginOTPVerification() {
    //console.log("##### trying to Validate OTP #####");
    //console.log(this.otpVerificationInfo);
    if (this.otpVerificationInfo.otp_code.trim() == null || this.otpVerificationInfo.otp_code.trim() == "") {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, this.messages.loginMsg.opt.notFound.title, this.messages.loginMsg.opt.notFound.body);
    } else {
      this.login.validateOTPCode(this.otpVerificationInfo).subscribe((el: any) => {
        //console.log(el);
        if (el.otp_status == 1) {
          //console.log("OTP Expired");
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, this.messages.loginMsg.opt.expired.title, this.messages.loginMsg.opt.expired.body);
        } else if (el.otp_status == 2) {
          //console.log("Incorrect OTP");
          this.msgService.showErrorMessage(this.msgService.toastTypes.warning, this.messages.loginMsg.opt.inCorrect.title, this.messages.loginMsg.opt.inCorrect.body);
        } else if (el.login_option == 3) {
          this.single_login_login_check = el.single_device_login;
          sessionStorage.setItem('deviceId', el.device_id);
          sessionStorage.setItem('source', 'WEB');
          //console.log("OTP Verified Success");
          this.alternateLoginSuccess(el);
          this.closeOTPValidationModal();
        }
      })
    }
  }

  alternateLoginOTPRegenerate() {
    //console.log("##### in Regenerate Method ######");
    // console.log(JSON.stringify(this.OTPRegenerateData));
    this.login.regenerateOTP(this.OTPRegenerateData).subscribe(el => {
      this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', 'OTP sent successfully');

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
            this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', this.messages.loginMsg.success.body);
          },
          err => {
            this.msgService.showErrorMessage(this.msgService.toastTypes.error, "", err.error.message);
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
    let url = "https://proctur.com/contact-us";
    window.open(url);
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
