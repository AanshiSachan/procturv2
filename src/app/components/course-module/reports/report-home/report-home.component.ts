import { Component, OnInit } from '@angular/core';
import { role } from '../../../../model/role_features';
import { AuthenticatorService } from '../../../../services/authenticator.service';

@Component({
  selector: 'app-report-home',
  templateUrl: './report-home.component.html',
  styleUrls: ['./report-home.component.scss']
})
export class ReportHomeComponent implements OnInit {

  type: any = '';
  JsonFlags = {
    biometricAttendanceEnable: false,
    isShowAttendanceReport: false,
    isShowExamReport: false

  }
  role_feature = role.features;
  constructor(private auth: AuthenticatorService) { }

  ngOnInit() {
    this.JsonFlags.biometricAttendanceEnable = sessionStorage.getItem('biometric_attendance_feature') == '1';
    this.auth.institute_type.subscribe(
      res => {
        if (res == 'LANG') {
          this.type = 'batch';
        } else {
          this.type = 'course';
        }
      });

    this.fetchAndUpdatePermissions();
  }

  fetchAndUpdatePermissions() {
    let permissions = sessionStorage.getItem('permissions');

    /* Admin Account Detected */
    if (permissions == '' || permissions == null || permissions == undefined) {
      if (sessionStorage.getItem('userType') == '0') {
        this.JsonFlags.isShowExamReport = true;
        this.JsonFlags.isShowAttendanceReport = true;
      }
      else if (sessionStorage.getItem('userType') == '3') { // reaport 
        this.JsonFlags.isShowExamReport = true;
        this.JsonFlags.isShowAttendanceReport = true;
      }
    }
    else {
      let perm: any[] = JSON.parse(permissions);

      /* attendance */
      if (this.role_feature.REPORT_COURSE_ATTENDANCE) {
        this.JsonFlags.isShowAttendanceReport = true;
      }

      if (this.role_feature.REPORTS_MENU && this.role_feature.REPORT_COURSE_EXAM_DASHBOARD) {
        this.JsonFlags.isShowExamReport = true;
      }

    }
  }

}
