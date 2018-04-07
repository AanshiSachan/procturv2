import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../services/login-services/login.service';
import { Router } from '@angular/router';


@Component({
  selector: 'core-header',
  templateUrl: './core-header.component.html',
  styleUrls: ['./core-header.component.scss']
})
export class CoreHeaderComponent implements OnInit {

  instituteName: string;
  userName: string;
  menuToggler: boolean = false;

  ngOnInit() {

    this.log.currentInstitute.subscribe(res => {
      this.instituteName = res;
    });

    this.log.currentUsername.subscribe(res => {
      this.userName = res;
    });

    this.checkUserHadAccess();
  }

  constructor(private log: LoginService, private router: Router) {
  }

  logout() {
    if (this.log.logoutUser()) {
      this.router.navigate(['/authPage']);
      window.location.reload(true);
    }
  }

  triggerOverlayMenu() {
    if (this.menuToggler) {
      this.menuToggler = false;
      document.getElementById('menu-close').classList.add('hide');
      document.getElementById('menu-open').classList.remove('hide');
      this.log.changeMenuStatus(this.menuToggler);
    }
    else {
      this.menuToggler = true;
      document.getElementById('menu-close').classList.remove('hide');
      document.getElementById('menu-open').classList.add('hide');
      this.log.changeMenuStatus(this.menuToggler);
    }
  }

  goToHome() {
    this.router.navigate(['/home']);
  }


  checkUserHadAccess() {
    const permissionArray = sessionStorage.getItem('permissions');
    if (permissionArray == null || permissionArray == "") {
      this.showAllFields();
    } else {
      if (permissionArray != undefined) {
        this.hideAllFields();
        if (permissionArray.indexOf('503') != -1) {
          document.getElementById('divMasterTag').classList.remove('hide');
          document.getElementById('divTeacherTag').classList.remove('hide');
        }
        if (permissionArray.indexOf('506') != -1) {
          document.getElementById('divMasterTag').classList.remove('hide');
          document.getElementById('divFeeTag').classList.remove('hide');
        }
        if (permissionArray.indexOf('507') != -1) {
          document.getElementById('divMasterTag').classList.remove('hide');
          document.getElementById('divSlotTag').classList.remove('hide');
        }
        if (permissionArray.indexOf('509') != -1) {
          document.getElementById('divMasterTag').classList.remove('hide');
          document.getElementById('divAcademicTag').classList.remove('hide');
        }
        if (permissionArray.indexOf('602') != -1) {
          document.getElementById('divSettingTag').classList.remove('hide');
          document.getElementById('divMyAccountTag').classList.remove('hide');
        }
        if (permissionArray.indexOf('603') != -1) {
          document.getElementById('divSettingTag').classList.remove('hide');
          document.getElementById('divGeneralSettingTag').classList.remove('hide');
        }
      }
    }
  }

  showAllFields() {
    document.getElementById('divAdminTag').classList.remove('hide');
    document.getElementById('divMyAccountTag').classList.remove('hide');
    document.getElementById('divMasterTag').classList.remove('hide');
    document.getElementById('divTeacherTag').classList.remove('hide');
    document.getElementById('divFeeTag').classList.remove('hide');
    document.getElementById('divSlotTag').classList.remove('hide');
    document.getElementById('divAcademicTag').classList.remove('hide');
    document.getElementById('divSettingTag').classList.remove('hide');
    document.getElementById('divGeneralSettingTag').classList.remove('hide');
    document.getElementById('divManageFormTag').classList.remove('hide');
    document.getElementById('divAreaAndMap').classList.remove('hide');
  }

  hideAllFields() {
    document.getElementById('divAdminTag').classList.add('hide');
    document.getElementById('divMyAccountTag').classList.add('hide');
    document.getElementById('divMasterTag').classList.add('hide');
    document.getElementById('divTeacherTag').classList.add('hide');
    document.getElementById('divFeeTag').classList.add('hide');
    document.getElementById('divSlotTag').classList.add('hide');
    document.getElementById('divAcademicTag').classList.add('hide');
    document.getElementById('divSettingTag').classList.add('hide');
    document.getElementById('divGeneralSettingTag').classList.add('hide');
    document.getElementById('divManageFormTag').classList.add('hide');
  }

}
