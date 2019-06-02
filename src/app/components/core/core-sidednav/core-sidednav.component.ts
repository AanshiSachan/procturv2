import { Component, OnInit, AfterViewInit } from '@angular/core';
import { LoginService } from '../../../services/login-services/login.service';
import { AuthenticatorService } from '../../../services/authenticator.service';


@Component({
  selector: 'core-sidednav',
  templateUrl: './core-sidednav.component.html',
  styleUrls: ['./core-sidednav.component.scss']
})

export class CoreSidednavComponent implements OnInit, AfterViewInit {

  logs: string = ''
  isLangInstitute: boolean = false;
  permissionData: any[] = [];
  userType: any = '';
  instituteId: any;

  constructor(
    private login: LoginService,
    private auth: AuthenticatorService
  ) { }


  ngOnInit() {

    this.instituteId = sessionStorage.getItem('institute_id');
    this.login.currentUserType.subscribe(e => {
      if (e == '' || e == null || e == undefined) {
      }
      else {
        this.userType = e
      }
    });

    this.login.currentPermissions.subscribe(e => {
      if (e == '' || e == null || e == undefined) {
      }
      else {
        this.permissionData = JSON.parse(e);
      }
    });

    this.login.currentUsername.subscribe(res => {
      this.createCustomSidenav();
    });

    this.checkInstituteType();

  }

  ngAfterViewInit() {
    this.setActiveClassOnSideNav();
  }

  validateUsertypePermissionData() {
    let p = sessionStorage.getItem('permissions');
    let e = sessionStorage.getItem('userType');
    if (p == '' || p == null || p == undefined) {
      this.permissionData = [];
    }
    if (p != '' && p != null && p != undefined) {
      this.permissionData = JSON.parse(p);
      this.login.changePermissions(p);
    }
    if (e == '' || e == null || e == undefined) {
      this.userType = 0;
    }
    else if (e != '' && e != null && e != undefined) {
      this.userType = e;
      this.login.changeUserType(e);
    }
  }


  createCustomSidenav() {
    let p = sessionStorage.getItem('permissions');
    let e = sessionStorage.getItem('userType');

    if (p == '' || p == null || p == undefined) {
      this.permissionData = [];
    }
    if (p != '' && p != null && p != undefined) {
      this.permissionData = JSON.parse(p);
      this.login.changePermissions(p);
    }
    if (e == '' || e == null || e == undefined) {
      this.userType = 0;
    }
    if (e != '' && e != null && e != undefined) {
      this.userType = e;
      this.login.changeUserType(e);
    }

    let userType: any = this.userType;
    let permission: any = this.permissionData;
    /* Admin or Custom login */
    if (userType == 0) {
      /* admin detected */
      if (permission == null || permission == undefined || permission == '') {
        document.getElementById('lione').classList.remove('hide');
        document.getElementById('litwo').classList.remove('hide');
        document.getElementById('lithree').classList.remove('hide');
        document.getElementById('lifour').classList.remove('hide');
        document.getElementById('lifive').classList.remove('hide');
        document.getElementById('lisix').classList.remove('hide');
        document.getElementById('liseven').classList.remove('hide');
        document.getElementById('lieight').classList.remove('hide');
        document.getElementById('linine').classList.remove('hide');
        document.getElementById('lizero').classList.remove('active');
        // document.getElementById('liten').classList.remove('hide');
      }
      /* custom user detected */
      else {
        /* array to store the user permissions, if the permission length is less than equal to one
        remove the first and last char and validate if its admin or not */
        this.hasEnquiry(this.permissionData);
        this.hasStudent(this.permissionData);
        this.hasCourse(this.permissionData);
        this.hasActivity(this.permissionData);
        this.hasEmployee(this.permissionData);
        this.hasReport(this.permissionData);
        this.hasInventory(this.permissionData);
        this.hasExpense(this.permissionData);
        this.hasCampaign(this.permissionData);
      }
    }
    /* Teacher login detected */
    else if (userType == 3) {
      this.teacherLoginFound();
    }

    if(this.instituteId == 100952 && p.indexOf('721') != -1){
      document.getElementById('liten').classList.remove('hide');
    }

  }



  loggedout() {
    document.getElementById('lione').classList.add('hide');
    document.getElementById('litwo').classList.add('hide');
    document.getElementById('lithree').classList.add('hide');
    document.getElementById('lifour').classList.add('hide');
    document.getElementById('lifive').classList.add('hide');
    document.getElementById('lisix').classList.add('hide');
    document.getElementById('liseven').classList.add('hide');
    document.getElementById('lieight').classList.add('hide');
    document.getElementById('linine').classList.add('hide');
    document.getElementById('lizero').classList.add('active');
  }



  hasEnquiry(permissions) {
    if (permissions.includes('110') || permissions.includes('115')) {
      document.getElementById('lione').classList.remove('hide');
    }
    else {
      document.getElementById('lione').classList.add('hide');
    }
  }



  hasStudent(permissions) {
    if (permissions.includes('301') || permissions.includes('302') || permissions.includes('303')) {
      document.getElementById('litwo').classList.remove('hide');
    }
    else {
      document.getElementById('litwo').classList.add('hide');
    }
  }



  hasCourse(permissions) {
    if (permissions.includes('401') || permissions.includes('402') || permissions.includes('403') || permissions.includes('404') || permissions.includes('405') || permissions.includes('406') || permissions.includes('501') || permissions.includes('502') || permissions.includes('505') || permissions.includes('701') || permissions.includes('704') || permissions.includes('702') || permissions.includes('404')) {
      document.getElementById('lithree').classList.remove('hide');
    }
    else {
      document.getElementById('lithree').classList.add('hide');
    }
  }



  hasActivity(permissions) {
    if (permissions.includes('102') || permissions.includes('114') || permissions.includes('113')) {
      document.getElementById('lifour').classList.remove('hide');
    }
    else {
      document.getElementById('lifour').classList.add('hide');
    }
  }



  hasEmployee(permissions) {
    if (permissions.includes('118') || permissions.includes('119') || permissions.includes('120') || permissions.includes('121')) {
      document.getElementById('lifive').classList.remove('hide');
    }
    else {
      document.getElementById('lifive').classList.add('hide');
    }
  }



  hasReport(permissions) {
    if (permissions.includes('201') || permissions.includes('202') || permissions.includes('203') || permissions.includes('204') || permissions.includes('205') || permissions.includes('206') || permissions.includes('207') || permissions.includes('208')) {
      document.getElementById('lisix').classList.remove('hide');
    }
    else {
      document.getElementById('lisix').classList.add('hide');
    }
  }



  hasInventory(permissions) {
    if (permissions.includes('301')) {
      document.getElementById('liseven').classList.remove('hide');
    }
    else {
      document.getElementById('liseven').classList.add('hide');
    }
  }


  hasExpense(permissions) {
    if (permissions.includes('108') || permissions.includes('109')) {
      document.getElementById('lieight').classList.remove('hide');
    }
    else {
      document.getElementById('lieight').classList.add('hide');
    }
  }


  hasCampaign(permissions) {
    if (permissions.includes('115')) {
      document.getElementById('linine').classList.remove('hide');
    }
    else {
      document.getElementById('linine').classList.add('hide');
    }
  }


  hasExam(permissions) {
    if (permissions.includes('103') || permissions.includes('112') || permissions.includes('203') || permissions.includes('404')) {
      //document.getElementById('liten').classList.remove('hide');
    }
    else { }
  }

  /* Function to set the id for setActive function to act upon */
  toggler(id) {
    this.RemoveActiveTabs();
    if (id === 'lione' || id === 'li1') {
      id = 'lione';
      document.getElementById('lione').classList.add('active');
    }
    else if (id === 'litwo' || id === 'li2') {
      id = 'litwo';
      document.getElementById('litwo').classList.add('active');
    }
    else if (id === 'lithree' || id === 'li3') {
      id = 'lithree';
      document.getElementById('lithree').classList.add('active');
    }
    else if (id === 'lifour' || id === 'li4') {
      id = 'lifour';
      document.getElementById('lifour').classList.add('active');
    }
    else if (id === 'lifive' || id === 'li5') {
      id = 'lifive';
      document.getElementById('lifive').classList.add('active');
    }
    else if (id === 'lisix' || id === 'li6') {
      id = 'lisix';
      document.getElementById('lisix').classList.add('active');
    }
    else if (id === 'liseven' || id === 'li7') {
      id = 'liseven';
      document.getElementById('liseven').classList.add('active');
    }
    else if (id === 'lieight' || id === 'li8') {
      id = 'lieight';
      document.getElementById('lieight').classList.add('active');
    }
    else if (id === 'linine' || id === 'li9') {
      id = 'linine';
      document.getElementById('linine').classList.add('active');
    }
    else if (id === 'liten' || id === 'liX') {
      id = 'liten';
      document.getElementById('liten').classList.add('active');
    }
    else if (id === 'lizero' || id === 'li0') {
      id = 'lizero';
      document.getElementById('lizero').classList.add('active');
    }
  }

  checkInstituteType() {
    this.auth.institute_type.subscribe(
      res => {
        if (res == "LANG") {
          this.isLangInstitute = true;
        } else {
          this.isLangInstitute = false;
        }
      }
    )
  }


  /// Teacher Role Found
  teacherLoginFound() {
    document.getElementById('lione').classList.add('hide');
    document.getElementById('litwo').classList.add('hide');
    document.getElementById('lifive').classList.add('hide');
    document.getElementById('liseven').classList.add('hide');
    document.getElementById('lieight').classList.add('hide');
    document.getElementById('linine').classList.add('hide');

    document.getElementById('lithree').classList.remove('hide');
    document.getElementById('lifour').classList.remove('hide');
    document.getElementById('lisix').classList.remove('hide');
  }

  RemoveActiveTabs() {
    document.getElementById('lizero').classList.remove('active');
    document.getElementById('lione').classList.remove('active');
    document.getElementById('litwo').classList.remove('active');
    document.getElementById('lithree').classList.remove('active');
    document.getElementById('lifour').classList.remove('active');
    document.getElementById('lifive').classList.remove('active');
    document.getElementById('lisix').classList.remove('active');
    document.getElementById('liseven').classList.remove('active');
    document.getElementById('lieight').classList.remove('active');
    document.getElementById('linine').classList.remove('active');
    document.getElementById('liten').classList.remove('active');
    /* document.getElementById('liten').classList.add('active');
      document.getElementById('lieleven').classList.remove('active'); */
  }

  setActiveClassOnSideNav() {
    this.RemoveActiveTabs();
    let url: string = window.location.href;
    if (url.includes('admin')) {
      document.getElementById('lizero').classList.add('active');
    } else if (url.includes('enquiry')) {
      document.getElementById('lione').classList.add('active');
    } else if (url.includes('student')) {
      document.getElementById('litwo').classList.add('active');
    } else if (url.includes('course')) {
      document.getElementById('lithree').classList.add('active');
    } else if (url.includes('activity')) {
      document.getElementById('lifour').classList.add('active');
    } else if (url.includes('reports')) {
      document.getElementById('lisix').classList.add('active');
    } else if (url.includes('inventory')) {
      document.getElementById('liseven').classList.add('active');
    } else if (url.includes('campaign')) {
      document.getElementById('linine').classList.add('active');
    } else if (url.includes('library')) {
      document.getElementById('liten').classList.add('active');
    }
  }

}
