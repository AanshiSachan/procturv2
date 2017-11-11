import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/Rx';
import { AppComponent } from '../../../app.component';
import { LoginService } from '../../../services/login-services/login.service';
import { LoginAuth } from '../../../model/login-auth';
import { instituteList } from '../../../model/institute-list-auth-popup';
import { InstituteLoginInfo } from '../../../model/multiInstituteLoginData';
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

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

  constructor(private login: LoginService, private route: Router, private actroute: ActivatedRoute,
    private toastCtrl: AppComponent) {
  }

  ngOnInit() {
    /* hide header and sidebar from the view onInit to give the user the full screen view of the web app  */
    this.fullscreenLogin();

    this.loginDataForm = {
      alternate_email_id: "",
      password: ""
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
    } else if (this.loginDataForm.password == "") {
      let data = {
        type: "warning",
        title: "Invalid Password",
        body: "Please enter Password"
      }
      this.toastCtrl.popToast(data);
    } else {

      this.login.postLoginDetails(this.loginDataForm).subscribe(el => {
        console.log(el);
        this.checkForAuthOptions(el);
      });
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

  //if login is successfull ( Start - 3)
  alternateLoginSuccess(res) {
    sessionStorage.setItem('institute_info', JSON.stringify(res.data));
    let institute_data = JSON.parse(sessionStorage.getItem('institute_info'));
    let Authorization = btoa(institute_data.userid + "|" + institute_data.userType + ":" + institute_data.password + ":" + institute_data.institution_id);
    sessionStorage.setItem('Authorization', Authorization);
    sessionStorage.setItem('institute_id', institute_data.institution_id);
    this.route.navigate(['/enquiry']);
    //
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
    console.log("##### trying to Validate OTP #####");
    //console.log(this.otpVerificationInfo);
    if (this.otpVerificationInfo.otp_code == null || this.otpVerificationInfo.otp_code == "") {
      let data = {
        type: "error",
        title: "Not Found",
        body: "Kindly, Enter the OTP."
      }
      this.toastCtrl.popToast(data);
    } else {
      this.login.validateOTPCode(this.otpVerificationInfo).subscribe(el => {
        //console.log(el);
        if (el.otp_status == 1) {
          console.log("OTP Expired");
          let data = {
            type: "error",
            title: "OTP Expired",
            body: "Kindly, Regenerate the OTP."
          }
          this.toastCtrl.popToast(data);
        } else if (el.otp_status == 2) {
          console.log("Incorrect OTP");
          let data = {
            type: "warning",
            title: "OTP Incorrect",
            body: "Kindly, Enter the right OTP."
          }
          this.toastCtrl.popToast(data);
        } else if (el.login_option == 3) {
          console.log("OTP Verified Success");
          this.alternateLoginSuccess(el);
          this.closeOTPValidationModal();
        }
      })
    }
  }
  alternateLoginOTPRegenerate() {
    console.log("##### in Regenerate Method ######");
    //console.log(this.OTPRegenerateData);
    this.login.regenerateOTP(this.OTPRegenerateData).subscribe(el => {
      console.log("OTP Regenerate Success");
      //console.log(el);
      this.OTPVerification(el);
    })
  }

  forgotPassword() {
    let forgotPasswordData = {
      alternate_email_id: ""
    }
    if (this.loginDataForm.alternate_email_id == "") {
      console.log("no email id");
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
    let url = "http://proctur.com/get-advice/";
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

}
