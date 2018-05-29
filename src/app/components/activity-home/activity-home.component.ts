import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login-services/login.service';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-activity-home',
  templateUrl: './activity-home.component.html',
  styleUrls: ['./activity-home.component.scss']
})
export class ActivityHomeComponent implements OnInit {

  constructor(private login: LoginService, private appC: AppComponent) { }

  ngOnInit() {
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));
    this.removeFullscreen();
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
