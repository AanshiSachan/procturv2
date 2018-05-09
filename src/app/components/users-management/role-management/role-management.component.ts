import { Component, OnInit } from '@angular/core';
import { RoleService } from '../../../services/user-management/role.service';

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
    private apiService: RoleService
  ) { }

  ngOnInit() {
    this.getRolesList();
  }

  getRolesList() {
    this.apiService.getRoles().subscribe(
      res => {
        this.rolesList = res;
        console.log(res);
      },
      err => {
        console.log(err);
      }
    )
  }

  deleteRole(data) {
    if (confirm('Are you sure, you want to delete the role?')) {

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
          console.log(err);
        }
      )
    }
  }

  closePopUp() {
    this.showUserListPopUp = false;
    this.userList = [];
  }

}
