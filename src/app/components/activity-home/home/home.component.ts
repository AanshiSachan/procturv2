import { Component, OnInit, } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../../services/login-services/login.service';
import 'rxjs/Rx';
import { AuthenticatorService } from '../../../services/authenticator.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isProfessional: boolean = false;
  isAdmin: boolean = false;
  isFeeActivity: boolean = false;
  isMonitorDashboard: boolean = false;
  showExamDesk: boolean = false;

  constructor(private router: Router, private login: LoginService, private auth: AuthenticatorService) {
    if (sessionStorage.getItem('userid') == null) {
      this.router.navigateByUrl('/authPage');
    }
  }

  ngOnInit() {
    this.auth.institute_type.subscribe(
      res => {
        if (res == 'LANG') {
          this.isProfessional = true;
        } else {
          this.isProfessional = false;
        }
      }
    )

    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));
    this.checkUserAccess();
    if (this.isAdmin) {
      let type = Number(sessionStorage.getItem('institute_setup_type'));
      this.showExamDesk = this.checkInstSetupType(type, 4);
    }
  }

  checkUserAccess() {
    const permissionArray = sessionStorage.getItem('permissions');
    const userType = sessionStorage.getItem('userType');
    if (userType == '3') {
      this.isAdmin = false;
    }
    else if (userType == '0') {
      if (permissionArray == "" || permissionArray == null) {
        this.isAdmin = true;
        this.isFeeActivity = true;
      }
      else {
        let perm: any[] = JSON.parse(permissionArray);

        if (perm.indexOf('102') != -1) {
          this.isFeeActivity = true;
        }

      }
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


}
