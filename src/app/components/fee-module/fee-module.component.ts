import { Component, OnInit, OnDestroy } from '@angular/core';
import { role } from '../../model/role_features';

@Component({
  selector: 'app-fee',
  templateUrl: './fee-module.component.html',
  styleUrls: ['./fee-module.component.scss']
})
export class FeeComponent implements OnInit, OnDestroy {
  role_feature = role.features;
  constructor() { }

  ngOnInit() {
    this.checkDownloadPermissionAccess();
  }
  ngOnDestroy() {
    sessionStorage.removeItem('downloadFeeReportAccess');
  }

  // to check user has permission to download any Fee reports 
  // Nalini
  checkDownloadPermissionAccess() {
      if(this.role_feature.DOWNLOAD_FEE_REPORT || (sessionStorage.getItem('username')=='admin')){
      sessionStorage.setItem('downloadFeeReportAccess',String(true));
    }
}
}