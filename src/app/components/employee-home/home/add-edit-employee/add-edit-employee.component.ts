import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../../../services/employee-service/employee.service';
import * as moment from 'moment';
import { AppComponent } from '../../../../app.component';

@Component({
  selector: 'app-add-edit-employee',
  templateUrl: './add-edit-employee.component.html',
  styleUrls: ['./add-edit-employee.component.scss']
})
export class AddEditEmployeeComponent implements OnInit {

  employeeId: any = '';
  employeeDetails: any = {
    address: '',
    attendance_device_id: '',
    designation: '1',
    email_pri: '',
    email_sec: '',
    emp_name: '',
    id_fileType: '',
    joining_date: moment().format('YYYY-MM-DD'),
    leaving_date: '',
    phone_pro: '',
    phone_sec: '',
    photo_id_card: '',
    profile_pic: '',
    user_id: '-1'
  };
  containerWidth: any = "200px";
  @ViewChild('idCardEmployee') idCardEmployee: ElementRef;
  designationList: any = [];
  userListData: any = [];
  @ViewChild('profileDiv') profileDiv: ElementRef;

  constructor(
    private auth: AuthenticatorService,
    private route: Router,
    private activateRoute: ActivatedRoute,
    private apiService: EmployeeService,
    private toastCtrl: AppComponent
  ) { }

  ngOnInit() {
    this.activateRoute.params.subscribe(
      (res: any) => {
        if (res.hasOwnProperty('id')) {
          this.employeeId = res.id;
          this.getEmployeeDetails(res.id);
        } else {
          this.employeeId = '-1';
        }
      }
    )
    this.getDesignationList();
    this.getUserList();
  }

  getEmployeeDetails(res) {
    this.apiService.getEmployeeDetails(res).subscribe(
      res => {
        this.employeeDetails = res;
        this.onDesignationChanges(this.employeeDetails.designation)
      },
      err => {
        console.log(err);
      }
    )
  }

  getDesignationList() {
    this.apiService.designationList().subscribe(
      res => {
        this.designationList = res;
      },
      err => {
        console.log(err);
      }
    )
  }

  getUserList() {
    let obj: any = {
      designation: this.employeeDetails.designation
    };
    this.apiService.userList(obj).subscribe(
      (res: any) => {
        this.userListData = res;
      },
      err => {
        this.messageNotifier('error', 'Error', err.error.message);
      }
    )
  }

  onDesignationChanges(event) {
    if (this.employeeDetails.designation != 3) {
      this.profileDiv.nativeElement.classList.remove('hide');
      this.getUserList();
    } else {
      this.profileDiv.nativeElement.classList.add('hide');
    }
  }

  makeJsonToSend(data) {
    if (data.emp_name.trim() == "" || data.emp_name.trim() == null) {
      this.messageNotifier('error', 'Error', 'Please provide Employee Name');
      return false;
    }
    if (data.phone_pro.trim() == "" || data.phone_pro.trim() == null) {
      this.messageNotifier('error', 'Error', 'Please provide contact number');
      return false;
    } else {
      if (!this.validateNumber(data.phone_pro)) {
        this.messageNotifier('error', 'Error', 'Please provide correct contact number');
        return false;
      }
    }
    if (data.phone_sec.trim() != "" && data.phone_sec.trim() == null) {
      if (!this.validateNumber(data.phone_sec)) {
        this.messageNotifier('error', 'Error', 'Please provide correct secondary contact number');
        return false;
      }
    }
    if (data.email_pri.trim() != "" && data.email_pri.trim() == null) {
      if (!this.validateCaseSensitiveEmail(data.email_pri)) {
        this.messageNotifier('error', 'Error', 'Please provide correct email');
        return false;
      }
    }
    if (data.email_sec.trim() != "" && data.email_sec.trim() == null) {
      if (!this.validateCaseSensitiveEmail(data.email_sec)) {
        this.messageNotifier('error', 'Error', 'Please provide correct secondary email');
        return false;
      }
    }
    if (data.address.trim() == "" || data.address.trim() == null) {
      this.messageNotifier('error', 'Error', 'Please provide address');
      return false;
    }
    if (data.designation == '-1') {
      this.messageNotifier('error', 'Error', 'Please provide designation');
      return false;
    } else if (data.designation == '1' || data.designation == '2') {
      if (data.user_id == "" || data.user_id == '-1') {
        this.messageNotifier('error', 'Error', 'Please provide User Profile');
        return false
      }
    }
    if (data.joining_date == "" || data.joining_date == null) {
      this.messageNotifier('error', 'Error', 'Please provide joining date');
      return false;
    }
    if (data.leaving_date != "" && data.leaving_date == null) {
      data.leaving_date = moment(data.leaving_date).format('YYYY-MM-DD');
    }
    let obj: any = {
      address: data.address,
      attendance_device_id: data.attendance_device_id == null ? '' : data.attendance_device_id,
      designation: data.designation,
      email_pri: data.email_pri,
      email_sec: data.email_sec,
      emp_name: data.emp_name,
      id_fileType: data.id_fileType,
      joining_date: moment(data.joining_date).format('YYYY-MM-DD'),
      leaving_date: data.leaving_date,
      phone_pro: data.phone_pro,
      phone_sec: data.phone_sec,
      photo_id_card: data.photo_id_card,
      profile_pic: data.profile_pic == "" ? null : data.profile_pic,
      user_id: data.user_id
    };
    return obj;
  }

  addNewEmployee() {
    let data = this.makeJsonToSend(this.employeeDetails);
    if (!data) {
      return;
    }
    this.apiService.addNewEmployee(data).subscribe(
      res => {
        this.messageNotifier('success', 'Added', 'Employee Added Successfully');
        this.route.navigateByUrl('employee/home');
      },
      err => {
        console.log(err);
        this.messageNotifier('error', 'Error', err.error.message);
      }
    )
  }

  upadateEmployeeDet() {
    let data = this.makeJsonToSend(this.employeeDetails);
    if (!data) {
      return;
    }
    data.emp_id = this.employeeId;
    delete data.user_id;
    this.apiService.updateEmployee(data).subscribe(
      res => {
        this.messageNotifier('success', 'Successfully Updated', 'Employee details Update successfully');
        this.route.navigateByUrl('employee/home');
      },
      err => {
        console.log(err);
        this.messageNotifier('error', 'Error', err.error.message);
      }
    )
  }

  setImage(e) {
    this.employeeDetails.profile_pic = e;
  }

  uploadIdCard() {
    this.idCardEmployee.nativeElement.click();
  }

  onChangeIdCardUpload() {
    let fileBrowser = this.idCardEmployee.nativeElement;
    this.idCardEmployee.nativeElement.innerHTML = fileBrowser.files[0].name;
    if (fileBrowser.files && fileBrowser.files[0]) {
      let reader = new FileReader();
      reader.readAsDataURL(fileBrowser.files[0]);
      reader.onload = () => {
        this.employeeDetails.photo_id_card = reader.result.split(',')[1];
      }
    }
  }

  messageNotifier(type, title, msg) {
    let data = {
      type: type,
      title: title,
      body: msg
    }
    this.toastCtrl.popToast(data);
  }

  validateCaseSensitiveEmail(email) {
    if (email != '' && email != null) {
      var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      if (reg.test(email)) {
        return true;
      }
      else {
        return false;
      }
    } else {
      return true;
    }
  }

  validateNumber(inputtxt) {
    let phoneno = /^\d{10}$/;
    if ((inputtxt.match(phoneno))) {
      return true;
    }
    else {
      return false;
    }
  }

}
