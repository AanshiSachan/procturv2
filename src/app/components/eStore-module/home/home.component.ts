import { Component, OnInit } from '@angular/core';
import { AuthenticatorService } from '../../../services/authenticator.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  jsonFlag = {
    isProfessional: false,
    isEcourseFileManager: false,
    isShowEcourseMapping: false,
  }



  constructor(private auth: AuthenticatorService) {

  }

  ngOnInit() {
    const permissionArray = sessionStorage.getItem('permissions');
    const permittedRoles = sessionStorage.getItem('permitted_roles');
    const userType = sessionStorage.getItem('userType');
    this.auth.institute_type.subscribe(
      res => {
        if (res == 'LANG') {
          this.jsonFlag.isProfessional = true;
        } else {
          this.jsonFlag.isProfessional = false;
        }
      }
    );
 
    if (userType == '0' && (permissionArray == "" || permissionArray == null)) {
      this.jsonFlag.isShowEcourseMapping = true;
    }
    
    if (sessionStorage.getItem('enable_elearn_course_mapping_feature') == '1') {
      this.jsonFlag.isShowEcourseMapping = true;
    }

    if (permittedRoles['718'] != undefined && sessionStorage.getItem('enable_eLearn_feature') == '1') {
      this.jsonFlag.isEcourseFileManager = true;
    }
  }

}
