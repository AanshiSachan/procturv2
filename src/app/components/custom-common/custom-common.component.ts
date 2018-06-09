import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-custom-common',
  templateUrl: './custom-common.component.html',
  styleUrls: ['./custom-common.component.scss']
})
export class CustomCommonComponent implements OnInit {

  constructor() { }

  ngOnInit() {

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
