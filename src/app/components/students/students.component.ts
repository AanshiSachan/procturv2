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
    document.getElementById('lione').classList.remove('active');
    document.getElementById('litwo').classList.add('active');
    document.getElementById('lithree').classList.remove('active');
    document.getElementById('lifour').classList.remove('active');
    document.getElementById('lifive').classList.remove('active');
    document.getElementById('lisix').classList.remove('active');
    document.getElementById('liseven').classList.remove('active');
    document.getElementById('lieight').classList.remove('active');
    document.getElementById('linine').classList.remove('active');
    //document.getElementById('liten').classList.remove('active');
    //document.getElementById('lieleven').classList.remove('active');
  }

}
