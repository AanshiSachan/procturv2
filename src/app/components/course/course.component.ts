import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login-services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {

  isLangInstitue: boolean = false;

  constructor(
    private router: Router,
    private login: LoginService,
  ) { }

  ngOnInit() {
    this.checkInstituteType();
    this.removeFullscreen();
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));
    this.checkWhichTabIsOpen();
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
  }

  checkInstituteType() {
    let type: any = sessionStorage.getItem('institute_type');
    if (type == "LANG") {
      this.isLangInstitue = true;
    } else {
      this.isLangInstitue = false;
    }
  }


  checkWhichTabIsOpen() {
    if (this.router.url.includes('standardlist')) {
      this.switchActiveView('liStandard');
    } else if (this.router.url.includes('subject')) {
      this.switchActiveView('liSubject');
    } else if (this.router.url.includes('courselist')) {
      this.switchActiveView('liCourses');
    } else if (this.router.url.includes('exam')) {
      this.switchActiveView('liExam');
    } else if (this.router.url.includes('class')) {
      this.switchActiveView('liClass');
    } else if (this.router.url.includes('managebatch')) {
      this.switchActiveView('liManageBatch');
    }
  }

  switchActiveView(showId) {
    setTimeout(() => {
      document.getElementById('liStandard').classList.remove('active');
      document.getElementById('liSubject').classList.remove('active');
      document.getElementById('liExam').classList.remove('active');
      document.getElementById('liClass').classList.remove('active');
      if (this.isLangInstitue) {
        document.getElementById('liManageBatch').classList.remove('active');
      } else {
        document.getElementById('liCourses').classList.remove('active');
      }
      document.getElementById(showId).classList.add('active');
    }, 200)
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

}
