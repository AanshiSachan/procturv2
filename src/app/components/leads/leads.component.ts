import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.scss']
})
export class LeadsComponent implements OnInit, OnDestroy {

  constructor() { }

  ngOnInit() {
    this.checkDownloadPermissionAccess();
  }

  ngOnDestroy() {
    sessionStorage.removeItem('downloadEnquiryReportAccess');
  }

  // to check user has permission to download any Enquiry reports 
  // Nalini
  checkDownloadPermissionAccess() {
      let temp = sessionStorage.getItem('permissions'); 
      if(temp.includes('723') || (sessionStorage.getItem('username')=='admin')){
      sessionStorage.setItem('downloadEnquiryReportAccess',String(true));
    }
}

}
