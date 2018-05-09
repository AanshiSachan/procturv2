import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login-services/login.service';

@Component({
  selector: 'app-users',
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.scss']
})
export class UsersManagementComponent implements OnInit {

  constructor(
    private router: Router,
    private login: LoginService,
  ) { }

  ngOnInit() {
    this.removeSelectionFromSideNav();
    this.removeFullscreen();
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));
    this.checkWhichTabIsOpen();
  }

  checkWhichTabIsOpen() {
    let url = this.router.url;
    if (url.includes('user')) {
      this.switchActiveView('liUser');
    } else {
      this.switchActiveView('liRole');
    }
  }

  switchActiveView(id) {
    document.getElementById('liUser').classList.remove('active');
    document.getElementById('liRole').classList.remove('active');
    document.getElementById(id).classList.add('active');
  }

  removeSelectionFromSideNav() {
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
