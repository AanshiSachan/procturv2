import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticatorService } from '../../services/authenticator.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {

  isLangInstitue: boolean = false;
  @ViewChild('liStandard') liStandard: ElementRef;
  @ViewChild('liSubject') liSubject: ElementRef;
  @ViewChild('liManageBatch') liManageBatch: ElementRef;
  @ViewChild('liClass') liClass: ElementRef;
  @ViewChild('liExam') liExam: ElementRef;

  constructor(
    private router: Router,
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
    this.checkInstituteType();
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
    this.liStandard.nativeElement.classList.remove('active');
    this.liSubject.nativeElement.classList.remove('active');
    this.liManageBatch.nativeElement.classList.remove('active');
    this.liExam.nativeElement.classList.remove('active');
    this.liClass.nativeElement.classList.remove('active');
    setTimeout(() => {
      document.getElementById(showId).classList.add('active');
    }, 500)
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
            this.liStandard.nativeElement.classList.remove('hide');
          }
          if (permissionArray.indexOf('502') != -1) {
            this.liSubject.nativeElement.classList.remove('hide');
          }
          if (permissionArray.indexOf('505') != -1) {
            this.liManageBatch.nativeElement.classList.remove('hide');
          }
          if (permissionArray.indexOf('701') >= 0 || permissionArray.indexOf('704') >= 0) {
            this.liClass.nativeElement.classList.remove('hide');
          }
          if (permissionArray.indexOf('702') >= 0) {
            this.liExam.nativeElement.classList.remove('hide');
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
      this.router.navigateByUrl('/view/course/standardlist');
      this.switchActiveView('liStandard');
    } else if (data.indexOf('502') != -1) {
      this.router.navigateByUrl('/view/course/subject');
      this.switchActiveView('liSubject');
    } else if (data.indexOf('505') != -1) {
      this.router.navigateByUrl('/view/course/courselist');
      this.switchActiveView('liManageBatch');
    } else if (data.indexOf('701') >= 0 || data.indexOf('704') >= 0) {
      this.router.navigateByUrl('/view/course/class');
      this.switchActiveView('liClass');
    } else if (data.indexOf('702') >= 0) {
      this.router.navigateByUrl('/view/course/exam');
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
            this.liStandard.nativeElement.classList.remove('hide');
          }
          if (permissionArray.indexOf('502') != -1) {
            this.liSubject.nativeElement.classList.remove('hide');
          }
          if (permissionArray.indexOf('401') != -1) {
            this.liManageBatch.nativeElement.classList.remove('hide');
          }
          if (permissionArray.indexOf('402') >= 0 || permissionArray.indexOf('704') >= 0) {
            this.liClass.nativeElement.classList.remove('hide');
          }
          if (permissionArray.indexOf('404') >= 0) {
            this.liExam.nativeElement.classList.remove('hide');
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
      this.router.navigateByUrl('/view/course/standardlist');
      this.switchActiveView('liStandard');
    } else if (data.indexOf('502') != -1) {
      this.router.navigateByUrl('/view/course/subject');
      this.switchActiveView('liSubject');
    } else if (data.indexOf('401') != -1) {
      this.router.navigateByUrl('/view/course/managebatch');
      this.switchActiveView('liManageBatch');
    } else if (data.indexOf('402') >= 0 || data.indexOf('704') >= 0) {
      this.router.navigateByUrl('/view/course/class');
      this.switchActiveView('liClass');
    } else if (data.indexOf('404') >= 0) {
      this.router.navigateByUrl('/view/course/exam');
      this.switchActiveView('liExam');
    }
  }

  showAllTabs() {
    this.liStandard.nativeElement.classList.remove('hide');
    this.liSubject.nativeElement.classList.remove('hide');
    this.liManageBatch.nativeElement.classList.remove('hide');
    this.liExam.nativeElement.classList.remove('hide');
    this.liClass.nativeElement.classList.remove('hide');
  }

  hideAllTabs() {
    this.liStandard.nativeElement.classList.add('hide');
    this.liSubject.nativeElement.classList.add('hide');
    this.liManageBatch.nativeElement.classList.add('hide');
    this.liExam.nativeElement.classList.add('hide');
    this.liClass.nativeElement.classList.add('hide');
  }

  teacherLoginFound() {
    this.hideAllTabs();
    this.liManageBatch.nativeElement.classList.remove('hide');
    this.liClass.nativeElement.classList.remove('hide');
    if (this.isLangInstitue) {
      this.router.navigateByUrl('/view/course/managebatch');
      this.switchActiveView('liManageBatch');
    } else {
      this.router.navigateByUrl('/view/course/courselist');
      this.switchActiveView('liManageBatch');
    }
  }

}
