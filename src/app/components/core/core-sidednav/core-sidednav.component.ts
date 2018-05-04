import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../services/login-services/login.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'core-sidednav',
  templateUrl: './core-sidednav.component.html',
  styleUrls: ['./core-sidednav.component.scss']
})

export class CoreSidednavComponent implements OnInit {

  logs: string = ''
  isLangInstitute: boolean = false;
  permissionData: any[] = [];
  userType: any = '';
  constructor(private login: LoginService, private route: Router) { }


  ngOnInit() {

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
        //document.getElementById('liten').classList.remove('hide');
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
    else{
      document.getElementById('lione').classList.add('hide');
    }
  }



  hasStudent(permissions) {
    if (permissions.includes('301') || permissions.includes('302') || permissions.includes('303')) {
      document.getElementById('litwo').classList.remove('hide');
    }
    else{
      document.getElementById('litwo').classList.add('hide');
    }
  }



  hasCourse(permissions) {
    if (permissions.includes('401') || permissions.includes('402') || permissions.includes('403') || permissions.includes('404') || permissions.includes('405') || permissions.includes('406') || permissions.includes('501') || permissions.includes('502') || permissions.includes('505') || permissions.includes('701') || permissions.includes('704')) {
      document.getElementById('lithree').classList.remove('hide');
    }
    else{
      document.getElementById('lithree').classList.add('hide');
    }
  }



  hasActivity(permissions) {
    if (permissions.includes('101') || permissions.includes('102') || permissions.includes('103') || permissions.includes('104') || permissions.includes('114') || permissions.includes('113')) {
      document.getElementById('lifour').classList.remove('hide');
    }
    else{
      document.getElementById('lifour').classList.add('hide');
    }
  }



  hasEmployee(permissions) {
    if (permissions.includes('118') || permissions.includes('119') || permissions.includes('120') || permissions.includes('121')) {
      document.getElementById('lifive').classList.remove('hide');
    }
    else{
      document.getElementById('lifive').classList.add('hide');
    }
  }



  hasReport(permissions) {
    if (permissions.includes('201') || permissions.includes('202') || permissions.includes('203') || permissions.includes('204') || permissions.includes('205') || permissions.includes('206') || permissions.includes('207') || permissions.includes('208')) {
      document.getElementById('lisix').classList.remove('hide');
    }
    else{
      document.getElementById('lisix').classList.add('hide');
    }
  }



  hasInventory(permissions) {
    if (permissions.includes('301')) {
      document.getElementById('liseven').classList.remove('hide');
    }
    else{
      document.getElementById('liseven').classList.add('hide');
    }
  }


  hasExpense(permissions) {
    if (permissions.includes('108') || permissions.includes('109')) {
      document.getElementById('lieight').classList.remove('hide');
    }
    else{
      document.getElementById('lieight').classList.add('hide');
    }
  }


  hasCampaign(permissions) {
    if (permissions.includes('115')) {
      document.getElementById('linine').classList.remove('hide');
    }
    else{
      document.getElementById('linine').classList.add('hide');
    }
  }


  hasExam(permissions) {
    if (permissions.includes('103') || permissions.includes('112') || permissions.includes('203') || permissions.includes('404')) {
      //document.getElementById('liten').classList.remove('hide');
    }
    else{}
  }



  /* Function to set the clicked li tab active*/
  setActive(ev) {
    let id = ev.srcElement.id;

    if (id.substring(0, 2) === "li") {
      this.toggler(id);
    }
    else {
      let x = document.getElementById(id).parentElement.id;
      if (x.substring(0, 2) === "li") {
        this.toggler(x);
      }
      else {
        x = document.getElementById(x).parentElement.id;
        if (x.substring(0, 2) === "li") {
          this.toggler(x);
        }
        else {
          x = document.getElementById(x).parentElement.id;
          this.toggler(x);
        }
      }
    }

  }



  /* Function to set the id for setActive function to act upon */
  toggler(id) {
    if (id === 'lione' || id === 'li1') {
      id = 'lione';
      document.getElementById('lione').classList.add('active');
      document.getElementById('litwo').classList.remove('active');
      document.getElementById('lithree').classList.remove('active');
      document.getElementById('lifour').classList.remove('active');
      document.getElementById('lifive').classList.remove('active');
      document.getElementById('lisix').classList.remove('active');
      document.getElementById('liseven').classList.remove('active');
      document.getElementById('lieight').classList.remove('active');
      document.getElementById('linine').classList.remove('active');
      document.getElementById('lizero').classList.remove('active');
      //document.getElementById('liten').classList.remove('active');
      //document.getElementById('lieleven').classList.remove('active');
    }
    else if (id === 'litwo' || id === 'li2') {
      id = 'litwo';
      document.getElementById('lione').classList.remove('active');
      document.getElementById('litwo').classList.add('active');
      document.getElementById('lithree').classList.remove('active');
      document.getElementById('lifour').classList.remove('active');
      document.getElementById('lifive').classList.remove('active');
      document.getElementById('lisix').classList.remove('active');
      document.getElementById('liseven').classList.remove('active');
      document.getElementById('lieight').classList.remove('active');
      document.getElementById('linine').classList.remove('active');
      document.getElementById('lizero').classList.remove('active');
      /* document.getElementById('liten').classList.remove('active');
      document.getElementById('lieleven').classList.remove('active'); */
    }
    else if (id === 'lithree' || id === 'li3') {
      id = 'lithree';
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
      /* document.getElementById('liten').classList.remove('active');
      document.getElementById('lieleven').classList.remove('active'); */
    }
    else if (id === 'lifour' || id === 'li4') {
      id = 'lifour';
      document.getElementById('lione').classList.remove('active');
      document.getElementById('litwo').classList.remove('active');
      document.getElementById('lithree').classList.remove('active');
      document.getElementById('lifour').classList.add('active');
      document.getElementById('lifive').classList.remove('active');
      document.getElementById('lisix').classList.remove('active');
      document.getElementById('liseven').classList.remove('active');
      document.getElementById('lieight').classList.remove('active');
      document.getElementById('linine').classList.remove('active');
      document.getElementById('lizero').classList.remove('active');
      /* document.getElementById('liten').classList.remove('active');
      document.getElementById('lieleven').classList.remove('active'); */
    }
    else if (id === 'lifive' || id === 'li5') {
      id = 'lifive';
      document.getElementById('lione').classList.remove('active');
      document.getElementById('litwo').classList.remove('active');
      document.getElementById('lithree').classList.remove('active');
      document.getElementById('lifour').classList.remove('active');
      document.getElementById('lifive').classList.add('active');
      document.getElementById('lisix').classList.remove('active');
      document.getElementById('liseven').classList.remove('active');
      document.getElementById('lieight').classList.remove('active');
      document.getElementById('linine').classList.remove('active');
      document.getElementById('lizero').classList.remove('active');
      /* document.getElementById('liten').classList.remove('active');
      document.getElementById('lieleven').classList.remove('active'); */
    }
    else if (id === 'lisix' || id === 'li6') {
      id = 'lisix';
      document.getElementById('lione').classList.remove('active');
      document.getElementById('litwo').classList.remove('active');
      document.getElementById('lithree').classList.remove('active');
      document.getElementById('lifour').classList.remove('active');
      document.getElementById('lifive').classList.remove('active');
      document.getElementById('lisix').classList.add('active');
      document.getElementById('liseven').classList.remove('active');
      document.getElementById('lieight').classList.remove('active');
      document.getElementById('linine').classList.remove('active');
      document.getElementById('lizero').classList.remove('active');
      /* document.getElementById('liten').classList.remove('active');
      document.getElementById('lieleven').classList.remove('active'); */
    }
    else if (id === 'liseven' || id === 'li7') {
      id = 'liseven';
      document.getElementById('lione').classList.remove('active');
      document.getElementById('litwo').classList.remove('active');
      document.getElementById('lithree').classList.remove('active');
      document.getElementById('lifour').classList.remove('active');
      document.getElementById('lifive').classList.remove('active');
      document.getElementById('lisix').classList.remove('active');
      document.getElementById('liseven').classList.add('active');
      document.getElementById('lieight').classList.remove('active');
      document.getElementById('linine').classList.remove('active');
      document.getElementById('lizero').classList.remove('active');
      /* document.getElementById('liten').classList.remove('active');
      document.getElementById('lieleven').classList.remove('active'); */
    }
    else if (id === 'lieight' || id === 'li8') {
      id = 'lieight';
      document.getElementById('lione').classList.remove('active');
      document.getElementById('litwo').classList.remove('active');
      document.getElementById('lithree').classList.remove('active');
      document.getElementById('lifour').classList.remove('active');
      document.getElementById('lifive').classList.remove('active');
      document.getElementById('lisix').classList.remove('active');
      document.getElementById('liseven').classList.remove('active');
      document.getElementById('lieight').classList.add('active');
      document.getElementById('linine').classList.remove('active');
      document.getElementById('lizero').classList.remove('active');
      /* document.getElementById('liten').classList.remove('active');
      document.getElementById('lieleven').classList.remove('active'); */
    }
    else if (id === 'linine' || id === 'li9') {
      id = 'linine';
      document.getElementById('lione').classList.remove('active');
      document.getElementById('litwo').classList.remove('active');
      document.getElementById('lithree').classList.remove('active');
      document.getElementById('lifour').classList.remove('active');
      document.getElementById('lifive').classList.remove('active');
      document.getElementById('lisix').classList.remove('active');
      document.getElementById('liseven').classList.remove('active');
      document.getElementById('lieight').classList.remove('active');
      document.getElementById('linine').classList.add('active');
      document.getElementById('lizero').classList.remove('active');
      /* document.getElementById('liten').classList.remove('active');
      document.getElementById('lieleven').classList.remove('active'); */
    }
    else if (id === 'liten' || id === 'liX') {
      id = 'liten';
      document.getElementById('lione').classList.remove('active');
      document.getElementById('litwo').classList.remove('active');
      document.getElementById('lithree').classList.remove('active');
      document.getElementById('lifour').classList.remove('active');
      document.getElementById('lifive').classList.remove('active');
      document.getElementById('lisix').classList.remove('active');
      document.getElementById('liseven').classList.remove('active');
      document.getElementById('lieight').classList.remove('active');
      document.getElementById('linine').classList.remove('active');
      document.getElementById('lizero').classList.remove('active');
      /* document.getElementById('liten').classList.add('active');
      document.getElementById('lieleven').classList.remove('active'); */
    }
    else if (id === 'lizero' || id === 'li0') {
      id = 'lizero';
      document.getElementById('lione').classList.remove('active');
      document.getElementById('litwo').classList.remove('active');
      document.getElementById('lithree').classList.remove('active');
      document.getElementById('lifour').classList.remove('active');
      document.getElementById('lifive').classList.remove('active');
      document.getElementById('lisix').classList.remove('active');
      document.getElementById('liseven').classList.remove('active');
      document.getElementById('lieight').classList.remove('active');
      document.getElementById('linine').classList.remove('active');
      /* document.getElementById('liten').classList.remove('active'); */
      document.getElementById('lizero').classList.add('active');
    }
  }


  
  checkInstituteType() {
    let type: any = sessionStorage.getItem('institute_type');
    if (type == "LANG") {
      this.isLangInstitute = true;
    } else {
      this.isLangInstitute = false;
    }
  }


  /// Teacher Role Found
  teacherLoginFound() {
    document.getElementById('lithree').classList.remove('hide');
    document.getElementById('lifour').classList.remove('hide');
    document.getElementById('lisix').classList.remove('hide');
  }

}
