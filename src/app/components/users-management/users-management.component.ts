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
  }


  removeSelectionFromSideNav() {
    // let classArray = ['lione', 'litwo', 'lithree', 'lifour', 'lifive', 'lisix', 'liseven', 'lieight', 'linine', 'lizero'];
    // classArray.forEach(function (className) {
    //   document.getElementById(className).classList.remove('active');
    // });
  }

}
