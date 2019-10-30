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
    isAdmin: false,
  }

  constructor(private auth: AuthenticatorService) { 

  }

  ngOnInit() {
    this.auth.institute_type.subscribe(
      res => {
        if (res == 'LANG') {
          this.jsonFlag.isProfessional = true;
        } else {
          this.jsonFlag.isProfessional = false;
        }
      }
    )
    const permissionArray = sessionStorage.getItem('permissions');
    const permittedRoles = sessionStorage.getItem('permitted_roles');
    const userType = sessionStorage.getItem('userType');
    if (userType == '0') {
      if (permissionArray == "" || permissionArray == null) {
        this.jsonFlag.isAdmin = true;
      }
    }

    if (permittedRoles['718'] != undefined && sessionStorage.getItem('enable_eLearn_feature')=='1') {
      this.jsonFlag.isEcourseFileManager = true;
    }
  }

}
