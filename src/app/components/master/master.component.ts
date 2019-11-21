import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.scss']
})
export class MasterComponent implements OnInit {

  constructor(
  ) {
  }

  /* OnInit recheck the status of li tab and set it to active here */
  ngOnInit() {
    // let classArray = ['lione', 'litwo', 'lithree', 'lifour', 'lifive', 'lisix', 'liseven', 'lieight', 'linine', 'lizero'];
    // classArray.forEach(function (className) {
    //   document.getElementById(className).classList.remove('active');
    // });
  }

}