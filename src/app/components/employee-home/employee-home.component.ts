import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login-services/login.service';

@Component({
  selector: 'app-employee-home',
  templateUrl: './employee-home.component.html',
  styleUrls: ['./employee-home.component.scss']
})
export class EmployeeHomeComponent implements OnInit {

  constructor(
    private login: LoginService
  ) { }

  ngOnInit() {
    this.removeFullscreen();
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));
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
