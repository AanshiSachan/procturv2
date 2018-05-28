import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fee-report-home',
  templateUrl: './fee-report-home.component.html',
  styleUrls: ['./fee-report-home.component.scss']
})
export class FeeReportHomeComponent implements OnInit {

  isProfessional: boolean = false;

  constructor() {
  }

  ngOnInit() {
    this.isProfessional = sessionStorage.getItem('institute_type') == 'LANG';
  }

}
