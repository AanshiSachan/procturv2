import { Component, OnInit, OnDestroy } from '@angular/core';
import { role } from '../../../model/role_features';

@Component({
  selector: 'app-student-module',
  templateUrl: './student-module.component.html',
  styleUrls: ['./student-module.component.scss']
})
export class StudentModuleComponent implements OnInit, OnDestroy {
  role_feature = role.features;

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
      if(this.role_feature.DOWNLOAD_STUDENT_REPORT || (sessionStorage.getItem('username')=='admin')){
      sessionStorage.setItem('downloadStudentReportAccess',String(true));
    }
}

}
