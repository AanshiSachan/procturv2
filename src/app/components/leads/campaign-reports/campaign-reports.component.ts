import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-campaign-reports',
  templateUrl: './campaign-reports.component.html',
  styleUrls: ['./campaign-reports.component.scss']
})
export class CampaignReportsComponent implements OnInit {
  constructor(private route: Router) { }

  ngOnInit() {
    this.route.navigateByUrl('/view/leads/campaign-reports/sms-report');
    document.getElementById('liSMSReport').classList.add('active');
  }

  switchActiveView(showId) {
    console.log(showId);
    if (showId === 'liSMSReport') {
      document.getElementById('liSMSReport').classList.add('active');
      document.getElementById('liLeadSMSReport').classList.remove('active');
    } else if (showId === 'liLeadSMSReport') {
      document.getElementById('liLeadSMSReport').classList.add('active');
      document.getElementById('liSMSReport').classList.remove('active');
    }
  }
}
