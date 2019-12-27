import { Component, OnInit, AfterContentChecked } from '@angular/core';

@Component({
  selector: 'app-library-management',
  templateUrl: './library-management.component.html',
  styleUrls: ['./library-management.component.scss']
})
export class LibraryManagementComponent implements OnInit, AfterContentChecked {

  activeSession: any = 'issue';

  constructor() { }

  ngOnInit() {
  }

  ngAfterContentChecked() {
    this.setActiveClassOnSideNav();
  }



  setActiveClassOnSideNav() {
    let pathLastURL;
    var str = window.location.href;
    let pathURL = str.substring(str.lastIndexOf("/") + 1, str.length);

    switch (pathURL) {
      case 'overdue':
      case 'never-issued':
      case 'retrun-book':
      case 'issued':
      case 'lost':
      case 'fine': {
        this.activeSession = 'report';
        break;
      }
      case 'issue': {
        this.activeSession = pathURL;
        break;
      }
      
      case 'dashboard': {
        this.activeSession = pathURL;
        break;
      }
      case 'issue': {
        this.activeSession = pathURL;
        break;
      }
      case 'return': {
        this.activeSession = pathURL;
        break;
      }
      case 'add': {
        this.activeSession = pathURL;
        break;
      }
    }
  }

}
