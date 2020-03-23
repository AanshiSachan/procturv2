import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../../../../app.component';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { UserService } from '../../../../services/user-management/user.service';
import { CommonServiceFactory } from './../../../../services/common-service';

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.scss']
})
export class AddEditUserComponent implements OnInit {

  userId: any = "-1";
  rolesList: any = [];
  roleDetails: any = {
    name: '',
    address: '',
    username: '',
    country_id: '',
    alternate_email_id: '',
    role_id: '-1',
    attendance_device_id: '',
    userType: '',
    is_employee_to_be_create: 'true',
    is_office_only_access: false
  }
  biometricEnable: any = '0';
  instituteCountryDetObj: any = {};
  countryDetails: any = [];
  maxlength: number = null;
  country_id:number = null;
  enable_ip_lock_feature: any = false;

  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private apiService: UserService,
    private toastCtrl: AppComponent,
    private commonService: CommonServiceFactory,
    private auth:AuthenticatorService,
  ) { }

  ngOnInit() {
    this.roleDetails = {
      name: '',
      address: '',
      username: '',
      country_id: '',
      alternate_email_id: '',
      role_id: '-1',
      attendance_device_id: '',
      userType: '',
      is_employee_to_be_create: 'true'
    };
    this.activatedRoute.params.subscribe(
      (res: any) => {
        if (res.hasOwnProperty('id')) {
          this.userId = res.id;
          this.fetchUserDetails(res.id);
        } else {
          this.userId = "-1";
        }
      }
    )
    this.getRolesList();
    this.biometricEnable = sessionStorage.getItem('biometric_attendance_feature');
    this.enable_ip_lock_feature = sessionStorage.getItem('enable_ip_lock_feature');
    this.fetchDataForCountryDetails();

  }

  // created by: Nalini Walunj
  // Below three functions are written to fetch country details from the session stored at the time of login of institute
  fetchDataForCountryDetails() {
    let encryptedData = sessionStorage.getItem('country_data');
    let data = JSON.parse(encryptedData);
    if (data.length > 0) {
      this.countryDetails = data;
      this.instituteCountryDetObj = this.countryDetails[0];
      this.roleDetails.country_id = this.countryDetails[0].id;
      this.maxlength = this.countryDetails[0].country_phone_number_length;
      this.country_id = this.countryDetails[0].id;
    }
  }


  onChangeObj(event) {
    console.log(event);
    this.countryDetails.forEach(element => {
      if (element.id == event) {
        this.instituteCountryDetObj = element;
        // this.phonenumberCheck(this.instituteCountryDetObj.country_phone_number_length);
        this.maxlength = this.instituteCountryDetObj.country_phone_number_length;
        this.country_id = element.id;
      }
      this.roleDetails.country_id = this.instituteCountryDetObj.id;
    }
    );
  }
  getRolesList() {
    this.apiService.getRoles().subscribe(
      res => {
        this.rolesList = res;
      },
      err => {
        //console.log(err);
      }
    )
  }

  fetchUserDetails(id) {
    this.auth.showLoader();
    this.apiService.fetchUserDetails(id).subscribe(
      res => {
        this.auth.hideLoader();
        this.roleDetails = res;
        this.countryDetails.forEach(element => {
          if (element.id == this.roleDetails.country_id) {
            this.instituteCountryDetObj = element;
            // this.phonenumberCheck(this.instituteCountryDetObj.country_phone_number_length);
            this.maxlength = this.instituteCountryDetObj.country_phone_number_length;
            this.country_id = this.instituteCountryDetObj.id;
          }
        }
        );
        if (this.roleDetails.is_active == 'Y') {
          this.roleDetails.is_active = true;
        } else {
          this.roleDetails.is_active = false;
        }

        if(this.roleDetails.is_office_only_access == 'Y') {
          this.roleDetails.is_office_only_access = true;
        } else {
          this.roleDetails.is_office_only_access = false;
        }
      },
      err => {
        this.auth.hideLoader();
        console.log(err);
      }
    )
  }

  saveUserDetails() {
    let validate = this.validateUserDetails(this.roleDetails);
    if (validate == false) {
      return;
    }
    if (this.roleDetails.is_employee_to_be_create == true) {
      this.roleDetails.is_employee_to_be_create = 'Y';
    } else {
      this.roleDetails.is_employee_to_be_create = 'N';
    }
    this.roleDetails.is_office_only_access = this.roleDetails.is_office_only_access ? 'Y' : 'N';
    let obj: any = {
      address: this.roleDetails.address,
      attendance_device_id: this.roleDetails.attendance_device_id,
      is_active: this.roleDetails.is_active,
      name: this.roleDetails.name,
      phone: this.roleDetails.username,
      country_id: this.roleDetails.country_id,
      role_id: this.roleDetails.role_id,
      username: this.roleDetails.username,
      alternate_email_id: this.roleDetails.alternate_email_id,
      is_office_only_access: this.roleDetails.is_office_only_access
    }
    console.log(obj);
    if (!this.auth.isRippleLoad.getValue()) {
      this.auth.showLoader();
      this.apiService.createUser(obj).subscribe(
        res => {
          this.auth.hideLoader();
          this.messageNotifier('success', '', 'User Added Successfully');
          this.route.navigateByUrl('/view/manage/user');
        },
        err => {
          this.auth.hideLoader();
          console.log(err);
          this.messageNotifier('error', '', err.error.message);
        }
      )
    }

  }

  updateUserDetails() {
    let validate = this.validateUserDetails(this.roleDetails);
    if (validate == false) {
      return;
    }
    if (this.roleDetails.is_active == true) {
      this.roleDetails.is_active = 'Y';
    } else {
      this.roleDetails.is_active = 'N';
    }
    this.roleDetails.is_office_only_access = this.roleDetails.is_office_only_access ? 'Y' : 'N';
    let obj: any = {
      address: this.roleDetails.address,
      attendance_device_id: this.roleDetails.attendance_device_id,
      is_active: this.roleDetails.is_active,
      name: this.roleDetails.name,
      phone: this.roleDetails.username,
      country_id: this.roleDetails.country_id,
      role_id: this.roleDetails.role_id,
      alternate_email_id: this.roleDetails.alternate_email_id,
      is_office_only_access: this.roleDetails.is_office_only_access
    }
    console.log(obj);
    if (!this.auth.isRippleLoad.getValue()) {
      this.auth.showLoader();
      this.apiService.updateUserDetails(obj, this.userId).subscribe(
        res => {
          this.auth.hideLoader();
          this.messageNotifier('success', '', 'Details updated successfully');
          this.route.navigateByUrl('/view/manage/user');
        },
        err => {
          this.auth.hideLoader();
          console.log(err);
          this.messageNotifier('error', '', err.error.message);
        }
      )
    }
  }

  validateUserDetails(obj) {
    let check:any = false;
    if (obj.name.trim() == "") {
      this.messageNotifier('error', '', 'Please enter name');
      return false;
    }
    console.log(this.maxlength);
    check = this.commonService.phonenumberCheck(obj.username, this.maxlength, this.country_id);
    if (check == false) {
      this.messageNotifier('error', '', 'Please check the number you have provided');
      return false;
    }
    if(check == 'noNumber'){
      this.messageNotifier('error', '', 'Please enter valid contact no.');
      return false;
    }
    if (obj.alternate_email_id.trim() != "") {
      check = this.ValidateEmail(obj.alternate_email_id);
      if (check == false) {
        this.messageNotifier('error', '', 'Please check the email you have provided');
        return false;
      }
    }
    if (this.userId == "-1") {
      if (obj.role_id == '-1') {
        this.messageNotifier('error', '', 'Please assign role to user');
        return false;
      }
    }
    return true;
  }

  // phonenumberCheck(inputtxt, maxlength) {
  //   let phoneno = /^\d{10}$/;
  //   // let phoneno = /^\d+$/+(maxlength);
  //   if ((inputtxt.match(phoneno))) {
  //     return true;
  //   }
  //   else {
  //     return false;
  //   }
  // }
  phonenumberCheck(inputtxt, maxlength) {
    console.log(maxlength);
    console.log(inputtxt);
    if (inputtxt.length == maxlength) {
      return true;
    }
    else {
      return false;
    }
  }

  ValidateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{1,9})+$/.test(mail)) {
      return true;
    }
    return false;
  }

  messageNotifier(type, title, msg) {
    let data = {
      type: type,
      title: title,
      body: msg
    }
    this.toastCtrl.popToast(data);
  }

}
