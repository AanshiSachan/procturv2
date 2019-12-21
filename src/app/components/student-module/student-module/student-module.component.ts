import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-student-module',
  templateUrl: './student-module.component.html',
  styleUrls: ['./student-module.component.scss']
})
export class StudentModuleComponent implements OnInit, OnDestroy {

  constructor() { }

  ngOnInit() {
    this.checkDownloadPermissionAccess();
  }

  ngOnDestroy() {
    sessionStorage.removeItem('downloadStudentReportAccess');
  }

  // to check user has permission to download any Student reports 
  // Nalini
  checkDownloadPermissionAccess() {
      let temp = sessionStorage.getItem('permissions');
      if(temp.includes('724') || (sessionStorage.getItem('username')=='admin')){
      sessionStorage.setItem('downloadStudentReportAccess',String(true));
    }
}

}
