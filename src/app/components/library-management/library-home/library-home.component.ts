import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/Rx';
import { AppComponent } from '../../../app.component';
import * as moment from 'moment';
import { AddBookComponent } from '../add-book/add-book.component';

@Component({
  selector: 'app-library-home',
  templateUrl: './library-home.component.html',
  styleUrls: ['./library-home.component.scss']
})
export class LibraryHomeComponent implements OnInit {

  issueBook: boolean = true;
  returnBook: boolean = false;
  addBook: boolean = false;
  activity: boolean = false;
  report: boolean = false;
  dashboard: boolean = false;

  constructor(
    private appC: AppComponent,
    private router: Router,
    private actRoute: ActivatedRoute,
  ) { }

  ngOnInit() {

  }

  menuChange(id){
    this.issueBook = false;
    this.returnBook = false;
    this.addBook = false;
    this.activity = false;
    this.report = false;
    this.dashboard = false;

    switch (id) {
      case 'issue': {
        this.issueBook = true;
        break;
      }
      case 'return': {
        this.returnBook = true;
        break;
      }
      case 'add': {
        this.addBook = true;
        break;
      }
      case 'activity': {
        this.activity = true;
        break;
      }
      case 'report': {
        this.report = true;
        break;
      }
      case 'dashboard': {
        this.dashboard = true;
        break;
      }
    }
  }

}
