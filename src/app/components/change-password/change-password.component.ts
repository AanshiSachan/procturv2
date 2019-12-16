import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login-services/login.service';
import { MessageShowService } from '../../services/message-show.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnChanges {

  @Input() institute_id: number;
  @Output() close = new EventEmitter<any>();

  changePass: any = {
    username: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  constructor(
    private router: Router,
    private log: LoginService,
    private msgService: MessageShowService
  ) { }

  ngOnChanges() {
    let emailId = sessionStorage.getItem('alternate_email_id');
    if (emailId != "" && emailId != null && emailId != undefined && emailId != 'undefined') {
      this.changePass.username = emailId;
    }
    this.changePass.oldPassword = '';
    this.changePass.newPassword = '';
    this.changePass.confirmPassword = '';
  }

  changeUserPassword() {
    if (this.changePass.oldPassword.trim() == "" || this.changePass.oldPassword.trim() == null) {
      this.messageNotifier(this.msgService.toastTypes.error, '', 'Please provide old password');
      return true;
    }
    if (this.changePass.newPassword.trim() == "" || this.changePass.newPassword.trim() == null) {
      this.messageNotifier(this.msgService.toastTypes.error, '', 'Please provide new password');
      return true;
    }
    if (this.changePass.confirmPassword.trim() == "" || this.changePass.confirmPassword == null) {
      this.messageNotifier(this.msgService.toastTypes.error, '', 'Please provide password in confirm password');
      return true;
    }
    if (this.changePass.newPassword.trim() != this.changePass.confirmPassword.trim()) {
      this.messageNotifier(this.msgService.toastTypes.error, '', 'Please check password provided in confirm password field');
      return true;
    }
    let userId = sessionStorage.getItem('userid') + '|' + sessionStorage.getItem('userType');
    let dataToSend: any = {
      username: userId,
      userid: sessionStorage.getItem('userid'),
      oldPassword: this.changePass.oldPassword,
      newPassword: this.changePass.newPassword,
      institute_id: this.institute_id,
    }
    this.log.changePasswordService(dataToSend).subscribe(
      res => {
        this.messageNotifier(this.msgService.toastTypes.success, 'Password Changed', 'Password Changed Successfully');
        this.closeChangePasswordPopup();
        if (this.log.logoutUser()) {
          this.router.navigateByUrl('/authPage');
        }
      },
      err => {
        console.log(err);
        this.messageNotifier(this.msgService.toastTypes.error, '', err.error.message);
      }
    )
  }

  closeChangePasswordPopup() {
    this.changePass = {
      username: sessionStorage.getItem('alternate_email_id'),
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
    this.close.emit('true');
  }

  messageNotifier(type, title, message) {
    this.msgService.showErrorMessage(type, title, message);
  }

}
