import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login-services/login.service';
import { Router } from '@angular/router';
import { AuthenticatorService } from '../../services/authenticator.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {

  isLangInstitue: boolean = false;

  constructor(
    private router: Router,
    private login: LoginService,
    private auth: AuthenticatorService
  ) { }

  ngOnInit() {
    this.auth.institute_type.subscribe(
      res => {
        if (res == "LANG") {
          this.isLangInstitue = true;
        } else {
          this.isLangInstitue = false;
        }
      }
    )
    this.removeSelectionFromSideNav();
    this.removeFullscreen();
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));
    this.checkInstituteType();
  }

  removeSelectionFromSideNav() {
    document.getElementById('lione').classList.remove('active');
    document.getElementById('litwo').classList.remove('active');
    document.getElementById('lithree').classList.add('active');
    document.getElementById('lifour').classList.remove('active');
    document.getElementById('lifive').classList.remove('active');
    document.getElementById('lisix').classList.remove('active');
    document.getElementById('liseven').classList.remove('active');
    document.getElementById('lieight').classList.remove('active');
    document.getElementById('linine').classList.remove('active');
    document.getElementById('lizero').classList.remove('active');
  }

  checkInstituteType() {
    if (this.isLangInstitue) {
      this.checkUserAcessForLang();
    } else {
      this.checkUserAcessForNotLang();
    }
  }


  checkWhichTabIsOpen() {
    if (this.router.url.includes('standardlist')) {
      this.switchActiveView('liStandard');
    } else if (this.router.url.includes('subject')) {
      this.switchActiveView('liSubject');
    } else if (this.router.url.includes('courselist')) {
      this.switchActiveView('liManageBatch');
    } else if (this.router.url.includes('exam')) {
      this.switchActiveView('liExam');
    } else if (this.router.url.includes('class')) {
      this.switchActiveView('liClass');
    } else if (this.router.url.includes('managebatch')) {
      this.switchActiveView('liManageBatch');
    }
  }

  switchActiveView(showId) {
    setTimeout(() => {
      document.getElementById('liStandard').classList.remove('active');
      document.getElementById('liSubject').classList.remove('active');
      document.getElementById('liExam').classList.remove('active');
      document.getElementById('liClass').classList.remove('active');
      document.getElementById('liManageBatch').classList.remove('active');
      // document.getElementById('liCourses').classList.remove('active');
      document.getElementById(showId).classList.add('active');
    }, 500)
  }

  removeFullscreen() {
    var header = document.getElementsByTagName('core-header');
    var sidebar = document.getElementsByTagName('core-sidednav');

    [].forEach.call(header, function (el) {
      el.classList.remove('hide');
    });
    [].forEach.call(sidebar, function (el) {
      el.classList.remove('hide');
    });
  }


  checkUserAcessForNotLang() {
    let userType: any = Number(sessionStorage.getItem('userType'));
    const permissionArray = sessionStorage.getItem('permissions');
    if (userType != 3) {
      if (permissionArray == "" || permissionArray == null) {
        this.showAllTabs();
        this.checkWhichTabIsOpen();
      } else {
        this.hideAllTabs();
        if (permissionArray != null && permissionArray != "") {
          if (permissionArray.indexOf('501') != -1) {
            document.getElementById('liStandard').classList.remove('hide');
          }
          if (permissionArray.indexOf('502') != -1) {
            document.getElementById('liSubject').classList.remove('hide');
          }
          if (permissionArray.indexOf('505') != -1) {
            document.getElementById('liManageBatch').classList.remove('hide');
          }
          if (permissionArray.indexOf('701') >= 0 || permissionArray.indexOf('704') >= 0) {
            document.getElementById('liClass').classList.remove('hide');
          }
          if (permissionArray.indexOf('702') >= 0) {
            document.getElementById('liExam').classList.remove('hide');
          }
          this.routeToSubTabs(permissionArray);
        }
      }
    } else {
      this.teacherLoginFound();
    }
  }

  routeToSubTabs(data) {
    if (data.indexOf('501') != -1) {
      this.router.navigateByUrl('course/standardlist');
      this.switchActiveView('liStandard');
    } else if (data.indexOf('502') != -1) {
      this.router.navigateByUrl('course/subject');
      this.switchActiveView('liSubject');
    } else if (data.indexOf('505') != -1) {
      this.router.navigateByUrl('course/courselist');
      this.switchActiveView('liManageBatch');
    } else if (data.indexOf('701') >= 0 || data.indexOf('704') >= 0) {
      this.router.navigateByUrl('course/class');
      this.switchActiveView('liClass');
    } else if (data.indexOf('702') >= 0) {
      this.router.navigateByUrl('course/exam');
      this.switchActiveView('liExam');
    }
  }

  checkUserAcessForLang() {
    let userType: any = Number(sessionStorage.getItem('userType'));
    const permissionArray = sessionStorage.getItem('permissions');
    if (userType != 3) {
      if (permissionArray == "" || permissionArray == null) {
        this.showAllTabs();
        this.checkWhichTabIsOpen();
      } else {
        this.hideAllTabs();
        if (permissionArray != null && permissionArray != "") {
          if (permissionArray.indexOf('501') != -1) {
            document.getElementById('liStandard').classList.remove('hide');
          }
          if (permissionArray.indexOf('502')) {
            document.getElementById('liSubject').classList.remove('hide');
          }
          if (permissionArray.indexOf('401') != -1) {
            document.getElementById('liManageBatch').classList.remove('hide');
          }
          if (permissionArray.indexOf('402') >= 0 || permissionArray.indexOf('704') >= 0) {
            document.getElementById('liClass').classList.remove('hide');
          }
          if (permissionArray.indexOf('404') >= 0) {
            document.getElementById('liExam').classList.remove('hide');
          }
          this.routeToSubTabsForLang(permissionArray);
        }
      }
    } else {
      this.teacherLoginFound();
    }
  }

  routeToSubTabsForLang(data) {
    if (data.indexOf('501') != -1) {
      this.router.navigateByUrl('course/standardlist');
      this.switchActiveView('liStandard');
    } else if (data.indexOf('502') != -1) {
      this.router.navigateByUrl('course/subject');
      this.switchActiveView('liSubject');
    } else if (data.indexOf('401') != -1) {
      this.router.navigateByUrl('course/managebatch');
      this.switchActiveView('liManageBatch');
    } else if (data.indexOf('402') >= 0 || data.indexOf('704') >= 0) {
      this.router.navigateByUrl('course/class');
      this.switchActiveView('liClass');
    } else if (data.indexOf('404') >= 0) {
      this.router.navigateByUrl('course/exam');
      this.switchActiveView('liExam');
    }
  }

  showAllTabs() {
    document.getElementById('liStandard').classList.remove('hide');
    document.getElementById('liSubject').classList.remove('hide');
    document.getElementById('liManageBatch').classList.remove('hide');
    // document.getElementById('liCourses').classList.remove('hide');
    document.getElementById('liExam').classList.remove('hide');
    document.getElementById('liClass').classList.remove('hide');
  }

  hideAllTabs() {
    document.getElementById('liStandard').classList.add('hide');
    document.getElementById('liSubject').classList.add('hide');
    document.getElementById('liManageBatch').classList.add('hide');
    // document.getElementById('liCourses').classList.add('hide');
    document.getElementById('liExam').classList.add('hide');
    document.getElementById('liClass').classList.add('hide');
  }

  teacherLoginFound() {
    this.hideAllTabs();
    document.getElementById('liManageBatch').classList.remove('hide');
    document.getElementById('liClass').classList.remove('hide');
    if (this.isLangInstitue) {
      this.router.navigateByUrl('course/managebatch');
      this.switchActiveView('liManageBatch');
    } else {
      this.router.navigateByUrl('course/courselist');
      this.switchActiveView('liManageBatch');
    }
  }

}
