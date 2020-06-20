import { Component, OnInit } from '@angular/core';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-online-exam-home',
  templateUrl: './online-exam-home.component.html',
  styleUrls: ['./online-exam-home.component.scss']
})
export class OnlineExamHomeComponent implements OnInit {

  jsonFlag = {
    isProfessional: false,
    isAdmin: false,
    showExamDesk: false,
    institute_id:'',
    isShowEcourseMapping:false
  }

  constructor(
    private router: Router,
    private auth: AuthenticatorService
  ) {
    if (sessionStorage.getItem('userid') == null) {
      this.router.navigateByUrl('/authPage');
    }
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
    this.jsonFlag.institute_id = sessionStorage.getItem('institute_id');
    this.checkUserAccess();
    if (this.jsonFlag.isAdmin) {
      let type = Number(sessionStorage.getItem('institute_setup_type'));
      this.jsonFlag.showExamDesk = this.checkInstSetupType(type, 4);
    }  
  }

  checkUserAccess() {
    const permissionArray = sessionStorage.getItem('permissions');
    const permittedRoles = sessionStorage.getItem('permitted_roles');
    const userType = sessionStorage.getItem('userType');
    if (userType == '3') {
      this.jsonFlag.isAdmin = false;
    }
    else if (userType == '0') {
      if (permissionArray == "" || permissionArray == null) {
        this.jsonFlag.isAdmin = true;
        this.jsonFlag.isShowEcourseMapping = true;
      }
    }
 
    if (sessionStorage.getItem('enable_elearn_course_mapping_feature') == '1') {
      this.jsonFlag.isShowEcourseMapping = true;
    }
  }

checkInstSetupType(value, role): boolean {
    if (value != 0) {
      var start = 2;
      var count = 1;
      while (start != value) {
        count++;
        start = start + 2;
      }
      var arr = [0, 0, 0, 0, 0, 0, 0, 0];
      var s = count.toString(2);
      var k = 0;
      for (var i = s.length - 1; i >= 0; i--) {
        arr[k] = parseInt(s.charAt(i));
        k++;
      }

      switch (role) {
        case 2:
          if (arr[0] == 1)
            return true;
          break;

        case 4:
          if (arr[1] == 1)
            return true;
          break;

        case 8:
          if (arr[2] == 1)
            return true;
          break;

        case 16:
          if (arr[3] == 1)
            return true;
          break;
        case 32:
          if (arr[4] == 1)
            return true;
          break;
        case 64:
          if (arr[5] == 1)
            return true;
          break;

        case 128:
          if (arr[6] == 1)
            return true;
          break;
        case 256:
          if (arr[7] == 1)
            return true;
          break;
        default: return false;
      }
      return false;

    }
    else {
      return false;
    }
  }

  openExamdesk() {
    window.open('https://examdesk.co/');
  }


}
