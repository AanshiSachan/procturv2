import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings-home',
  templateUrl: './settings-home.component.html',
  styleUrls: ['./settings-home.component.scss']
})
export class SettingsHomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    let classArray = ['lione', 'litwo', 'lithree', 'lifour', 'lifive', 'lisix', 'liseven', 'lieight', 'linine', 'lizero'];
    classArray.forEach(function (className) {

      document.getElementById(className).classList.remove('active');
    });
  }


}
