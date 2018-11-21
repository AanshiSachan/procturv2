import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../../../app.component';
import { AuthenticatorService } from '../../../services/authenticator.service';

@Component({
  selector: 'app-report-home',
  templateUrl: './report-home.component.html',
  styleUrls: ['./report-home.component.scss']
})
export class ReportHomeComponent implements OnInit {

  isProfessional: boolean;

  isProfitnloss: boolean
  isEmail: boolean
  isTimetable: boolean
  isReportCard: boolean
  isExam: boolean
  isSms: boolean
  isFee: boolean
  isBiometric: boolean
  isAttendance: boolean
  biometricAttendanceEnable: boolean = true;
  reportEnquiry: boolean;

  constructor(
    private router: Router,
    private appC: AppComponent,
    private auth: AuthenticatorService) {
    this.switchActiveView('home');
  }

  ngOnInit() {
    this.biometricAttendanceEnable = sessionStorage.getItem('biometric_attendance_feature') == '1';
    this.auth.institute_type.subscribe(
      res => {
        if (res == 'LANG') {
          this.isProfessional = true;
        } else {
          this.isProfessional = false;
        }
      }
    )
    this.fetchAndUpdatePermissions();
  }

    // changed by laxmi
    switchActiveView(id) {
      let classArray = ['home','attendance','sms','fee','exam','report','time','email','profit'];
  
      classArray.forEach((classname)=>{
        document.getElementById(classname).classList.remove('active');
      });
      document.getElementById(id).classList.add('active');   
    }

  fetchAndUpdatePermissions() {
    let permissions = sessionStorage.getItem('permissions');

    /* Admin Account Detected */
    if (permissions == '' || permissions == null || permissions == undefined) {
      if (sessionStorage.getItem('userType') == '0') {
        this.isProfitnloss = true;
        this.isEmail = true;
        this.isTimetable = true;
        this.isReportCard = true;
        this.isExam = true;
        this.isSms = true;
        this.isFee = true;
        this.isBiometric = true;
        this.isAttendance = true;
        this.reportEnquiry = true;
      }
      else if (sessionStorage.getItem('userType') == '3') {
        this.isProfitnloss = false;
        this.isEmail = false;
        this.isTimetable = true;
        this.isReportCard = true;
        this.isExam = true;
        this.isFee = false;
        this.isBiometric = true;
        this.isAttendance = true;
        this.isSms = false;
        this.reportEnquiry = false;
      }
    }
    else {
      let perm: any[] = JSON.parse(permissions);

      /* attendance */
      if (perm.indexOf('201') != -1) {
        this.isAttendance = true;
        this.isBiometric = true;
      }

      /* fee */
      if (perm.indexOf('202') != -1) {
        this.isFee = true;
      }

      /* exam */
      if (perm.indexOf('203') != -1) {
        this.isExam = true;
      }

      /* student report */
      if (perm.indexOf('204') != -1) {
        this.isReportCard = true;
      }

      /* timetable */
      if (perm.indexOf('205') != -1) {
        this.isTimetable = true;
      }

      /* sms */
      if (perm.indexOf('206') != -1) {
        this.isSms = true;
      }

      /* email */
      if (perm.indexOf('207') != -1) {
        this.isEmail = true;
      }

      /* profit and lodd */
      if (perm.indexOf('208') != -1) {
        this.isProfitnloss = true;
      }
    }
  }

}
