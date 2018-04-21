import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
   biometricAttendanceEnable:boolean=true;
  constructor(
    private route: Router
  ) {

  }

  ngOnInit() {
    this.biometricAttendanceEnable = sessionStorage.getItem('biometric_attendance_feature') == '1';
    this.removeFullscreen();
    this.removeSideNavSelection();
    this.checkUserAccess();
  }

  removeSideNavSelection() {
    document.getElementById('lione').classList.remove('active');
    document.getElementById('litwo').classList.remove('active');
    document.getElementById('lithree').classList.remove('active');
    document.getElementById('lifour').classList.remove('active');
    document.getElementById('lifive').classList.remove('active');
    document.getElementById('lisix').classList.add('active');
    document.getElementById('liseven').classList.remove('active');
    document.getElementById('lieight').classList.remove('active');
    document.getElementById('linine').classList.remove('active');
    //document.getElementById('liten').classList.remove('active');
    //document.getElementById('lieleven').classList.remove('active');
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

  switchActiveView(id) {
    document.getElementById('home').classList.remove('active');
    document.getElementById('attendance').classList.remove('active');
    document.getElementById('biometric').classList.remove('active');
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
      case 'biometric' : {document.getElementById('biometric').classList.add('active'); break;}
      case 'sms': { document.getElementById('sms').classList.add('active'); break; }
      case 'fee': { document.getElementById('fee').classList.add('active'); break; }
      case 'exam': { document.getElementById('exam').classList.add('active'); break; }
      case 'report': { document.getElementById('report').classList.add('active'); break; }
      case 'time': { document.getElementById('time').classList.add('active'); break; }
      case 'email': { document.getElementById('email').classList.add('active'); break; }
      case 'profit': { document.getElementById('profit').classList.add('active'); break; }
    }
  }

  checkUserAccess() {
    this.route.navigateByUrl('/reports/sms');
  }
  

}
