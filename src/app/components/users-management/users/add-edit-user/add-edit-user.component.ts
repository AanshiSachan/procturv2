import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../../services/user-management/user.service';
import { AppComponent } from '../../../../app.component';

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
    alternate_email_id: '',
    role_id: '-1',
    attendance_device_id: '',
    userType: '',
    is_employee_to_be_create: 'N'
  }

  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private apiService: UserService,
    private toastCtrl: AppComponent
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(
      (res: any) => {
        if (res.hasOwnProperty('id')) {
          this.userId = res.id;
        } else {
          this.userId = "-1";
        }
      }
    )
    this.getRolesList();
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

  saveUserDetails() {
    let validate = this.validateUserDetails(this.roleDetails);
    if (validate == false) {
      return;
    }
    this.apiService.createUser(this.roleDetails).subscribe(
      res => {
        this.messageNotifier('success', 'Added Successfully', 'User Added Successfully');
        this.route.navigateByUrl('/manage/user');
      },
      err => {
        console.log(err);
        this.messageNotifier('error', 'Error', err.error.message);
      }
    )
  }

  validateUserDetails(obj) {
    let check = false;
    if (obj.name.trim() == "") {
      this.messageNotifier('error', 'Error', 'Please provide name');
      return false;
    }
    check = this.phonenumberCheck(obj.username);
    if (check == false) {
      this.messageNotifier('error', 'Error', 'Please check the number you have provided');
      return false;
    }
    if (obj.alternate_email_id.trim() != "") {
      check = this.ValidateEmail(obj.alternate_email_id);
      if (check == false) {
        this.messageNotifier('error', 'Error', 'Please check the email you have provided');
        return false;
      }
    }
    if (obj.role_id == '-1') {
      this.messageNotifier('error', 'Error', 'Please assign role to user');
      return false;
    }
    return true;
  }

  phonenumberCheck(inputtxt) {
    let phoneno = /^\d{10}$/;
    if ((inputtxt.value.match(phoneno))) {
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
