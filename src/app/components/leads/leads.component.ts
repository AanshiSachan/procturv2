import { Component, OnInit, OnDestroy } from '@angular/core';
import { role } from '../../model/role_features';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.scss']
})
export class LeadsComponent implements OnInit, OnDestroy {
  role_feature = role.features;

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
      if(this.role_feature.DOWNLOAD_ENQUIRY_REPORT || (sessionStorage.getItem('username')=='admin')){
      sessionStorage.setItem('downloadEnquiryReportAccess',String(true));
    }
}

}
