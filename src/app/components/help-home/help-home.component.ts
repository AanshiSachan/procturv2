import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-help-home',
  templateUrl: './help-home.component.html',
  styleUrls: ['./help-home.component.scss']
})
export class HelpHomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    let classArray = ['lione', 'litwo', 'lithree', 'lifour', 'lifive', 'lisix', 'liseven', 'lieight', 'linine', 'lizero'];
    classArray.forEach(function (className) {
      document.getElementById(className).classList.remove('active');
    });
  }

}
