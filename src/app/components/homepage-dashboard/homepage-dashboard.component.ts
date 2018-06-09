import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-homepage-dashboard',
  templateUrl: './homepage-dashboard.component.html',
  styleUrls: ['./homepage-dashboard.component.scss']
})
export class HomepageDashboardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.removeFullscreen();
    this.removeSelectionFromSideNav();
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
    document.getElementById('lizero').classList.add('active');
  }

}
