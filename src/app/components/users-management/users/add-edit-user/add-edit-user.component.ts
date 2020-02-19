import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../../services/user-management/user.service';
import { AppComponent } from '../../../../app.component';
import { CommonServiceFactory } from './../../../../services/common-service';

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.scss']
})
export class AddEditUserComponent implements OnInit {

  isRippleLoad: boolean = false;
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
    is_employee_to_be_create: 'true'
  }
  biometricEnable: any = '0';
  instituteCountryDetObj: any = {};
  countryDetails: any = [];
  maxlength: number = null;
  country_id:number = null;

  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private apiService: UserService,
    private toastCtrl: AppComponent,
    private commonService: CommonServiceFactory
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
    this.isRippleLoad = true;
    this.apiService.fetchUserDetails(id).subscribe(
      res => {
        this.isRippleLoad = false;
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
      },
      err => {
        this.isRippleLoad = false;
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
    let obj: any = {
      address: this.roleDetails.address,
      attendance_device_id: this.roleDetails.attendance_device_id,
      is_active: this.roleDetails.is_active,
      name: this.roleDetails.name,
      phone: this.roleDetails.username,
      country_id: this.roleDetails.country_id,
      role_id: this.roleDetails.role_id,
      username: this.roleDetails.username,
      alternate_email_id: this.roleDetails.alternate_email_id    }
    console.log(obj);
    if (!this.isRippleLoad) {
      this.isRippleLoad = true;
      this.apiService.createUser(obj).subscribe(
        res => {
          this.isRippleLoad = false;
          this.messageNotifier('success', '', 'User Added Successfully');
          this.route.navigateByUrl('/view/manage/user');
        },
        err => {
          this.isRippleLoad = false;
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
    let obj: any = {
      address: this.roleDetails.address,
      attendance_device_id: this.roleDetails.attendance_device_id,
      is_active: this.roleDetails.is_active,
      name: this.roleDetails.name,
      phone: this.roleDetails.username,
      country_id: this.roleDetails.country_id,
      role_id: this.roleDetails.role_id,
      alternate_email_id: this.roleDetails.alternate_email_id
    }
    console.log(obj);
    if (!this.isRippleLoad) {
      this.isRippleLoad = true;
      this.apiService.updateUserDetails(obj, this.userId).subscribe(
        res => {
          this.isRippleLoad = false;
          this.messageNotifier('success', '', 'Details Updated Successfully');
          this.route.navigateByUrl('/view/manage/user');
        },
        err => {
          this.isRippleLoad = false;
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
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
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
