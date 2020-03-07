import { Component, OnInit } from '@angular/core';
import { RoleService } from '../../../services/user-management/role.service';
import { AppComponent } from '../../../app.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.scss']
})
export class RoleManagementComponent implements OnInit {

  rolesList: any = [];
  userList: any = [];
  showUserListPopUp: boolean = false;
  rolesListDataSource: any = [];
  PageIndex: number = 1;
  displayBatchSize: number = 10;
  searchDataFlag: boolean = false;
  totalRow: number = 0;
  searchedData: any = [];
  toottip: string = "We can customize roles by defining multiple activities to a user";

  constructor(
    private apiService: RoleService,
    private toastCtrl: AppComponent,
    private router: Router
  ) { }

  ngOnInit() {
    this.checkWhichTabIsOpen();
    this.getRolesList();
  }

  checkWhichTabIsOpen() {
    let url = this.router.url;
    if (url.includes('user')) {
      this.switchActiveView('liUser');
    } else {
      this.switchActiveView('liRole');
    }
  }

  switchActiveView(id) {
    document.getElementById('liUser').classList.remove('active');
    document.getElementById('liRole').classList.remove('active');
    document.getElementById(id).classList.add('active');
  }

  getRolesList() {
    this.PageIndex = 1;
    this.apiService.getRoles().subscribe(
      (res: any) => {
        this.rolesListDataSource = res;
        this.totalRow = res.length;
        this.fetchTableDataByPage(this.PageIndex);
      },
      err => {
        console.log(err);
      }
    )
  }

  deleteRole(data) {
    if (confirm('Are you sure, you want to delete the role?')) {
      this.apiService.deleteRole(data.role_id).subscribe(
        res => {
          this.messageNotifier('success', '', 'Role deleted successfully');
          this.getRolesList();
        },
        err => {
          //console.log(err);
          this.messageNotifier('error', '', err.error.message);
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
          this.messageNotifier('error', '', err.error.message);
        }
      )
    } else {
      this.messageNotifier('error', '', 'No user is assigned to this role');
    }
  }

  closePopUp() {
    this.showUserListPopUp = false;
    this.userList = [];
  }

  // pagination functions 

  fetchTableDataByPage(index) {
    this.PageIndex = index;
    let startindex = this.displayBatchSize * (index - 1);
    this.rolesList = this.getDataFromDataSource(startindex);
  }

  fetchNext() {
    this.PageIndex++;
    this.fetchTableDataByPage(this.PageIndex);
  }

  fetchPrevious() {
    if (this.PageIndex != 1) {
      this.PageIndex--;
      this.fetchTableDataByPage(this.PageIndex);
    }
  }

  getDataFromDataSource(startindex) {
    let data = [];
    if (this.searchDataFlag == true) {
      data = this.searchedData.slice(startindex, startindex + this.displayBatchSize);
    } else {
      data = this.rolesListDataSource.slice(startindex, startindex + this.displayBatchSize);
    }
    return data;
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
