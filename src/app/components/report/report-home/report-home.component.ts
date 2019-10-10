import { Component, OnInit } from '@angular/core';
import { AuthenticatorService } from '../../../services/authenticator.service';


@Component({
  selector: 'app-report-home',
  templateUrl: './report-home.component.html',
  styleUrls: ['./report-home.component.scss']
})
export class ReportHomeComponent implements OnInit {

  JsonFlags = {
    isShowEnquiryReport: false,
    biometricAttendanceEnable: true,
    reportEnquiry: false,
    isFee: false,
    isAttendance: false,
    isSms: false,
    isBiometric: false,
    isExam: false,
    isReportCard: false,
    isEmail: false,
    isProfitnloss: false,
    isProfessional: false
  }


  constructor(private auth: AuthenticatorService) {
    this.switchActiveView('home');
  }

  ngOnInit() {
    this.JsonFlags.biometricAttendanceEnable = sessionStorage.getItem('biometric_attendance_feature') == '1';
    this.auth.institute_type.subscribe(
      res => {
        if (res == 'LANG') {
          this.JsonFlags.isProfessional = true;
        } else {
          this.JsonFlags.isProfessional = false;
        }
      }
    )
    this.fetchAndUpdatePermissions();
  }

  // changed by laxmi
  switchActiveView(id) {
    let classArray = ['home', 'attendance', 'sms', 'fee', 'exam', 'report', 'time', 'email', 'profit'];

    classArray.forEach((classname) => {
      document.getElementById(classname).classList.remove('active');
    });
    document.getElementById(id).classList.add('active');
  }

  fetchAndUpdatePermissions() {
    let permissions = sessionStorage.getItem('permissions');

    /* Admin Account Detected */
    if (permissions == '' || permissions == null || permissions == undefined) {
      if (sessionStorage.getItem('userType') == '0') {
        this.JsonFlags.isProfitnloss = true;
        this.JsonFlags.isEmail = true;
        this.JsonFlags.isReportCard = true;
        this.JsonFlags.isExam = true;
        this.JsonFlags.isSms = true;
        this.JsonFlags.isFee = true;
        this.JsonFlags.isBiometric = true;
        this.JsonFlags.isAttendance = true;
        this.JsonFlags.reportEnquiry = true;
        this.JsonFlags.isShowEnquiryReport = true;
      }
      else if (sessionStorage.getItem('userType') == '3') {
        this.JsonFlags.isProfitnloss = false;
        this.JsonFlags.isEmail = false;
        this.JsonFlags.isReportCard = true;
        this.JsonFlags.isExam = true;
        this.JsonFlags.isFee = false;
        this.JsonFlags.isBiometric = true;
        this.JsonFlags.isAttendance = true;
        this.JsonFlags.isSms = false;
        this.JsonFlags.reportEnquiry = false;
        this.JsonFlags.isShowEnquiryReport = false;
      }
    }
    else {
      let perm: any[] = JSON.parse(permissions);

      /* attendance */
      if (perm.indexOf('201') != -1) {
        this.JsonFlags.isAttendance = true;
        this.JsonFlags.isBiometric = true;
      }

      /* fee */
      if (perm.indexOf('202') != -1) {
        this.JsonFlags.isFee = true;
      }

      /* exam */
      if (perm.indexOf('203') != -1) {
        this.JsonFlags.isExam = true;
      }

      /* student report */
      if (perm.indexOf('204') != -1) {
        this.JsonFlags.isReportCard = true;
      }

      /* sms */
      if (perm.indexOf('206') != -1) {
        this.JsonFlags.isSms = true;
      }

      /* email */
      if (perm.indexOf('207') != -1) {
        this.JsonFlags.isEmail = true;
      }

      /* profit and lodd */
      if (perm.indexOf('208') != -1) {
        this.JsonFlags.isProfitnloss = true;
      }
      /* Reports-Enquiry Report */
      if (perm.indexOf('722') != -1) {
        this.JsonFlags.isShowEnquiryReport = true;
        // this.JsonFlags.isExam = true;
      }
    }
  }

}
