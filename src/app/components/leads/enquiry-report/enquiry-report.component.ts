import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-enquiry-report',
  templateUrl: './enquiry-report.component.html',
  styleUrls: ['./enquiry-report.component.scss']
})
export class EnquiryReportComponent implements OnInit {
  constructor(private route: Router) { }

  ngOnInit() {
    this.route.navigateByUrl('/view/leads/enquiryReport/counsellor');
    document.getElementById('liCounsellor').classList.add('active');
  }

  switchActiveView(showId) {
    console.log(showId);
    if (showId === 'liReferredBy') {
      document.getElementById('liReferredBy').classList.add('active');
      document.getElementById('liCounsellor').classList.remove('active');
      document.getElementById('liSource').classList.remove('active');
    } else if (showId === 'liCounsellor') {
      document.getElementById('liCounsellor').classList.add('active');
      document.getElementById('liReferredBy').classList.remove('active');
      document.getElementById('liSource').classList.remove('active');
    } else if (showId === 'liSource') {
      document.getElementById('liSource').classList.add('active');
      document.getElementById('liCounsellor').classList.remove('active');
      document.getElementById('liReferredBy').classList.remove('active');
    }

  }

}
