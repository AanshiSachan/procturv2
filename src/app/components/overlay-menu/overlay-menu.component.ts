import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LoginService } from '../../services/login-services/login.service';

@Component({
  selector: 'overlay-menu',
  templateUrl: './overlay-menu.component.html',
  styleUrls: ['./overlay-menu.component.scss']
})
export class OverlayMenuComponent implements OnInit {

  @ViewChild('liEnquiry',{static: false}) liEnquiry: ElementRef;
  @ViewChild('liStudent',{static: false}) liStudent: ElementRef;
  @ViewChild('liCourse',{static: false}) liCourse: ElementRef;
  @ViewChild('liActivity',{static: false}) liActivity: ElementRef;
  @ViewChild('liEmployee',{static: false}) liEmployee: ElementRef;
  @ViewChild('liReports',{static: false}) liReports: ElementRef;
  @ViewChild('liInventory',{static: false}) liInventory: ElementRef;
  @ViewChild('liExpense',{static: false}) liExpense: ElementRef;
  @ViewChild('liCampaign',{static: false}) liCampaign: ElementRef;
  @ViewChild('liExams',{static: false}) liExams: ElementRef;
  @ViewChild('liHelp',{static: false}) liHelp: ElementRef;

  userType: any = 0;

  constructor(private log: LoginService) { }

  ngOnInit() {
    this.log.currentUserType.subscribe(e => {
      if (e == '' || e == null || e == undefined) {
      }
      else {
        this.userType = e
      }
    });
    this.checkUserAccess();
  }

  screenClicked() {
    this.log.changeMenuStatus(false);
    document.getElementById('menu-close').classList.add('hide');
    document.getElementById('menu-open').classList.remove('hide');
  }

  checkUserAccess() {
    if (this.userType == 0) {
      let permission = sessionStorage.getItem('permissions');
      if (permission == "" || permission == null) {
        this.showAllFields();
      } else {
        this.hasEnquiry(permission);
        this.hasStudent(permission);
        this.hasCourse(permission);
        this.hasActivity(permission);
        this.hasEmployee(permission);
        this.hasInventory(permission);
        this.hasReport(permission);
        this.hasCampaign(permission);
      }
    } else if (this.userType == 3) {
      this.teacherLoginFound();
    }
  }

  hasEnquiry(permissions) {
    if (permissions.includes('110') || permissions.includes('115')) {
      this.liEnquiry.nativeElement.classList.remove('hide');
    }
    else {
      this.liEnquiry.nativeElement.classList.add('hide');
    }
  }



  hasStudent(permissions) {
    if (permissions.includes('301') || permissions.includes('302') || permissions.includes('303')) {
      this.liStudent.nativeElement.classList.remove('hide');
    }
    else {
      this.liStudent.nativeElement.classList.add('hide');
    }
  }



  hasCourse(permissions) {
    if (permissions.includes('401') || permissions.includes('402') || permissions.includes('403') || permissions.includes('404') || permissions.includes('405') || permissions.includes('406') || permissions.includes('501') || permissions.includes('502') || permissions.includes('505') || permissions.includes('701') || permissions.includes('704') || permissions.includes('702') || permissions.includes('404')) {
      this.liCourse.nativeElement.classList.remove('hide');
    }
    else {
      this.liCourse.nativeElement.classList.add('hide');
    }
  }



  hasActivity(permissions) {
    if (permissions.includes('102') || permissions.includes('114') || permissions.includes('113')) {
      this.liActivity.nativeElement.classList.remove('hide');
    }
    else {
      this.liActivity.nativeElement.classList.add('hide');
    }
  }



  hasEmployee(permissions) {
    if (permissions.includes('118') || permissions.includes('119') || permissions.includes('120') || permissions.includes('121')) {
      this.liEmployee.nativeElement.classList.remove('hide');
    }
    else {
      this.liEmployee.nativeElement.classList.add('hide');
    }
  }



  hasReport(permissions) {
    if (permissions.includes('201') || permissions.includes('202') || permissions.includes('203') || permissions.includes('204') || permissions.includes('205') || permissions.includes('206') || permissions.includes('207') || permissions.includes('208')) {
      this.liReports.nativeElement.classList.remove('hide');
    }
    else {
      this.liReports.nativeElement.classList.add('hide');
    }
  }



  hasInventory(permissions) {
    if (permissions.includes('301')) {
      this.liInventory.nativeElement.classList.remove('hide');
    }
    else {
      this.liInventory.nativeElement.classList.add('hide');
    }
  }


  hasExpense(permissions) {
    if (permissions.includes('108') || permissions.includes('109')) {
      this.liExpense.nativeElement.classList.remove('hide');
    }
    else {
      this.liExpense.nativeElement.classList.add('hide');
    }
  }


  hasCampaign(permissions) {
    if (permissions.includes('115')) {
      this.liCampaign.nativeElement.classList.remove('hide');
    }
    else {
      this.liCampaign.nativeElement.classList.add('hide');
    }
  }


  hasExam(permissions) {
    if (permissions.includes('103') || permissions.includes('112') || permissions.includes('203') || permissions.includes('404')) {
      //document.getElementById('liten').classList.remove('hide');
    }
    else { }
  }


  showAllFields() {
    this.liEnquiry.nativeElement.classList.remove('hide');
    this.liStudent.nativeElement.classList.remove('hide');
    this.liCourse.nativeElement.classList.remove('hide');
    this.liActivity.nativeElement.classList.remove('hide');
    this.liEmployee.nativeElement.classList.remove('hide');
    this.liReports.nativeElement.classList.remove('hide');
    this.liInventory.nativeElement.classList.remove('hide');
    this.liExpense.nativeElement.classList.remove('hide');
    this.liCampaign.nativeElement.classList.remove('hide');
    this.liExams.nativeElement.classList.remove('hide');
    this.liHelp.nativeElement.classList.remove('hide');
  }

  hideAllFields() {
    this.liEnquiry.nativeElement.classList.add('hide');
    this.liStudent.nativeElement.classList.add('hide');
    this.liCourse.nativeElement.classList.add('hide');
    this.liActivity.nativeElement.classList.add('hide');
    this.liEmployee.nativeElement.classList.add('hide');
    this.liReports.nativeElement.classList.add('hide');
    this.liInventory.nativeElement.classList.add('hide');
    this.liExpense.nativeElement.classList.add('hide');
    this.liCampaign.nativeElement.classList.add('hide');
    this.liExams.nativeElement.classList.add('hide');
    this.liHelp.nativeElement.classList.add('hide');
  }

  teacherLoginFound() {
    this.hideAllFields();
    this.liCourse.nativeElement.classList.remove('hide');
    this.liActivity.nativeElement.classList.remove('hide');
    this.liReports.nativeElement.classList.remove('hide');
  }

}
