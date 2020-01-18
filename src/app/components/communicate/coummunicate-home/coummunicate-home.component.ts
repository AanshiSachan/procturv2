import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-coummunicate-home',
  templateUrl: './coummunicate-home.component.html',
  styleUrls: ['./coummunicate-home.component.scss']
})
export class CoummunicateHomeComponent implements OnInit {
 
  permissions: any;
  showSMSReport: boolean = false;
  showEmailReport: boolean = false;
  constructor() { }

  ngOnInit() {
    if(sessionStorage.getItem('userType') != '0' || sessionStorage.getItem('username') != 'admin'){
      if(sessionStorage.getItem('permissions') != '' && sessionStorage.getItem('permissions') != null){
          this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
          this.showSMSReport = this.permissions.includes('206') ? true: false;//sms visiblity
          this.showEmailReport = this.permissions.includes('207') ? true : false; //email visiblity          
      }
    }
    else {
      this.showSMSReport = true;
      this.showEmailReport = true;
    }
  }

}
