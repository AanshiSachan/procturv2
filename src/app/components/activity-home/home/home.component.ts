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

  jsonFlag ={
    isProfessional:false,
    isAdmin:false,
    isFeeActivity:false,
    isMonitorDashboard:false,
    showExamDesk:false,
    showLiveClasses:false
  }

  constructor(
    private router: Router,
    private login: LoginService,
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
    this.checkUserAccess();
    if (this.jsonFlag.isAdmin) {
      let type = Number(sessionStorage.getItem('institute_setup_type'));
      this.jsonFlag.showExamDesk = this.checkInstSetupType(type, 4);
      this.jsonFlag.showLiveClasses = this.checkInstSetupType(type , 256);
    }
    const userType = sessionStorage.getItem('userType');
    if (userType == '3') {
      this.jsonFlag.showLiveClasses = true;
    }
  }

  checkUserAccess() {
    const permissionArray = sessionStorage.getItem('permissions');
    const userType = sessionStorage.getItem('userType');
    if (userType == '3') {
      this.jsonFlag.isAdmin = false;
    }
    else if (userType == '0') {
      if (permissionArray == "" || permissionArray == null) {
        this.jsonFlag.isAdmin = true;
        this.jsonFlag.isFeeActivity = true;
      }
      else {
        let perm: any[] = JSON.parse(permissionArray);

        if (perm.indexOf('102') != -1) {
          this.jsonFlag.isFeeActivity = true;
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
