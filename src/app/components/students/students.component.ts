import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {

  constructor(private router: Router) {
   }

  ngOnInit() {
    let classArray = ['lione', 'litwo', 'lithree', 'lifour', 'lifive', 'lisix', 'liseven', 'lieight', 'linine'];
    classArray.forEach(function (className) {
      // console.log(className);
      document.getElementById(className).classList.remove('active');
    });
    document.getElementById('litwo').classList.add('active');
  }

}
