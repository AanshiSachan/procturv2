import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  biometricAttendanceEnable: boolean = true;

  constructor(private route: Router) {

  }

  ngOnInit() {
    this.biometricAttendanceEnable = sessionStorage.getItem('biometric_attendance_feature') == '1';
  }

  // changed by laxmi
  switchActiveView(id) {
    let classArray = ['home','attendance','sms','biometric','fee','exam','report','time','email','profit'];
    classArray.forEach((classname)=>{
      document.getElementById(classname).classList.remove('active');
    });
    switch (id) {
      case 'home': { document.getElementById('home').classList.add('active'); break; }
      case 'attendance': { document.getElementById('attendance').classList.add('active'); break; }
      case 'biometric': { document.getElementById('biometric').classList.add('active'); break; }
      case 'sms': { document.getElementById('sms').classList.add('active'); break; }
      case 'fee': { document.getElementById('fee').classList.add('active'); break; }
      case 'exam': { document.getElementById('exam').classList.add('active'); break; }
      case 'report': { document.getElementById('report').classList.add('active'); break; }
      case 'time': { document.getElementById('time').classList.add('active'); break; }
      case 'email': { document.getElementById('email').classList.add('active'); break; }
      case 'profit': { document.getElementById('profit').classList.add('active'); break; }
    }
  }

  // checkUserAccess() {
  //   this.route.navigateByUrl('/reports/sms');
  // }


}
