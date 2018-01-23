import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login-services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {

  constructor(
    private router: Router,
    private login: LoginService,
  ) { }

  ngOnInit() {
    this.removeFullscreen();
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));
    this.checkWhichTabIsOpen();
  }


  checkWhichTabIsOpen() {
    if (this.router.url.includes('standardlist')) {
      this.switchActiveView('liStandard');
    } else if (this.router.url.includes('subject')) {
      this.switchActiveView('liSubject');
    } else if (this.router.url.includes('exam')) {
      this.switchActiveView('liCourses');
    } else if (this.router.url.includes('courselist')) {
      this.switchActiveView('liExam');
    } else if (this.router.url.includes('class')) {
      this.switchActiveView('liClass');
    }
  }

  switchActiveView(showId) {
    document.getElementById('liStandard').classList.remove('active');
    document.getElementById('liSubject').classList.remove('active');
    document.getElementById('liCourses').classList.remove('active');
    document.getElementById('liExam').classList.remove('active');
    document.getElementById('liClass').classList.remove('active');
    document.getElementById(showId).classList.add('active');
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
