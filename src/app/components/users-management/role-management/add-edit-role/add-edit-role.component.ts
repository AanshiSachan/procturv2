import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RoleService } from '../../../../services/user-management/role.service';
import { AppComponent } from '../../../../app.component';
import { role } from '../../../../model/role_features';
import { AuthenticatorService } from '../../../../services/authenticator.service';

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
  examDeskRoles: any = [];
  procturRoles: any = [];
  role_feature = role.features;
  isShoweOnlineExam: boolean = false;
  existingRolesData: any = [];
  schoolModel: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private apiService: RoleService,
    private toastCtrl: AppComponent,
    private auth: AuthenticatorService
  ) { }

  ngOnInit() {
    this.schoolModel = this.auth.schoolModel.getValue();
    this.instituteId = sessionStorage.getItem('institute_id');
    this.isShoweOnlineExam = sessionStorage.getItem('isShoweOnlineExam') == 'true';
    this.libraryRoleInstituteId = 101077;
    this.kakadeRoleInstituteId = 100767;
    this.activatedRoute.params.subscribe(
      (res: any) => {
        this.getAllRolesList();
        // this.getAllExistingRoles();
        if (res.hasOwnProperty('id')) {
          this.roleId = res.id;
        } else {
          this.targetFeatures = [];
        }
      }
    )
  }

  getAllExistingRoles() {
    this.apiService.getRoles().subscribe((data: any) => {
      this.existingRolesData = data;
    });
  }

  getAllRolesList() {
    this.auth.showLoader();
    this.apiService.getAllFeature().subscribe(
      res => {
        this.auth.hideLoader();
        this.featuresArray = res;
        // Changes by Nalini - libarary role will be visible only if enabled from super admin and study material role will be visible for all users
        this.cloneFeatureArray = this.keepCloning(res);
        for (let i = 0; i < this.cloneFeatureArray.length; i++) {
          if (this.cloneFeatureArray[i].product_name == 'Examdesk') {
            this.examDeskRoles = this.cloneFeatureArray[i].category_list;
          } else if (this.cloneFeatureArray[i].product_name == 'Proctur') {
            this.procturRoles = this.cloneFeatureArray[i].category_list;
          }
        }
        // hide super admin feature condition based -- Nalini
        if (sessionStorage.getItem('enable_library_feature') != '1') {
          this.checkSuperAdminSettings(5031);
        }
        if (sessionStorage.getItem('isShowLiveclass') != 'true') {
          this.checkSuperAdminSettings(5022);
        }
        if(!this.isShoweOnlineExam) {
          this.checkSuperAdminSettings(5033);
        }
        if(sessionStorage.getItem('enable_eLearn_feature') != '1') {
          this.checkSuperAdminSettings(5027);
        }
        if(sessionStorage.getItem('enable_client_website') != 'true') {
          this.checkSuperAdminSettings(5122);
        }
        if(sessionStorage.getItem('enable_online_assignment_feature') != '1') {
          this.checkSuperAdminSettings(5116);
        }
        if(sessionStorage.getItem('isShowExpense') != 'true') {
          this.checkSuperAdminSettings(5084);
          this.checkSuperAdminSettingsSubRole(5034, 5117);
        }
        // if(sessionStorage.getItem('enable_chat_with_parent') != '1') {
        //   this.checkSuperAdminSettingsSubRole(9999, 5066); 
        // }
        if(this.schoolModel) {
          this.checkSuperAdminSettings(5027);
          this.checkSuperAdminSettingsSubRole(5019, 5109);
          this.checkSuperAdminSettingsSubRole(5020, 5047);
          this.checkSuperAdminSettingsSubRole(5034, 5048);
          this.checkSuperAdminSettingsSubRole(5034, 5049);
        }
        // Manage branch menu hide -- Nalini
        this.checkSuperAdminSettings(5052);
        if (this.roleId != "-1") {
          this.getRolesOfUser(this.roleId);
        }
      },
      err => {
        this.auth.hideLoader();
        console.log(err);
      }
    )
  }

  checkSuperAdminSettings(category_id) {
    for (let t = 0; t < this.procturRoles.length; t++) {
      if (this.procturRoles[t].category_id == category_id) {
        this.procturRoles.splice(t, 1);
      }
    }
  }

  checkSuperAdminSettingsSubRole(category_id, feature_id) {
    for (let t = 0; t < this.procturRoles.length; t++) {
      if (this.procturRoles[t].category_id == category_id) {
        for(let feature = 0; feature < this.procturRoles[t].feature_list.length; feature++) {
          if(this.procturRoles[t].feature_list[feature].feature_id == feature_id) {
            this.procturRoles[t].feature_list.splice(feature, 1);
          }
        }
      }
    }
  }

  getRolesOfUser(id) {
    this.auth.showLoader();
    this.apiService.getPerticularRoles(id).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.userData = res;
        let role: any = this.keepCloning(res);
        // for (let t = 0; t < this.cloneFeatureArray.length; t++) {
        //   for (let j = 0; j < this.cloneFeatureArray[t].category_list.length; j++) {
        //     for (let feature = 0; feature < this.cloneFeatureArray[t].category_list[j].feature_list.length; feature++) {
        //       this.cloneFeatureArray[t].category_list[j].isToggleChecked = false;
        //       this.cloneFeatureArray[t].category_list[j].feature_list[feature].isChecked = false;
        //       this.selectedRoleLength++;
        //     }
        //   }
        // }
        this.makeTargetArray(role.feautreList);
      },
      err => {
        this.auth.hideLoader();
        console.log(err);
      }
    )
  }

  makeTargetArray(arr) {
    this.auth.showLoader();
    this.targetFeatures = [];
    this.selectedRoleLength = 0;
    if (arr.length > 0) {
      for (let i = 0; i < arr.length; i++) {
        for (let t = 0; t < this.cloneFeatureArray.length; t++) {
          for (let j = 0; j < this.cloneFeatureArray[t].category_list.length; j++) {
            if(arr[i] == this.cloneFeatureArray[t].category_list[j].category_id) {
              this.cloneFeatureArray[t].category_list[j].isToggleChecked = true;
              this.selectedRoleLength++;
            }
            for (let feature = 0; feature < this.cloneFeatureArray[t].category_list[j].feature_list.length; feature++) {
              if (arr[i] == this.cloneFeatureArray[t].category_list[j].feature_list[feature].feature_id) {
                this.cloneFeatureArray[t].category_list[j].isToggleChecked = true;
                this.cloneFeatureArray[t].category_list[j].feature_list[feature].isChecked = true;
                this.selectedRoleLength++;
              }
            }
          }
        }
      }
      this.auth.hideLoader();
    } else {
      this.targetFeatures = [];
      this.auth.hideLoader();
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
          this.messageNotifier('error', '', err.error.message);
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
    for (let t = 0; t < this.cloneFeatureArray.length; t++) {
      for (let j = 0; j < this.cloneFeatureArray[t].category_list.length; j++) {
        if (this.cloneFeatureArray[t].category_list[j].isToggleChecked) {
          obj.feautreList.push(this.cloneFeatureArray[t].category_list[j].category_id);
        }
        for (let feature = 0; feature < this.cloneFeatureArray[t].category_list[j].feature_list.length; feature++) {
          if (this.cloneFeatureArray[t].category_list[j].feature_list[feature].isChecked) {
            obj.feautreList.push(this.cloneFeatureArray[t].category_list[j].feature_list[feature].feature_id);
          }
        }
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

  sliderChanges(obj) {
    if (!obj.isToggleChecked) {
      this.selectedRoleLength--;
      for (let i = 0; i < obj.feature_list.length; i++) {
        if (obj.feature_list[i].isChecked) {
          obj.feature_list[i].isChecked = false;
          this.selectedRoleLength--;
        }
      }
    } else {
      this.selectedRoleLength++;
    }
  }
}
