import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user-management/user.service';
import { AppComponent } from '../../../app.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  isLangInstitute: boolean = false;
  dataFilter: any = {
    role: '',
    is_active: false
  }

  constructor(
    private apiService: UserService,
    private toastCtrl: AppComponent
  ) { }

  ngOnInit() {
    this.checkInstituteType();
  }

  sendSmsForApp(type) {
    if (confirm('Are you sure you want to send SMS to selected users?')) {
      let data = {
        app_sms_type: type,
        userArray: []
      };
      this.apiService.sendSmS(data).subscribe(
        res => {
          this.messageNotifier('success', 'Send Successfully', 'SMS Sent Successfully');
        },
        err => {
          console.log(err);
          this.messageNotifier('error', 'Error', err.error.message);
        }
      )
    }
  }

  getAllotedItemHistry(id){
    
  }

  checkInstituteType() {
    let type: any = sessionStorage.getItem('institute_type');
    if (type == "LANG") {
      this.isLangInstitute = true;
    } else {
      this.isLangInstitute = false;
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
}
