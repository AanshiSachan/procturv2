import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.scss']
})
export class UsersManagementComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.removeSelectionFromSideNav();
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
    // let classArray = ['lione', 'litwo', 'lithree', 'lifour', 'lifive', 'lisix', 'liseven', 'lieight', 'linine', 'lizero'];
    // classArray.forEach(function (className) {
    //   document.getElementById(className).classList.remove('active');
    // });
  }

}
