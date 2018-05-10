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
    role_id: '',
    attendance_device_id: '',
    userType: '',
    is_employee_to_be_create:'N'
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
        console.log(err);
      }
    )
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
