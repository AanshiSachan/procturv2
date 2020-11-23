import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { role } from '../../../model/role_features';

@Component({
  selector: 'app-enquiry-report',
  templateUrl: './enquiry-report.component.html',
  styleUrls: ['./enquiry-report.component.scss']
})
export class EnquiryReportComponent implements OnInit {
  constructor(private route: Router) { }
  jsonReportFlags = {
    isCounsellor: false,
    isSource: false,
    isRefferBy: false,
  }
  activeView = 'cousellor';
  role_feature = role.features;

  ngOnInit() {
    // Changes done by Nalini - To handle role based conditions
    if (sessionStorage.getItem('userType') != '0' || sessionStorage.getItem('username') != 'admin') {
      if (sessionStorage.getItem('permissions') != '' && sessionStorage.getItem('permissions') != null) {
        if(this.role_feature.REPORTS_ENQUIRY_REFFER_BY) {
          this.jsonReportFlags.isRefferBy = true;
          this.activeView = 'liReferredBy';
          // document.getElementById('liReferredBy').classList.add('active');
          this.route.navigateByUrl('/view/leads/enquiryReport/referredBy');
        }
        if(this.role_feature.REPORTS_ENQUIRY_SOURCE) {
          this.jsonReportFlags.isSource = true;
          this.activeView = 'liSource';
          // document.getElementById('liSource').classList.add('active');
          this.route.navigateByUrl('/view/leads/enquiryReport/source');
        }
        if(this.role_feature.REPORT_ENQUIRY_COUNSELLOR) {
          this.jsonReportFlags.isCounsellor = true;
          this.activeView = 'liCounsellor';
          this.route.navigateByUrl('/view/leads/enquiryReport/counsellor');
          // document.getElementById('liCounsellor').classList.add('active');
        }
      }
    } else {
      let array = Object.keys(this.jsonReportFlags);
      array.forEach((flag) => {
        this.jsonReportFlags[flag] = true;
      });
    }
  }

  switchActiveView(showId) {
    // Changes done by Nalini - code refactoring
    this.activeView = showId;

  }

}
