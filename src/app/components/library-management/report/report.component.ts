import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.checkWhichTabIsOpen();
  }

  toggle(id){
    for(let i = 0; i < 7; i++){
      document.getElementsByClassName("horizontal-menu-item")[i].classList.remove("active-menu");
    }
      document.getElementById(id).classList.add("active-menu");
  }

  checkWhichTabIsOpen() {
    if (this.router.url.includes('lost')) {
      this.toggle('lost');
    } else if (this.router.url.includes('scrap')) {
      this.toggle('scrap');
    } else if (this.router.url.includes('fine')) {
      this.toggle('fine');
    } else if (this.router.url.includes('report/issued')) {
      this.toggle('issued');
    } else if (this.router.url.includes('overdue')) {
      this.toggle('overdue');
    } else if (this.router.url.includes('never')) {
      this.toggle('never');
    } else if (this.router.url.includes('retrun-book')) {
      this.toggle('return');
    }
  }

}
