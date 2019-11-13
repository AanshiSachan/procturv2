import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'academic-year',
  templateUrl: './academic-year.component.html',
  styleUrls: ['./academic-year.component.scss']
})
export class AcademicYearComponent implements OnInit {

  constructor() {
  }

  /* OnInit recheck the status of li tab and set it to active here */
  ngOnInit() {
    let classArray = ['lione', 'litwo', 'lithree', 'lifour', 'lifive', 'lisix', 'liseven', 'lieight', 'linine', 'lizero'];
    classArray.forEach(function (className) {
      document.getElementById(className) && document.getElementById(className).classList.remove('active');
    });
  }

}
