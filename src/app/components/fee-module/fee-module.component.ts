import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-fee',
  templateUrl: './fee-module.component.html',
  styleUrls: ['./fee-module.component.scss']
})
export class FeeComponent implements OnInit, OnDestroy {
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
      let temp = sessionStorage.getItem('permissions');
      if(temp.includes('725') || (sessionStorage.getItem('username')=='admin')){
      sessionStorage.setItem('downloadFeeReportAccess',String(true));
    }
}
}