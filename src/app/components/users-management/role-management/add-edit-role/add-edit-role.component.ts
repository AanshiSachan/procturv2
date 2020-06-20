import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RoleService } from '../../../../services/user-management/role.service';
import { AppComponent } from '../../../../app.component';

@Component({
  selector: 'app-add-edit-role',
  templateUrl: './add-edit-role.component.html',
  styleUrls: ['./add-edit-role.component.scss']
})
export class AddEditRoleComponent implements OnInit {

  roleId: any = "-1";
  featuresArray: any = [];
  userData: any = "";
  targetFeatures: any = [];
  cloneFeatureArray: any = [];
  roleName: any = "";
  roleDesc: any = "";
  instituteId: any;
  libraryRoleInstituteId: any;
  kakadeRoleInstituteId: any;
  selectedRoleLength: any = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private apiService: RoleService,
    private toastCtrl: AppComponent
  ) { }

  ngOnInit() {
    this.instituteId = sessionStorage.getItem('institute_id');
    this.libraryRoleInstituteId = 101077;
    this.kakadeRoleInstituteId = 100767;
    this.activatedRoute.params.subscribe(
      (res: any) => {
        this.getAllRolesList();
        if (res.hasOwnProperty('id')) {
          this.roleId = res.id;
        } else {
          this.targetFeatures = [];
        }
      }
    )
  }

  getAllRolesList() {
    this.apiService.getAllFeature().subscribe(
      res => {
        this.featuresArray = res;
        if (this.instituteId != this.libraryRoleInstituteId) {
          if (this.instituteId != 100127) {
            for (let t = 0; t < this.featuresArray.length; t++) {
              if (this.featuresArray[t].feature_id == 721) {
                this.featuresArray.splice(t, 1);
              }
            }
          }
        }
        if (this.instituteId != this.kakadeRoleInstituteId || this.instituteId != 100127) {
          if (this.instituteId != 100767 && this.instituteId != 100127) {
            for (let t = 0; t < this.featuresArray.length; t++) {
              if (this.featuresArray[t].feature_id == 718) {
                this.featuresArray.splice(t, 1);
              }
            }
          }
        }

        this.cloneFeatureArray = this.keepCloning(res);
        this.cloneFeatureArray.filter(x => x.isChecked = false);
        if (this.roleId != "-1") {
          this.getRolesOfUser(this.roleId);
        }
      },
      err => {
        console.log(err);
      }
    )
  }

  getRolesOfUser(id) {
    this.apiService.getPerticularRoles(id).subscribe(
      (res: any) => {
        this.userData = res;
        let role: any = this.keepCloning(res);
        this.makeTargetArray(role.feautreList);
      },
      err => {
        console.log(err);
      }
    )
  }

  makeTargetArray(arr) {
    this.targetFeatures = [];
    if (arr.length > 0) {
      //console.log(this.featuresArray);
      for (let i = 0; i < arr.length; i++) {
        for (let t = 0; t < this.cloneFeatureArray.length; t++) {
          if (arr[i] == this.cloneFeatureArray[t].feature_id) {
            // this.targetFeatures.push(this.cloneFeatureArray[t]);
            // this.cloneFeatureArray.splice(t, 1);
            this.cloneFeatureArray[t].isChecked = true;
            this.selectedRoleLength++;
          }
        }
      }
    } else {
      this.targetFeatures = [];
    }
  }

  createNewRole() {
    let data: any = this.makeJsonTOSend();
    if (data.role_name == "" || data.role_name == null) {
      this.messageNotifier('error', '', 'Please Provide Role Name');
      return;
    }
    else if (data.feautreList.length == 0) {
      this.messageNotifier('error', '', 'Please Select Role');
      return;
    }
    else {
      this.apiService.createRole(data).subscribe(
        res => {
          this.messageNotifier('success', '', 'Role Added Successfully');
          this.route.navigateByUrl('/view/manage/role');
        },
        err => {
          this.messageNotifier('error', 'error', err.error.message);
        }
      )
    }

  }

  updateRole() {
    let data: any = this.makeJsonTOSend();
    if (data.feautreList.length == 0) {
      this.messageNotifier('error', '', 'Please Select Role');
      return;
    } else {
      this.apiService.updateRole(data, this.userData.role_id).subscribe(
        res => {
          this.messageNotifier('success', '', 'Role Updated Successfully');
          this.route.navigateByUrl('/view/manage/role');
        },
        err => {
          console.log(err);
          this.messageNotifier('error', '', err.error.message);
        }
      )
    }
  }

  makeJsonTOSend() {
    let obj: any = {
      feautreList: []
    }
    if (this.roleId == '-1') {
      obj.role_name = this.roleName;
      obj.role_desc = this.roleDesc;
    } else {
      obj.role_id = this.userData.role_id;
      obj.role_desc = this.userData.role_desc;
    }
    for (let i = 0; i < this.cloneFeatureArray.length; i++) {
      if (this.cloneFeatureArray[i].isChecked) {
        obj.feautreList.push(this.cloneFeatureArray[i].feature_id);
      }
    }
    return obj;
  }


  messageNotifier(type, title, msg) {
    let data = {
      type: type,
      title: title,
      body: msg
    }
    this.toastCtrl.popToast(data);
  }

  keepCloning(objectpassed) {
    if (objectpassed === null || typeof objectpassed !== 'object') {
      return objectpassed;
    }
    let temporaryStorage = objectpassed.constructor();
    for (var key in objectpassed) {
      temporaryStorage[key] = this.keepCloning(objectpassed[key]);
    }
    return temporaryStorage;
  }

  checkLengthofRole(event) {
    event ? this.selectedRoleLength++ : this.selectedRoleLength--;
  }
}
