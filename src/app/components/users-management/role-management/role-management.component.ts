import { Component, OnInit } from '@angular/core';
import { RoleService } from '../../../services/user-management/role.service';
import { AppComponent } from '../../../app.component';

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.scss']
})
export class RoleManagementComponent implements OnInit {

  rolesList: any = [];
  userList: any = [];
  showUserListPopUp: boolean = false;

  constructor(
    private apiService: RoleService,
    private toastCtrl: AppComponent
  ) { }

  ngOnInit() {
    this.getRolesList();
  }

  getRolesList() {
    this.apiService.getRoles().subscribe(
      res => {
        this.rolesList = res;
        //console.log(res);
      },
      err => {
        //console.log(err);
      }
    )
  }

  deleteRole(data) {
    if (confirm('Are you sure, you want to delete the role?')) {
      this.apiService.deleteRole(data.role_id).subscribe(
        res => {
          this.messageNotifier('success', 'Deleted Successfully', 'Role deleted successfully');
          this.getRolesList();
        },
        err => {
          //console.log(err);
          this.messageNotifier('error', 'Error', err.error.message);
        }
      )
    }
  }

  showAssignedUserList(data) {
    if (data.total_user_count > 0) {
      this.apiService.getAssignedUserList(data.role_id).subscribe(
        res => {
          this.showUserListPopUp = true;
          this.userList = res;
        },
        err => {
          //console.log(err);
          this.messageNotifier('error', 'Error', err.error.message);
        }
      )
    } else {
      this.messageNotifier('error', 'Error', 'No user is assigned to this role');
    }
  }

  closePopUp() {
    this.showUserListPopUp = false;
    this.userList = [];
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
