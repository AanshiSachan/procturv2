import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../../../app.component';
import { LoginService } from '../../../services/login-services/login.service';

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

  constructor(private router: Router, private appC: AppComponent, private login: LoginService) {
    this.switchActiveView('home');
  }

  ngOnInit() {
    this.isProfessional = sessionStorage.getItem('institute_type') == 'LANG';
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));
    this.fetchAndUpdatePermissions();
  }


  switchActiveView(id) {
    document.getElementById('home').classList.remove('active');
    document.getElementById('attendance').classList.remove('active');
    document.getElementById('sms').classList.remove('active');
    document.getElementById('fee').classList.remove('active');
    document.getElementById('exam').classList.remove('active');
    document.getElementById('report').classList.remove('active');
    document.getElementById('time').classList.remove('active');
    document.getElementById('email').classList.remove('active');
    document.getElementById('profit').classList.remove('active');
    switch (id) {
      case 'home': { document.getElementById('home').classList.add('active'); break; }
      case 'attendance': { document.getElementById('attendance').classList.add('active'); break; }
      case 'sms': { document.getElementById('sms').classList.add('active'); break; }
      case 'fee': { document.getElementById('fee').classList.add('active'); break; }
      case 'exam': { document.getElementById('exam').classList.add('active'); break; }
      case 'report': { document.getElementById('report').classList.add('active'); break; }
      case 'time': { document.getElementById('time').classList.add('active'); break; }
      case 'email': { document.getElementById('email').classList.add('active'); break; }
      case 'profit': { document.getElementById('profit').classList.add('active'); break; }
    }
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
      }
    }
    else {
      console.log(permissions);
    }
  }

}
