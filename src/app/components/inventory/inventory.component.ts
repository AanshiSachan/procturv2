import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login-services/login.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {

  constructor(
    private router: Router,
    private login: LoginService,
  ) {
  }

  ngOnInit() {
    this.removeFullscreen();
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));
    if (this.router.url.includes('category')) {
      this.switchActiveView('category');
    } else {
      this.switchActiveView('item');
    }
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


  switchActiveView(tabName) {
    document.getElementById('item').classList.remove('active');
    document.getElementById('category').classList.remove('active');
    document.getElementById(tabName).classList.add('active');
  }

}