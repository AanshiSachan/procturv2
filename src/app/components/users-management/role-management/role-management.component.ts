import { Component, OnInit } from '@angular/core';
import { RoleService } from '../../../services/user-management/role.service';

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.scss']
})
export class RoleManagementComponent implements OnInit {

  rolesList: any = [];

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

}
